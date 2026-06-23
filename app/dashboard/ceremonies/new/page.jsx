"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function NewCeremonyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "Wedding",
        date: "",
        time: "",
        venue: "",
        address: "",
        expectedGuests: "",
        budget: "",
        description: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await fetch("/api/ceremonies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            setIsLoading(false);
            return;
        }
        router.push("/dashboard/ceremonies");
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (<div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
          <Link href="/dashboard/ceremonies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4"/>
          Back to events
        </Link>
        <h1 className="text-3xl lg:text-4xl font-display">New Event</h1>
        <p className="text-muted-foreground mt-1">Create a new event to start planning</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-foreground/10 p-6 space-y-6">
          <h2 className="text-lg font-display">Basic Information</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Event Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Johnson Wedding" className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Event Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20">
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Birthday">Birthday</option>
                <option value="Vow Renewal">Vow Renewal</option>
                <option value="Gala">Gala</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Expected Guests</label>
              <input type="number" name="expectedGuests" value={formData.expectedGuests} onChange={handleChange} placeholder="150" className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
          </div>
        </div>

        <div className="bg-card border border-foreground/10 p-6 space-y-6">
          <h2 className="text-lg font-display">Date & Location</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Venue Name</label>
              <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="e.g., Grand Ballroom" className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Event Street, City, State" className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
          </div>
        </div>

        <div className="bg-card border border-foreground/10 p-6 space-y-6">
          <h2 className="text-lg font-display">Additional Details</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Budget (Optional)</label>
            <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="$25,000" className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Any additional notes or details about the event..." className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"/>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/ceremonies">Cancel</Link>
          </Button>
            <Button type="submit" disabled={isLoading} className="bg-foreground text-background hover:bg-foreground/90">
            {isLoading ? ("Creating...") : (<>
                <Save className="w-4 h-4 mr-2"/>
                Create Event
              </>)}
          </Button>
        </div>
      </form>
    </div>);
}
