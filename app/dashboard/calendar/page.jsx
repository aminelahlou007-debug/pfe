"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const events = [
    { id: 1, title: "Johnson Wedding", date: "2024-03-15", time: "14:00", location: "Grand Ballroom", type: "wedding", color: "bg-emerald-500" },
    { id: 2, title: "Vendor Meeting - Catering", date: "2024-03-10", time: "10:00", location: "Office", type: "meeting", color: "bg-blue-500" },
    { id: 3, title: "Smith Anniversary", date: "2024-03-20", time: "18:00", location: "Sunset Gardens", type: "anniversary", color: "bg-purple-500" },
    { id: 4, title: "Cake Tasting", date: "2024-03-12", time: "15:00", location: "Sweet Delights Bakery", type: "meeting", color: "bg-amber-500" },
    { id: 5, title: "Tech Corp Gala", date: "2024-03-25", time: "19:00", location: "Convention Center", type: "corporate", color: "bg-pink-500" },
    { id: 6, title: "Venue Walk-through", date: "2024-03-08", time: "11:00", location: "Grand Ballroom", type: "meeting", color: "bg-blue-500" },
];
export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 2, 1)); // March 2024
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }
    const getEventsForDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(event => event.date === dateStr);
    };
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Calendar</h1>
          <p className="text-muted-foreground">View and manage your event schedule</p>
        </div>
        <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
          <Plus className="mr-2 h-4 w-4"/>
          Add Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {months[month]} {year}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth} className="border-white/10">
                <ChevronLeft className="h-4 w-4"/>
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="border-white/10">
                <ChevronRight className="h-4 w-4"/>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (<div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>))}
            {days.map((day, index) => {
            const dayEvents = day ? getEventsForDay(day) : [];
            const isToday = day === 15; // Simulating today as March 15
            return (<div key={index} className={`min-h-[80px] rounded-lg border p-1 transition-colors ${day
                    ? "border-white/10 hover:border-white/20 cursor-pointer"
                    : "border-transparent"} ${isToday ? "bg-emerald-500/10 border-emerald-500/50" : ""}`}>
                  {day && (<>
                      <span className={`text-sm ${isToday ? "font-bold text-emerald-400" : "text-muted-foreground"}`}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 5).map((event) => (<div key={event.id} className={`truncate rounded px-1 py-0.5 text-xs text-white ${event.color}`}>
                            {event.title}
                          </div>))}
                        {dayEvents.length > 5 && (<div className="text-xs text-muted-foreground">+{dayEvents.length - 5} more</div>)}
                      </div>
                    </>)}
                </div>);
        })}
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (<div key={event.id} className="rounded-lg border border-white/10 p-3 transition-colors hover:bg-white/5">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full ${event.color}`}/>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-foreground">{event.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3"/>
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3"/>
                        <span>{event.location}</span>
                      </div>
                      <Badge variant="outline" className="mt-2 border-white/10 text-xs capitalize">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">This Month</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Events</span>
                <span className="font-semibold text-foreground">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Meetings</span>
                <span className="font-semibold text-foreground">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tasks Due</span>
                <span className="font-semibold text-foreground">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
