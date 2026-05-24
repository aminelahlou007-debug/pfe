"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/safe-json";

export default function EditGuestPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ceremony: "",
    rsvp: "Pending",
    dietary: "",
    plusOne: false,
    notes: "",
  });

  useEffect(() => {
    if (!id) return;

    const loadGuest = async () => {
      const response = await fetch(`/api/guests/${id}`);
      if (response.ok) {
        const g = await readJsonResponse<any>(response);
        if (!g) {
          setIsFetching(false);
          return;
        }
        setFormData(g);
      }
      setIsFetching(false);
    };

    loadGuest();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch(`/api/guests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setIsLoading(false);
    router.push("/dashboard/guests");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = (e.target as HTMLInputElement).type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {isFetching ? (
        <div className="text-muted-foreground">Loading guest...</div>
      ) : null}
      <div>
        <Link
          href="/dashboard/guests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to guests
        </Link>
        <h1 className="text-3xl lg:text-4xl font-display">Edit Guest</h1>
        <p className="text-muted-foreground mt-1">Edit guest details for your event</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-foreground/10 p-6 space-y-6">
          <h2 className="text-lg font-display">Guest Information</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Smith"
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@email.com"
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-foreground/10 p-6 space-y-6">
          <h2 className="text-lg font-display">Event Details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event</label>
              <select
                name="ceremony"
                value={formData.ceremony}
                onChange={handleChange}
                required
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              >
                <option value="">Select event</option>
                <option value="Johnson Wedding">Johnson Wedding</option>
                <option value="Tech Corp Gala">Tech Corp Gala</option>
                <option value="Smith Anniversary">Smith Anniversary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">RSVP Status</label>
              <select
                name="rsvp"
                value={formData.rsvp}
                onChange={handleChange}
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Declined">Declined</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dietary Requirements</label>
              <input
                type="text"
                name="dietary"
                value={formData.dietary}
                onChange={handleChange}
                placeholder="Vegetarian, Gluten-free, etc."
                className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>

            <div className="flex items-center gap-3 h-10 mt-7">
              <input
                type="checkbox"
                name="plusOne"
                id="plusOne"
                checked={formData.plusOne}
                onChange={handleChange}
                className="w-4 h-4 rounded border-foreground/20"
              />
              <label htmlFor="plusOne" className="text-sm">Plus one allowed</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional notes..."
              className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/guests">Cancel</Link>
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
