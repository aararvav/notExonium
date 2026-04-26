"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainNav } from "@/components/main-nav";
import { 
  Github, 

  Zap, 
  Globe, 
  Code2,
  Cpu,
  Gauge,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

export default function Home() {
  const [repoURL, setURL] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const normalizedRepoURL = useMemo(() => {
    const raw = repoURL.trim();
    if (!raw) return null;

    // Accept owner/repo shorthand.
    const shorthandMatch = raw.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/);
    if (shorthandMatch) {
      const [, owner, repo] = shorthandMatch;
      return `https://github.com/${owner}/${repo}`;
    }

    const sshMatch = raw.match(/^git@github\.com:([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/i);
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
      const { data } = await axios.post(`http://localhost:9000/project`, {
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
    <main className="min-h-screen bg-[#0d0d0d] overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      <div className="relative z-10">
        {/* Navigation */}
        <MainNav />

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-sm text-gray-400">Trusted by developers worldwide</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-semibold mb-6 leading-[1.1] text-white tracking-tight">
                Deploy Your Code
                <br />
                <span className="text-gray-400">In Seconds</span>
              </h1>

              <p className="text-lg text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
                The fastest way to deploy your GitHub repositories.
                <br />From push to production in seconds.
              </p>

              {/* CTA Form */}
              <div className="max-w-2xl mx-auto mb-16">
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-xl p-1.5">
                  <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-3">
                    <Github className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <Input
                      disabled={loading}
                      value={repoURL}
                      onChange={(e) => setURL(e.target.value)}
                      type="url"
                      placeholder="https://github.com/username/repository"
                      className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <button
                    onClick={handleClickDeploy}
                    disabled={!isValidURL || loading}
                    className="w-full mt-1.5 h-12 bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

                <p className="text-sm text-gray-600 text-center mt-4">
                  No credit card required • Deploy in seconds
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-semibold text-white mb-1">10M+</div>
                  <p className="text-sm text-gray-600">Deployments</p>
                </div>
                <div className="text-center border-x border-white/5">
                  <div className="text-3xl font-semibold text-white mb-1">99.9%</div>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-semibold text-white mb-1">&lt;5s</div>
                  <p className="text-sm text-gray-600">Deploy Time</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold text-white mb-3 tracking-tight">Powerful Features</h2>
              <p className="text-gray-500 text-lg">
                Everything you need to deploy and scale
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Deploy your apps in seconds with our optimized build pipeline",
                },
                {
                  icon: Globe,
                  title: "Global CDN",
                  description: "Your apps are served from edge locations worldwide",
                },
                {
                  icon: Code2,
                  title: "Auto Deploy",
                  description: "Automatic builds and deployments on every git push",
                },
                {
                  icon: Gauge,
                  title: "Real-time Logs",
                  description: "Watch your deployment progress with live logs",
                },
                {
                  icon: Cpu,
                  title: "Unlimited Builds",
                  description: "Deploy as many projects as you want, no limits",
                },
                {
                  icon: CheckCircle2,
                  title: "Enterprise Ready",
                  description: "99.9% uptime SLA with enterprise-grade infrastructure",
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-xl p-6 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-4 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold text-white mb-3 tracking-tight">How It Works</h2>
              <p className="text-gray-500 text-lg">
                Three simple steps to deploy your project
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Connect Repository",
                    description: "Paste your GitHub repository URL",
                  },
                  {
                    step: "02",
                    title: "Automatic Build",
                    description: "We automatically detect and build your project",
                  },
                  {
                    step: "03",
                    title: "Live & Deployed",
                    description: "Your app is live on our global CDN instantly",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-medium text-sm">
                        {item.step}
                      </div>
                      {i < 2 && (
                        <div className="w-px h-16 bg-white/5 mt-2" />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-gray-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-2xl p-12 text-center">
              <h2 className="text-4xl font-semibold text-white mb-3 tracking-tight">
                Ready to Deploy?
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                Join thousands of developers deploying on Exonium
              </p>
              <Link href="/signup">
                <Button className="bg-purple-500 hover:bg-purple-600 text-white h-11 px-6 rounded-lg font-medium">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <Image src="/image.png" alt="Exonium" width={28} height={28} className="rounded-lg brightness-0 invert" />
                <span className="font-semibold text-white">Exonium</span>
              </div>
              <div className="flex items-center gap-6 text-gray-500 text-sm">
                <a href="#" className="hover:text-white transition">Privacy</a>
                <a href="#" className="hover:text-white transition">Terms</a>
                <a href="#" className="hover:text-white transition">Status</a>
                <a href="#" className="hover:text-white transition">Docs</a>
              </div>
              <p className="text-gray-600 text-sm">© 2026 Exonium</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
