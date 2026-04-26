import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { ParticleBackground } from "@/components/ui/particle-background";
import { Zap, Globe, Code2, Cpu, Gauge, CheckCircle2 } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";

const features = [
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
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 overflow-hidden relative">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <MainNav />
        
        <div className="flex-grow pt-32 pb-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-semibold text-white mb-6 tracking-tight">Powerful Features</h1>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Everything you need to deploy, scale, and manage your applications with confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <TiltCard
                    key={i}
                    effect="evade"
                    scale={1.05}
                    tiltLimit={15}
                    className="w-full rounded-[2rem] border border-zinc-800/50 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="relative z-20">
                      <div className="w-12 h-12 rounded-lg bg-zinc-800/80 flex items-center justify-center mb-6">
                        <Icon className="w-6 h-6 text-zinc-300" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </div>
        
        <SiteFooter />
      </div>
    </main>
  );
}
