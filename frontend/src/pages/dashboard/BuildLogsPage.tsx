import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { subscribeToLogs } from '../../services/socket';

export function BuildLogsPage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const location = useLocation();
  const [logs, setLogs] = useState<string[]>([]);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!projectSlug) return;

    const unsubscribe = subscribeToLogs(`logs:${projectSlug}`, (line) => {
      setLogs((prev) => [...prev, line]);
    });

    return () => {
      unsubscribe?.();
    };
  }, [projectSlug]);

  useEffect(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
  }, [logs.length]);

  const effectiveSlug =
    (location.state as { projectSlug?: string } | null)?.projectSlug ??
    projectSlug;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-50">
            Build logs
          </h1>
          <p className="text-xs text-slate-400">
            Real-time output from your deployment workers.
          </p>
        </div>
        {effectiveSlug && (
          <p className="text-[11px] text-slate-400">
            Project:{' '}
            <span className="font-mono text-emerald-300">{effectiveSlug}</span>
          </p>
        )}
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="border-b border-slate-800/80 px-4 py-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            terminal • live build
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 border border-emerald-500/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        </div>

        <div
          ref={viewportRef}
          className="bg-black px-3 py-3 text-[11px] font-mono text-emerald-300 h-[420px] overflow-y-auto scrollbar-thin"
        >
          {logs.length === 0 ? (
            <p className="text-emerald-500/70">
              Waiting for logs from build worker…
            </p>
          ) : (
            logs.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

