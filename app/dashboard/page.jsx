import Link from "next/link";
import { Calendar, Users, Building2, CheckSquare, Plus, ArrowUpRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDashboardSummary } from "@/lib/dashboard-summary";
const recentActivity = [
    { action: "Guest RSVP confirmed", item: "Sarah Miller - Johnson Wedding", time: "2 min ago" },
    { action: "Vendor contract signed", item: "Bloom Flowers Co.", time: "1 hour ago" },
    { action: "Task completed", item: "Finalize menu selections", time: "3 hours ago" },
    { action: "New event created", item: "Garcia Celebration", time: "Yesterday" },
];
export default async function DashboardPage() {
    const summary = await getDashboardSummary();
    const stats = [
        { label: "Active Events", value: String(summary.stats.activeEvents), change: "Live from MongoDB", icon: Calendar, href: "/dashboard/ceremonies" },
        { label: "Total Guests", value: String(summary.stats.totalGuests), change: "Live from MongoDB", icon: Users, href: "/dashboard/guests" },
        { label: "Vendors", value: String(summary.stats.vendors), change: "Live from MongoDB", icon: Building2, href: "/dashboard/vendors" },
        { label: "Open Tasks", value: String(summary.stats.openTasks), change: "Live from MongoDB", icon: CheckSquare, href: "/dashboard/tasks" },
    ];
    return (<div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your overview.</p>
        </div>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full" asChild>
          <Link href="/dashboard/ceremonies/new">
            <Plus className="w-4 h-4 mr-2"/>
            New Event
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (<Link key={stat.label} href={stat.href} className="group p-6 bg-card border border-foreground/10 hover:border-foreground/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <stat.icon className="w-5 h-5 text-muted-foreground"/>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"/>
            </div>
            <div className="text-3xl font-display mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-xs text-[#eca8d6] mt-2 font-mono">{stat.change}</div>
          </Link>))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 bg-card border border-foreground/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display">Upcoming Events</h2>
            <Link href="/dashboard/ceremonies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {summary.upcomingCeremonies.map((ceremony) => (<div key={ceremony.name} className="flex items-center justify-between p-4 bg-background border border-foreground/5 hover:border-foreground/10 transition-colors">
                <div className="flex-1">
                  <div className="font-medium">{ceremony.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {ceremony.date} &middot; {ceremony.guests} guests
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-mono ${ceremony.status === "On Track"
                ? "bg-[#eca8d6]/10 text-[#eca8d6]"
                : "bg-yellow-500/10 text-yellow-500"}`}>
                  {ceremony.status}
                </span>
              </div>))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-foreground/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display">Recent Activity</h2>
            <TrendingUp className="w-4 h-4 text-muted-foreground"/>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (<div key={index} className="pb-4 border-b border-foreground/5 last:border-0 last:pb-0">
                <div className="text-sm font-medium">{activity.action}</div>
                <div className="text-sm text-muted-foreground mt-1">{activity.item}</div>
                <div className="text-xs text-muted-foreground/60 mt-2 font-mono">{activity.time}</div>
              </div>))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { label: "Add Guest", href: "/dashboard/guests/new", icon: Users },
            { label: "Add Vendor", href: "/dashboard/vendors/new", icon: Building2 },
            { label: "Create Task", href: "/dashboard/tasks/new", icon: CheckSquare },
            { label: "View Calendar", href: "/dashboard/ceremonies", icon: Calendar },
        ].map((action) => (<Link key={action.label} href={action.href} className="flex items-center gap-3 p-4 bg-card border border-foreground/10 hover:border-foreground/20 transition-all group">
            <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"/>
            <span className="text-sm">{action.label}</span>
          </Link>))}
      </div>
    </div>);
}
