"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  ExternalLink,
  Copy,
  AlertCircle
} from "lucide-react";
import { Fira_Code } from "next/font/google";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:9002";
const firaCode = Fira_Code({ subsets: ["latin"] });

type LogEntry = {
  log: string;
  timestamp: number;
};

export default function LogsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<"building" | "success" | "error">("building");
  const [socketState, setSocketState] = useState<"connecting" | "connected" | "disconnected" | "error">("connecting");
  const [copied, setCopied] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const DEPLOY_BASE = process.env.NEXT_PUBLIC_DEPLOY_BASE_URL || "localhost:8000";
  const deployURL = `http://${projectId}.${DEPLOY_BASE}`;

  const handleSocketIncomingMessage = useCallback((message: unknown) => {
    console.log(`[Incoming Socket Message]:`, message);

    try {
      const parsed =
        typeof message === "string" ? JSON.parse(message) : message;
      if (parsed && typeof parsed === "object" && "log" in parsed && typeof parsed.log === "string") {
        const logEntry: LogEntry = {
          log: parsed.log,
          timestamp: Date.now(),
        };

        setLogs((prev) => [...prev, logEntry]);

        // Check for completion or error
        if (parsed.log.includes("Done") || parsed.log.includes("uploaded")) {
          setStatus("success");
        } else if (parsed.log.toLowerCase().includes("error")) {
          setStatus("error");
        }
      }
    } catch (error) {
      // Handle plain text messages
      const logEntry: LogEntry = {
        log: typeof message === "string" ? message : JSON.stringify(message),
        timestamp: Date.now(),
      };
      setLogs((prev) => [...prev, logEntry]);
    }
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    const channel = `logs:${projectId}`;

    socket.on("connect", () => {
      setSocketState("connected");
      socket.emit("subscribe", channel);
    });

    socket.on("disconnect", () => {
      setSocketState("disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setSocketState("error");
    });

    socket.on("message", handleSocketIncomingMessage);

    return () => {
      socket.off("message", handleSocketIncomingMessage);
      socket.disconnect();
    };
  }, [projectId, handleSocketIncomingMessage]);

  useEffect(() => {
    // Auto-scroll to bottom
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const copyURL = () => {
    navigator.clipboard.writeText(deployURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />
      
      <div className="relative container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="mb-6 bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.04] hover:text-white hover:border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                Deployment Logs
              </h1>
              <p className="text-gray-600">Project ID: {projectId}</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={
                  socketState === "connected"
                    ? "px-3 py-1.5 border-green-500/20 text-green-400 bg-green-500/10"
                    : socketState === "connecting"
                    ? "px-3 py-1.5 border-blue-500/20 text-blue-400 bg-blue-500/10"
                    : socketState === "error"
                    ? "px-3 py-1.5 border-red-500/20 text-red-400 bg-red-500/10"
                    : "px-3 py-1.5 border-gray-500/20 text-gray-400 bg-gray-500/10"
                }
              >
                Socket: {socketState}
              </Badge>
              {status === "building" && (
                <Badge variant="warning" className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Building
                </Badge>
              )}
              {status === "success" && (
                <Badge variant="success" className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 border-green-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Deployed
                </Badge>
              )}
              {status === "error" && (
                <Badge variant="destructive" className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 border-red-500/20">
                  <AlertCircle className="w-3 h-3" />
                  Failed
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Deployment URL Card */}
        {status === "success" && (
          <Card className="mb-6 bg-white/[0.02] border-white/10 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Your app is live at:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-purple-400 font-mono text-sm bg-white/[0.02] border border-white/10 px-3 py-1.5 rounded-lg">
                      {deployURL}
                    </code>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={copyURL}
                    variant="outline"
                    size="sm"
                    className="bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.04] hover:text-white hover:border-white/20"
                  >
                    {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => window.open(deployURL, "_blank")}
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Site
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logs Console */}
        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Build Logs</h2>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              ref={logContainerRef}
              className={`${firaCode.className} bg-black/40 rounded-lg p-4 h-[500px] overflow-y-auto border border-white/10`}
            >
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-600">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Waiting for logs...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {logs.map((entry, i) => (
                    <div
                      key={i}
                      className="text-sm hover:bg-white/[0.02] px-2 py-1 rounded transition-colors"
                    >
                      <span className="text-gray-700 mr-3">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-green-400">{entry.log}</span>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
