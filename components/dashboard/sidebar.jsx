"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, Building2, CheckSquare, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Events", href: "/dashboard/ceremonies", icon: Calendar },
    { name: "Guests", href: "/dashboard/guests", icon: Users },
    { name: "Vendors", href: "/dashboard/vendors", icon: Building2 },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
];
const bottomNavItems = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];
export function DashboardSidebar() {
    const pathname = usePathname();
    return (<aside className="hidden lg:flex flex-col w-64 border-r border-foreground/10 bg-card">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-foreground/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl">Wildflower Co.</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (<Link key={item.name} href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors", isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5")}>
                <item.icon className="w-4 h-4"/>
                {item.name}
              </Link>);
        })}
        </div>
      </nav>

      {/* Bottom nav */}
      <div className="py-6 px-3 border-t border-foreground/10">
        <div className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (<Link key={item.name} href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors", isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5")}>
                <item.icon className="w-4 h-4"/>
                {item.name}
              </Link>);
        })}
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors">
            <LogOut className="w-4 h-4"/>
            Back to Home
          </Link>
        </div>
      </div>
    </aside>);
}
