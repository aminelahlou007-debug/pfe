"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
export function CtaSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting)
                setIsVisible(true);
        }, { threshold: 0.2 });
        if (sectionRef.current)
            observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };
    return (<section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className={`relative border border-foreground transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} onMouseMove={handleMouseMove}>
          {/* Spotlight effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300" style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.15), transparent 40%)`
        }}/>
          
          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left content */}
              <div className="flex-1">
                <h2 className="text-6xl md:text-7xl lg:text-[72px] font-display tracking-tight mb-8 leading-[0.95]">
                  Ready to plan
                  <br />
                  your event?
                </h2>

                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  Join thousands of planners creating unforgettable moments. 
                  Start planning your first event today.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group" asChild>
                    <Link href="/login?mode=customer&callbackUrl=/checkout">
                      Start planning free
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"/>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5" asChild>
                    <Link href="#pricing">See pricing</Link>
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-8 font-mono">
                  Free forever for small events
                </p>
              </div>

              {/* Right image */}
              <div className="hidden lg:flex items-end justify-center w-[600px] h-[650px] -mr-16">
                <video aria-hidden="true" muted autoPlay loop playsInline preload="metadata" poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tree-uAia6REvB137CQyHFCf0za3O6h2zKO.png" className="w-full h-full object-contain object-bottom">
                  <source src="/videos/cta-tree.mp4" type="video/mp4"/>
                </video>
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10"/>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10"/>
        </div>
      </div>
    </section>);
}
