import { Navbar } from "@/components/marketing/navbar";
import { HeroSection } from "@/components/marketing/hero";
import { FeaturesSection } from "@/components/marketing/features";
import { TestimonialsSection } from "@/components/marketing/testimonials";
import { PricingSection } from "@/components/marketing/pricing";
import { FAQSection } from "@/components/marketing/faq";
import { CTAFinal } from "@/components/marketing/cta-final";
import { Footer } from "@/components/marketing/footer";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { EventCategoriesSection } from "@/components/marketing/event-categories";

export default function Home() {
  return (
    <main className="bg-[#080812]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <EventCategoriesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTAFinal />
      <Footer />
    </main>
  );
}
