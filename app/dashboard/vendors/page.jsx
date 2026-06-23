"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Phone, Mail, MapPin, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { readJsonResponse } from "@/lib/safe-json";
const categories = ["All", "Florist", "Catering", "Entertainment", "Photography", "Bakery", "Venue", "Other"];
export default function VendorsPage() {
    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const loadVendors = async () => {
            const response = await fetch("/api/vendors");
            const data = await readJsonResponse(response);
            setVendors(data ?? []);
            setIsLoading(false);
        };
        loadVendors();
    }, []);
    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(search.toLowerCase()) ||
            vendor.contact.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "All" || vendor.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    const handleDelete = (id) => {
        const deleteVendor = async () => {
            await fetch(`/api/vendors/${id}`, { method: "DELETE" });
            setVendors(vendors.filter(v => v.id !== id));
        };
        deleteVendor();
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display">Vendors</h1>
          <p className="text-muted-foreground mt-1">Manage your vendor relationships</p>
        </div>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full" asChild>
          <Link href="/dashboard/vendors/new">
            <Plus className="w-4 h-4 mr-2"/>
            Add Vendor
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <input type="text" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-9 pr-4 bg-card border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (<button key={category} onClick={() => setCategoryFilter(category)} className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors ${categoryFilter === category
                ? "bg-foreground text-background"
                : "bg-card border border-foreground/10 text-muted-foreground hover:text-foreground"}`}>
              {category}
            </button>))}
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (<div className="col-span-full p-8 text-center text-muted-foreground">Loading vendors...</div>) : filteredVendors.map((vendor) => (<div key={vendor.id} className="group bg-card border border-foreground/10 hover:border-foreground/20 transition-all p-6">
            <div className="flex items-start justify-between mb-4">
              <span className={`text-xs px-3 py-1 rounded-full font-mono ${vendor.status === "Active"
                ? "bg-[#eca8d6]/10 text-[#eca8d6]"
                : vendor.status === "Pending"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-muted text-muted-foreground"}`}>
                {vendor.status}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4"/>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/vendors/${vendor.id}`}>
                      <Pencil className="w-4 h-4 mr-2"/>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(vendor.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2"/>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Link href={`/dashboard/vendors/${vendor.id}`}>
              <h3 className="text-lg font-display mb-1 group-hover:text-[#eca8d6] transition-colors">
                {vendor.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{vendor.category}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < vendor.rating ? "fill-[#eca8d6] text-[#eca8d6]" : "text-muted-foreground/30"}`}/>))}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4"/>
                  {vendor.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4"/>
                  {vendor.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4"/>
                  {vendor.location}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-foreground/5">
                <p className="text-xs text-muted-foreground">Contact: {vendor.contact}</p>
              </div>
            </Link>
          </div>))}
      </div>

      {filteredVendors.length === 0 && (<div className="text-center py-12">
          <p className="text-muted-foreground">No vendors found</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/dashboard/vendors/new">Add your first vendor</Link>
          </Button>
        </div>)}
    </div>);
}
