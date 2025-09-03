import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import BrandDescription from "@/components/brand-description";
import BenefitsComparison from "@/components/benefits-comparison";
import InteractiveDemo from "@/components/interactive-demo";
import CallToAction from "@/components/call-to-action";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <BrandDescription />
      <BenefitsComparison />
      <InteractiveDemo />
      <CallToAction />
      <Footer />
    </div>
  );
}
