"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function NewVendorPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "Florist",
        contact: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        notes: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await fetch("/api/vendors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            setIsLoading(false);
            return;
        }
        router.push("/dashboard/vendors");
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (<div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link href="/dashboard/vendors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4"/>
          Back to vendors
        </Link>
        <h1 className="text-3xl lg:text-4xl font-display">Add Vendor</h1>
        <p className="text-muted-foreground mt-1">Add a new vendor to your network</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-foreground/10 p-6 space-y-6">
          <h2 className="text-lg font-display">Business Information</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Bloom Flowers Co." className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20">
                <option value="Florist">Florist</option>
                <option value="Catering">Catering</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Photography">Photography</option>
                <option value="Bakery">Bakery</option>
                <option value="Venue">Venue</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Downtown" className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
          </div>
        </div>

        <div className="bg-card border border-foreground/10 p-6 space-y-6">
          <h2 className="text-lg font-display">Contact Information</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Contact Person</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} required placeholder="Maria Garcia" className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="maria@bloom.com" className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 111-2222" className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Website</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://bloomflowers.com" className="w-full h-10 px-4 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Any additional notes about this vendor..." className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"/>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/vendors">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-foreground text-background hover:bg-foreground/90">
            {isLoading ? "Adding..." : (<>
                <Save className="w-4 h-4 mr-2"/>
                Add Vendor
              </>)}
          </Button>
        </div>
      </form>
    </div>);
}
