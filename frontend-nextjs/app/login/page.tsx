import { Login01 } from "@/components/ui/login-signup";
import { ParticleBackground } from "@/components/ui/particle-background";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 overflow-hidden relative flex flex-col">
      <ParticleBackground />
      <div className="relative z-10 flex-grow flex items-center justify-center">
        <Login01 />
      </div>
    </main>
  );
}
