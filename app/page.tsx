import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { ServicesSection } from "@/components/landing/services-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ReviewsSection } from "@/components/landing/reviews-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ServicesSection />
      <MetricsSection />
      <TestimonialsSection />
      <ReviewsSection />
      <PricingSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
