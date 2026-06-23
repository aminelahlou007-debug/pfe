"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Services", href: "#services" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
];
export function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [siteMode, setSiteMode] = useState("guest");
    useEffect(() => {
        const storedMode = window.localStorage.getItem("wildflower-site-mode");
        if (storedMode === "admin") {
            setSiteMode("admin");
        }
    }, []);
    useEffect(() => {
        window.localStorage.setItem("wildflower-site-mode", siteMode);
    }, [siteMode]);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const isAdminMode = siteMode === "admin";
    const primaryHref = isAdminMode
        ? "/login?mode=admin&callbackUrl=/dashboard"
        : "/login?mode=customer&callbackUrl=/checkout";
    const primaryLabel = isAdminMode ? "Enter admin view" : "Enter client view";
    const secondaryHref = "/dashboard";
    const secondaryLabel = "Open dashboard";
    return (<header className={`fixed z-50 transition-all duration-500 ${isScrolled
            ? "top-4 left-4 right-4"
            : "top-0 left-0 right-0"}`}>
      <nav className={`mx-auto transition-all duration-500 ${isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"}`}>
        <div className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${isScrolled ? "h-14" : "h-20"}`}>
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <span className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-xl text-foreground" : "text-2xl text-white"}`}>Wildflower Co.</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (<a key={link.name} href={link.href} className={`text-sm transition-colors duration-300 relative group ${isScrolled ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white"}`}>
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-foreground" : "bg-white"}`}/>
              </a>))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4 rounded-full border border-foreground/10 bg-background/75 px-3 py-2 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] p-1 text-xs">
              <button type="button" onClick={() => setSiteMode("guest")} className={`rounded-full px-3.5 py-2 transition-colors ${siteMode === "guest" ? "bg-foreground text-background shadow-sm" : "text-foreground/70 hover:text-foreground"}`}>
                Guest view
              </button>
              <button type="button" onClick={() => setSiteMode("admin")} className={`rounded-full px-3.5 py-2 transition-colors ${siteMode === "admin" ? "bg-foreground text-background shadow-sm" : "text-foreground/70 hover:text-foreground"}`}>
                Admin view
              </button>
            </div>
            <Button size="sm" className={`rounded-full transition-all duration-500 ${isScrolled ? "bg-foreground hover:bg-foreground/90 text-background px-4 h-8 text-xs" : "bg-white hover:bg-white/90 text-black px-6"}`} asChild>
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Link href={secondaryHref} className={`transition-all duration-500 ${isScrolled ? "text-xs text-foreground/70 hover:text-foreground" : "text-sm text-white/70 hover:text-white"}`}>
              {secondaryLabel}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2 transition-colors duration-500 ${isScrolled || isMobileMenuOpen ? "text-foreground" : "text-white"}`} aria-label="Toggle menu">
            {isMobileMenuOpen ? (<X className="w-6 h-6"/>) : (<Menu className="w-6 h-6"/>)}
          </button>
        </div>

      </nav>
      
      {/* Mobile Menu - Full Screen Overlay */}
      <div className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"}`} style={{ top: 0 }}>
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="mb-10 flex flex-col gap-3 self-start rounded-2xl border border-foreground/10 bg-background/95 p-4 text-xs shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono uppercase tracking-[0.18em] text-muted-foreground">
                Preview mode
              </span>
              <span className={`rounded-full px-2.5 py-1 font-mono uppercase tracking-[0.18em] ${isAdminMode ? "bg-foreground text-background" : "bg-[#eca8d6]/10 text-[#eca8d6]"}`}>
                {isAdminMode ? "Admin active" : "Guest active"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] p-1">
              <button type="button" onClick={() => setSiteMode("guest")} className={`rounded-full px-3.5 py-2 transition-colors ${siteMode === "guest" ? "bg-foreground text-background shadow-sm" : "text-foreground/70"}`}>
                Guest view
              </button>
              <button type="button" onClick={() => setSiteMode("admin")} className={`rounded-full px-3.5 py-2 transition-colors ${siteMode === "admin" ? "bg-foreground text-background shadow-sm" : "text-foreground/70"}`}>
                Admin view
              </button>
            </div>
          </div>
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (<a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"}`} style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}>
                {link.name}
              </a>))}
          </div>
          
          {/* Bottom CTAs */}
          <div className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"}`} style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}>
            <Button className="flex-1 bg-foreground text-background rounded-full h-14 text-base" onClick={() => setIsMobileMenuOpen(false)} asChild>
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button variant="outline" className="flex-1 rounded-full h-14 text-base" onClick={() => setIsMobileMenuOpen(false)} asChild>
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>);
}
