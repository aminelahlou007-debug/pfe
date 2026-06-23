import { LayoutDashboard, Calendar, Users, Building2, CheckSquare, Settings, } from "lucide-react";
export const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Events", href: "/dashboard/ceremonies", icon: Calendar },
    { name: "Guests", href: "/dashboard/guests", icon: Users },
    { name: "Vendors", href: "/dashboard/vendors", icon: Building2 },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];
