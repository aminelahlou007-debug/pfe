"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Calendar, Users, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { readJsonResponse } from "@/lib/safe-json";
export default function CeremoniesPage() {
    const [ceremonies, setCeremonies] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const loadCeremonies = async () => {
            const response = await fetch("/api/ceremonies");
            const data = await readJsonResponse(response);
            setCeremonies(data ?? []);
            setIsLoading(false);
        };
        loadCeremonies();
    }, []);
    const filteredCeremonies = ceremonies.filter(ceremony => {
        const matchesSearch = ceremony.name.toLowerCase().includes(search.toLowerCase()) ||
            ceremony.venue.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" || ceremony.status.toLowerCase() === filter;
        return matchesSearch && matchesFilter;
    });
    const PAGE_SIZE = 5;
    const pageCount = Math.max(1, Math.ceil(filteredCeremonies.length / PAGE_SIZE));
    const paginatedCeremonies = filteredCeremonies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const handleDelete = (id) => {
        const deleteCeremony = async () => {
            await fetch(`/api/ceremonies/${id}`, { method: "DELETE" });
            setCeremonies(ceremonies.filter(c => c.id !== id));
        };
        deleteCeremony();
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display">Events</h1>
          <p className="text-muted-foreground mt-1">Manage all your events and celebrations</p>
        </div>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full" asChild>
          <Link href="/dashboard/ceremonies/new">
            <Plus className="w-4 h-4 mr-2"/>
            New Event
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
            <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-9 pr-4 bg-card border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
        </div>
        <div className="flex gap-2">
          {["all", "planning", "confirmed", "completed"].map((status) => (<button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 text-sm rounded-full transition-colors ${filter === status
                ? "bg-foreground text-background"
                : "bg-card border border-foreground/10 text-muted-foreground hover:text-foreground"}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>))}
        </div>
      </div>

      {/* Ceremonies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (<div className="col-span-full p-8 text-center text-muted-foreground">Loading events...</div>) : (paginatedCeremonies.map((ceremony) => (<div key={ceremony.id} className="group bg-card border border-foreground/10 hover:border-foreground/20 transition-all p-6">
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs px-3 py-1 rounded-full font-mono ${ceremony.status === "Confirmed"
                ? "bg-[#eca8d6]/10 text-[#eca8d6]"
                : ceremony.status === "Completed"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-yellow-500/10 text-yellow-500"}`}>
                  {ceremony.status}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4"/>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/ceremonies/${ceremony.id}`}>
                        <Pencil className="w-4 h-4 mr-2"/>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(ceremony.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2"/>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Link href={`/dashboard/ceremonies/${ceremony.id}`}>
                <h3 className="text-lg font-display mb-1 group-hover:text-[#eca8d6] transition-colors">
                  {ceremony.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{ceremony.type}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4"/>
                    {ceremony.date}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4"/>
                    {ceremony.guests} guests
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-foreground/5">
                  <p className="text-xs text-muted-foreground">{ceremony.venue}</p>
                </div>
              </Link>
            </div>)))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">Showing {Math.min(filteredCeremonies.length, (page-1)*PAGE_SIZE+1)}-{Math.min(filteredCeremonies.length, page*PAGE_SIZE)} of {filteredCeremonies.length}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p-1))} className="px-3 py-1 bg-card border rounded" disabled={page === 1}>Prev</button>
          <div className="text-sm">Page {page} of {pageCount}</div>
          <button onClick={() => setPage((p) => Math.min(pageCount, p+1))} className="px-3 py-1 bg-card border rounded" disabled={page === pageCount}>Next</button>
        </div>
      </div>

      {filteredCeremonies.length === 0 && (<div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4"/>
          <p className="text-muted-foreground">No events found</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/dashboard/ceremonies/new">Create your first event</Link>
          </Button>
        </div>)}
    </div>);
}
