import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { ParticleBackground } from "@/components/ui/particle-background";
import { TiltCard } from "@/components/ui/tilt-card";

const steps = [
  {
    step: "01",
    title: "Connect Repository",
    description: "Paste your GitHub repository URL securely into Exonium.",
  },
  {
    step: "02",
    title: "Automatic Build",
    description: "Our high-performance build servers detect your framework and compile your code.",
  },
  {
    step: "03",
    title: "Live & Deployed",
    description: "Your app is deployed globally to our edge network in under 5 seconds.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-zinc-950 overflow-hidden relative">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <MainNav />
        
        <div className="flex-grow pt-32 pb-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-semibold text-white mb-6 tracking-tight">How It Works</h1>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Three simple steps to deploy your project and scale it effortlessly.
              </p>
            </div>

            <TiltCard
              effect="evade"
              scale={1.02}
              tiltLimit={5}
              className="w-full max-w-3xl mx-auto rounded-[2rem] border border-zinc-800/50 bg-zinc-900/60 p-12 shadow-2xl backdrop-blur-xl"
            >
              <div className="relative z-20 space-y-12">
                {steps.map((item, i) => (
                  <div key={i} className="flex gap-8 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-300 font-bold text-lg">
                        {item.step}
                      </div>
                      {i < 2 && (
                        <div className="w-px h-20 bg-gradient-to-b from-zinc-700/50 to-transparent mt-4" />
                      )}
                    </div>
                    <div className="pt-2 flex-1">
                      <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-lg leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>
        </div>
        
        <SiteFooter />
      </div>
    </main>
  );
}
