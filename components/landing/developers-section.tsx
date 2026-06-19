"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const features = [
  { 
    title: "TypeScript native", 
    description: "Full type safety for agent configs and responses."
  },
  { 
    title: "Streaming results", 
    description: "Watch your agents think and act in real-time."
  },
  { 
    title: "Multi-model support", 
    description: "OpenAI, Anthropic, Mistral, or bring your own."
  },
  { 
    title: "Local debugging", 
    description: "Test agents locally before deploying to cloud."
  },
];

export function DevelopersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="developers" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">

      {/* Image — absolute, bottom-right, behind all content */}
      <div
        className={`absolute bottom-0 right-0 w-[55%] h-[85%] pointer-events-none transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2813%29-OQ2DiR3ElVsUg8kTvTL1kC5A3Q6maM.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-left-top"
        />
        {/* Fade left edge */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        {/* Fade top edge */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
      </div>

      {/* All text content sits on top */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header — Full width */}
        <div
          className={`mb-16 max-w-3xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Developer SDK
          </span>
          <h2 className="text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9]">
            Code your agents.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Build polished agent workflows with TypeScript, live feedback, and predictable local debugging before you ship.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`rounded-3xl border border-foreground/10 bg-card/80 p-5 backdrop-blur-sm transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 70 + 200}ms` }}
              >
                <h3 className="font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div
            className={`relative min-h-[420px] overflow-hidden rounded-[2rem] border border-foreground/10 bg-foreground/[0.03] transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <video
              aria-hidden="true"
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2813%29-OQ2DiR3ElVsUg8kTvTL1kC5A3Q6maM.png"
              className="absolute inset-0 h-full w-full object-cover object-left-top"
            >
              <source src="/videos/developers-hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
