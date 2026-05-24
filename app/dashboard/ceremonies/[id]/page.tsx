"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/safe-json";

export default function EditCeremonyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const existingData = {
    name: "",
    type: "Wedding",
    date: "",
    time: "",
    venue: "",
    address: "",
    expectedGuests: "",
    budget: "",
    description: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(existingData);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadCeremony = async () => {
      const response = await fetch(`/api/ceremonies/${id}`);
      if (response.ok) {
        const data = await readJsonResponse<any>(response);
        if (!data) {
          setIsFetching(false);
          return;
        }
        setFormData(data);
      }
      setIsFetching(false);
    };

    loadCeremony();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch(`/api/ceremonies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    router.push("/dashboard/ceremonies");
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ceremony?")) return;

    await fetch(`/api/ceremonies/${id}`, { method: "DELETE" });
    router.push("/dashboard/ceremonies");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {isFetching ? <div className="text-muted-foreground">Loading event...</div> : null}
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link 
            href="/dashboard/ceremonies" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to ceremonies
          </Link>
          <h1 className="text-3xl lg:text-4xl font-display">Edit Ceremony</h1>
          <p className="text-muted-foreground mt-1">Update ceremony details</p>
        </div>
        <Button 
          variant="outline" 
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-foreground/10 p-6 space-y-6">
          <h2 className="text-lg font-display">Basic Information</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Ceremony Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Event Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              >
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
              <input
                type="number"
                name="expectedGuests"
                value={formData.expectedGuests}
                onChange={handleChange}
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-foreground/10 p-6 space-y-6">
          <h2 className="text-lg font-display">Date & Location</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Venue Name</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-foreground/10 p-6 space-y-6">
          <h2 className="text-lg font-display">Additional Details</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Budget</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/ceremonies">Cancel</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            {isLoading ? "Saving..." : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
