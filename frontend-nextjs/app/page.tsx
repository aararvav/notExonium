// ─── Server Component (SSR) ─────────────────────────────────────────────
// This page is server-rendered for better SEO, faster first paint, and
// to satisfy the SSR requirement. Only interactive islands (DeployForm,
// MainNav) are client components.

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { DeployForm } from "@/components/deploy-form";
import DemoOne from "@/components/ui/demo";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight } from "lucide-react";

import { ParticleBackground } from "@/components/ui/particle-background";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 overflow-hidden relative">
      <ParticleBackground />
      {/* Grid Pattern Overlay */}
      {/* <div className="absolute inset-0 z-0 pointer-events-none">
        <GridPattern
          width={40}
          height={40}
          strokeDasharray="4 2"
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_top,white,transparent)]",
            "absolute inset-0 h-full w-full opacity-40 stroke-white/10 fill-white/5"
          )}
        />
      </div> */}

      <div className="relative z-10">
        {/* Navigation — client component (uses auth context) */}
        <MainNav />

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-zinc-800 backdrop-blur shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
                <span className="text-sm text-zinc-300 font-medium">Trusted by developers worldwide</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-semibold mb-6 leading-[1.1] text-white tracking-tight">
                Deploy Your Code
                <br />
                <span className="text-zinc-500">In Seconds</span>
              </h1>

              <p className="text-lg text-zinc-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                The fastest way to deploy your GitHub repositories.
                <br />From push to production in seconds.
              </p>

              {/* CTA Form — client component (uses state + router) */}
              <DeployForm />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-8">
                <div className="text-center">
                  <div className="text-3xl font-semibold text-white mb-1">10M+</div>
                  <p className="text-sm text-zinc-500">Deployments</p>
                </div>
                <div className="text-center border-x border-zinc-800">
                  <div className="text-3xl font-semibold text-white mb-1">99.9%</div>
                  <p className="text-sm text-zinc-500">Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-semibold text-white mb-1">&lt;5s</div>
                  <p className="text-sm text-zinc-500">Deploy Time</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 border-t border-zinc-800/50">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-sm backdrop-blur-xl rounded-2xl p-12 text-center">
              <h2 className="text-4xl font-semibold text-white mb-3 tracking-tight">
                Ready to Deploy?
              </h2>
              <p className="text-zinc-400 text-lg mb-8">
                Join thousands of developers deploying on Exonium
              </p>
              <Link href="/signup">
                <Button className="bg-zinc-100 hover:bg-white text-zinc-900 h-11 px-6 rounded-lg font-medium">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
