import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { Pricing2 } from "@/components/ui/pricing-cards";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-zinc-800">
      <MainNav />
      <Pricing2 
        heading="Simple, Transparent Pricing"
        description="Choose the plan that fits your deployment needs. No hidden fees."
      />
      <SiteFooter />
    </main>
  );
}
