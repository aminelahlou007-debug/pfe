import dynamic from "next/dynamic";
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";

const FeaturesSection = dynamic(() => import("@/components/landing/features-section").then((module) => module.FeaturesSection));
const HowItWorksSection = dynamic(() => import("@/components/landing/how-it-works-section").then((module) => module.HowItWorksSection));
const ServicesSection = dynamic(() => import("@/components/landing/services-section").then((module) => module.ServicesSection));
const MetricsSection = dynamic(() => import("@/components/landing/metrics-section").then((module) => module.MetricsSection));
const TestimonialsSection = dynamic(() => import("@/components/landing/testimonials-section").then((module) => module.TestimonialsSection));
const ReviewsSection = dynamic(() => import("@/components/landing/reviews-section").then((module) => module.ReviewsSection));
const PricingSection = dynamic(() => import("@/components/landing/pricing-section").then((module) => module.PricingSection));
const CtaSection = dynamic(() => import("@/components/landing/cta-section").then((module) => module.CtaSection));
const FooterSection = dynamic(() => import("@/components/landing/footer-section").then((module) => module.FooterSection));

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
