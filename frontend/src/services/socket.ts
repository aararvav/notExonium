const SOCKET_URL = 'ws://localhost:9001';

type LogHandler = (line: string) => void;

let socket: WebSocket | null = null;
const subscriptions = new Map<string, Set<LogHandler>>();

function ensureSocket() {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    return;
  }

  socket = new WebSocket(SOCKET_URL);

  socket.addEventListener('message', (event) => {
    const data = event.data as string;
    try {
      const parsed = JSON.parse(data) as { channel?: string; message?: string };
      if (!parsed.channel || typeof parsed.message !== 'string') return;

      const handlers = subscriptions.get(parsed.channel);
      if (!handlers) return;
      handlers.forEach((handler) => handler(parsed.message!));
    } catch {
      // Fallback: broadcast raw line to all subscribers
      subscriptions.forEach((handlers) => {
        handlers.forEach((handler) => handler(data));
      });
    }
  });

  socket.addEventListener('close', () => {
    // simple reconnect strategy for dev
    setTimeout(() => {
      if ([...subscriptions.values()].some((set) => set.size > 0)) {
        ensureSocket();
      }
    }, 1000);
  });
}

export function subscribeToLogs(channel: string, handler: LogHandler): () => void {
  ensureSocket();

  if (!subscriptions.has(channel)) {
    subscriptions.set(channel, new Set());
  }

  const handlers = subscriptions.get(channel)!;
  handlers.add(handler);

  // Optionally send a subscription message if server expects it
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'subscribe', channel }));
  } else {
    socket?.addEventListener(
      'open',
      () => {
        socket?.send(JSON.stringify({ type: 'subscribe', channel }));
      },
      { once: true },
    );
  }

  return () => {
    const set = subscriptions.get(channel);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) {
      subscriptions.delete(channel);
      socket?.send(JSON.stringify({ type: 'unsubscribe', channel }));
    }
  };
}

