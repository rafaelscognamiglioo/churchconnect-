import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { FeaturesSection } from "@/components/marketing/features";
import { CTAFinal } from "@/components/marketing/cta-final";

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-[#080812]">
      <Navbar />
      <div className="pt-16">
        <HowItWorksSection />
        <FeaturesSection />
        <CTAFinal />
      </div>
      <Footer />
    </div>
  );
}
