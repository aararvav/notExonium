"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Github, ArrowRight } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

export function DeployForm() {
  const [repoURL, setURL] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const normalizedRepoURL = useMemo(() => {
    const raw = repoURL.trim();
    if (!raw) return null;

    // Accept owner/repo shorthand.
    const shorthandMatch = raw.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?\$$/);
    if (shorthandMatch) {
      const [, owner, repo] = shorthandMatch;
      return `https://github.com/${owner}/${repo}`;
    }

    const sshMatch = raw.match(/^git@github\.com:([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?\$$/i);
    if (sshMatch) {
      const [, owner, repo] = sshMatch;
      return `https://github.com/${owner}/${repo}`;
    }

    const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    try {
      const parsed = new URL(candidate);
      const host = parsed.hostname.toLowerCase();
      if (host !== "github.com" && host !== "www.github.com") return null;

      const [owner, repoSegment] = parsed.pathname.split("/").filter(Boolean);
      if (!owner || !repoSegment) return null;

      const repo = repoSegment.replace(/\.git$/i, "");
      if (!repo) return null;

      return `https://github.com/${owner}/${repo}`;
    } catch {
      return null;
    }
  }, [repoURL]);

  const isValidURL = Boolean(normalizedRepoURL);

  const handleClickDeploy = useCallback(async () => {
    if (!normalizedRepoURL) return;
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/project`, {
        gitURL: normalizedRepoURL,
      });

      if (data && data.data) {
        const { projectSlug } = data.data;
        router.push(`/logs/${projectSlug}`);
      }
    } catch (error) {
      console.error("Deployment failed:", error);
    } finally {
      setLoading(false);
    }
  }, [normalizedRepoURL, router]);

  return (
    <div className="max-w-2xl mx-auto mb-16">
      <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl rounded-xl p-2 shadow-sm">
        <div className="flex items-center gap-2 bg-zinc-950 rounded-lg p-3 border border-zinc-800/50">
          <Github className="w-5 h-5 text-zinc-500 flex-shrink-0" />
          <Input
            disabled={loading}
            value={repoURL}
            onChange={(e) => setURL(e.target.value)}
            type="url"
            placeholder="https://github.com/username/repository"
            className="flex-1 bg-transparent border-0 text-white placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <button
          onClick={handleClickDeploy}
          disabled={!isValidURL || loading}
          className="w-full mt-2 h-12 bg-zinc-100 hover:bg-white text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              Deploy Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>

      {!isValidURL && repoURL && (
        <p className="text-sm text-red-400 text-center mt-3">
          Please enter a valid GitHub repository URL
        </p>
      )}

      <p className="text-sm text-zinc-500 text-center mt-4 font-medium">
        No credit card required • Deploy in seconds
      </p>
    </div>
  );
}
