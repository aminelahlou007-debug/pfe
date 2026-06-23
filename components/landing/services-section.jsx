"use client";
import { useEffect, useRef, useState } from "react";
import { Heart, Users, Calendar, Utensils, Music, Camera } from "lucide-react";
const services = [
    {
        icon: Heart,
        title: "Weddings",
        description: "From intimate events to grand celebrations, we handle every detail of your special day.",
    },
    {
        icon: Users,
        title: "Corporate Events",
        description: "Professional gatherings, conferences, and team celebrations planned with precision.",
    },
    {
        icon: Calendar,
        title: "Anniversaries",
        description: "Celebrate milestones with beautifully orchestrated anniversary events.",
    },
    {
        icon: Utensils,
        title: "Catering Coordination",
        description: "Connect with top caterers and manage menus, dietary requirements, and service timing.",
    },
    {
        icon: Music,
        title: "Entertainment",
        description: "Book and coordinate performers, DJs, bands, and entertainment for any occasion.",
    },
    {
        icon: Camera,
        title: "Photography & Video",
        description: "Manage your visual team, shot lists, and timeline for capturing perfect moments.",
    },
];
export function ServicesSection() {
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
    return (<section id="services" ref={sectionRef} className="relative py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-12 h-px bg-foreground/30"/>
            Services
          </span>
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <h2 className={`text-6xl md:text-7xl lg:text-[96px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              Every event,
              <br />
              <span className="text-stroke">covered.</span>
            </h2>
            <p className={`text-xl text-muted-foreground leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              Whether you&apos;re planning a wedding, corporate event, or private celebration, our platform adapts to your needs.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {services.map((service, index) => (<div key={service.title} className={`group relative p-8 lg:p-10 border border-foreground/10 bg-card hover:border-foreground/20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: `${index * 100}ms` }}>
              <service.icon className="w-8 h-8 text-[#eca8d6] mb-6"/>
              <h3 className="text-2xl font-display mb-4 group-hover:translate-x-2 transition-transform duration-500">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>))}
        </div>
      </div>

      <style jsx>{`
        .text-stroke {
          -webkit-text-stroke: 1.5px currentColor;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>);
}
