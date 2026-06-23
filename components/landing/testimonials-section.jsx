"use client";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AsciiPattern } from "./ascii-pattern";
const testimonials = [
    {
        quote: "Wildflower Co. made planning our wedding seamless. Every vendor, every detail, perfectly coordinated.",
        author: "Sarah & Michael",
        role: "Newlyweds",
        company: "Spring Wedding 2024",
        metric: { value: "250", label: "Guests managed" },
    },
    {
        quote: "Our annual gala went flawlessly. The timeline feature kept 50+ vendors perfectly synchronized.",
        author: "Jennifer Walsh",
        role: "Events Director",
        company: "Tech Foundation",
        metric: { value: "50+", label: "Vendors coordinated" },
    },
    {
        quote: "From venue selection to final execution, this platform transformed how we plan corporate events.",
        author: "David Chen",
        role: "Head of Operations",
        company: "Apex Industries",
        metric: { value: "12", label: "Events per year" },
    },
    {
        quote: "The guest management alone saved us countless hours. RSVPs, dietary needs, seating - all automated.",
        author: "Amanda Rodriguez",
        role: "Wedding Planner",
        company: "Elegant Events Co.",
        metric: { value: "85%", label: "Time saved" },
    },
];
export function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting)
                setIsVisible(true);
        }, { threshold: 0.1 });
        if (sectionRef.current)
            observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);
    const goTo = (index) => {
        setActiveIndex(index);
    };
    const goPrev = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };
    const goNext = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };
    const activeTestimonial = testimonials[activeIndex];
    return (<section id="testimonials" ref={sectionRef} className="relative py-32 lg:py-40 bg-background text-foreground overflow-hidden">
      {/* ASCII background pattern */}
      <AsciiPattern />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-20">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-background/40 mb-4">
              <span className="w-12 h-px bg-background/20"/>
              Testimonials
            </span>
            <h2 className={`text-4xl lg:text-5xl font-display transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              Loved by planners
              <span className="text-background/40"> everywhere.</span>
            </h2>
          </div>
          
          {/* Navigation arrows */}
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={goPrev} className="p-4 border border-background/20 hover:bg-background/10 transition-colors">
              <ArrowLeft className="w-5 h-5"/>
            </button>
            <button onClick={goNext} className="p-4 border border-background/20 hover:bg-background/10 transition-colors">
              <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {/* Main content - Split layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Quote side */}
          <div className="lg:col-span-7 relative">
            {/* Large quote mark */}
            <span className="absolute -left-4 -top-8 text-[200px] font-display text-background/5 leading-none select-none">
              &ldquo;
            </span>
            
            <div className="relative">
              <blockquote key={activeIndex} className="text-3xl lg:text-4xl xl:text-5xl font-display leading-[1.2] tracking-tight animate-fadeSlideIn">
                {activeTestimonial.quote}
              </blockquote>

              {/* Author */}
              <div className="mt-12 flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-background/10 flex items-center justify-center">
                  <span className="font-display text-xl">
                    {activeTestimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-medium">{activeTestimonial.author}</p>
                  <p className="text-background/60">
                    {activeTestimonial.role}, {activeTestimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metric cards side */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-6">
            {/* Active metric - Large */}
            <div key={`metric-${activeIndex}`} className="p-10 border border-background/20 bg-background/5 animate-fadeSlideIn">
              <span className="text-7xl lg:text-8xl font-display block mb-4">
                {activeTestimonial.metric.value}
              </span>
              <span className="text-lg text-background/60">
                {activeTestimonial.metric.label}
              </span>
            </div>

            {/* Progress indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (<button key={idx} onClick={() => goTo(idx)} className="flex-1 h-1 bg-background/20 overflow-hidden">
                  <div className={`h-full bg-background transition-all duration-300 ${idx === activeIndex ? "w-full" : idx < activeIndex ? "w-full opacity-50" : "w-0"}`} style={idx === activeIndex ? { animation: "progress 8s linear forwards" } : {}}/>
                </button>))}
            </div>

            {/* Company list */}
            <div className="mt-4 pt-6 border-t border-background/10">
              <span className="text-xs font-mono text-background/30 uppercase tracking-widest block mb-4">
                Featured clients
              </span>
              <div className="flex flex-wrap gap-3">
                {testimonials.map((t, idx) => (<button key={t.company} onClick={() => goTo(idx)} className={`px-4 py-2 text-sm border transition-all ${idx === activeIndex
                ? "border-background/40 text-background"
                : "border-background/10 text-background/40 hover:border-background/30"}`}>
                    {t.company}
                  </button>))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.5s ease-out forwards;
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>);
}
