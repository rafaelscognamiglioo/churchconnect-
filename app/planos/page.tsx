import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { PricingSection } from "@/components/marketing/pricing";
import { FAQSection } from "@/components/marketing/faq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planos — ChurchConnect",
  description: "Escolha o plano ideal para sua igreja. Comece grátis e escale conforme crescer.",
};

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-[#080812]">
      <Navbar />
      <div className="pt-16">
        <PricingSection />
        <FAQSection />
      </div>
      <Footer />
    </div>
  );
}
