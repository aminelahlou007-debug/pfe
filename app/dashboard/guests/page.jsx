"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Mail, Phone, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/safe-json";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
export default function GuestsPage() {
    const [guests, setGuests] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const loadGuests = async () => {
            const response = await fetch("/api/guests");
            const data = await readJsonResponse(response);
            setGuests(data ?? []);
            setIsLoading(false);
        };
        loadGuests();
    }, []);
    const filteredGuests = guests.filter(guest => {
        const matchesSearch = guest.name.toLowerCase().includes(search.toLowerCase()) ||
            guest.email.toLowerCase().includes(search.toLowerCase()) ||
            guest.ceremony.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" || guest.rsvp.toLowerCase() === filter;
        return matchesSearch && matchesFilter;
    });
    const handleDelete = (id) => {
        const deleteGuest = async () => {
            await fetch(`/api/guests/${id}`, { method: "DELETE" });
            setGuests(guests.filter(g => g.id !== id));
        };
        deleteGuest();
    };
    const stats = {
        total: guests.length,
        confirmed: guests.filter(g => g.rsvp === "Confirmed").length,
        pending: guests.filter(g => g.rsvp === "Pending").length,
        declined: guests.filter(g => g.rsvp === "Declined").length,
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display">Guests</h1>
          <p className="text-muted-foreground mt-1">Manage your guest lists and RSVPs</p>
        </div>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full" asChild>
          <Link href="/dashboard/guests/new">
            <Plus className="w-4 h-4 mr-2"/>
            Add Guest
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-foreground/10 p-4">
          <div className="text-2xl font-display">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Guests</div>
        </div>
        <div className="bg-card border border-foreground/10 p-4">
          <div className="text-2xl font-display text-[#eca8d6]">{stats.confirmed}</div>
          <div className="text-sm text-muted-foreground">Confirmed</div>
        </div>
        <div className="bg-card border border-foreground/10 p-4">
          <div className="text-2xl font-display text-yellow-500">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border border-foreground/10 p-4">
          <div className="text-2xl font-display text-destructive">{stats.declined}</div>
          <div className="text-sm text-muted-foreground">Declined</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <input type="text" placeholder="Search guests..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-9 pr-4 bg-card border border-foreground/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"/>
        </div>
        <div className="flex gap-2">
          {["all", "confirmed", "pending", "declined"].map((status) => (<button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 text-sm rounded-full transition-colors ${filter === status
                ? "bg-foreground text-background"
                : "bg-card border border-foreground/10 text-muted-foreground hover:text-foreground"}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>))}
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-card border border-foreground/10 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (<div className="p-8 text-center text-muted-foreground">Loading guests...</div>) : (<table className="w-full">
            <thead>
              <tr className="border-b border-foreground/10">
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Guest</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4 hidden md:table-cell">Contact</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4 hidden lg:table-cell">Event</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">RSVP</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4 hidden lg:table-cell">Dietary</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4 hidden md:table-cell">+1</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (<tr key={guest.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{guest.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{guest.email}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3"/>
                      {guest.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Phone className="w-3 h-3"/>
                      {guest.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm">{guest.ceremony}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-mono ${guest.rsvp === "Confirmed"
                    ? "bg-[#eca8d6]/10 text-[#eca8d6]"
                    : guest.rsvp === "Declined"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-yellow-500/10 text-yellow-500"}`}>
                      {guest.rsvp === "Confirmed" && <Check className="w-3 h-3"/>}
                      {guest.rsvp === "Declined" && <X className="w-3 h-3"/>}
                      {guest.rsvp}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{guest.dietary || "None"}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {guest.plusOne ? (<Check className="w-4 h-4 text-[#eca8d6]"/>) : (<X className="w-4 h-4 text-muted-foreground/50"/>)}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1">
                          <MoreHorizontal className="w-4 h-4"/>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/guests/${guest.id}`}>
                            <Pencil className="w-4 h-4 mr-2"/>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(guest.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2"/>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>))}
            </tbody>
          </table>)}
        </div>
      </div>

      {filteredGuests.length === 0 && (<div className="text-center py-12">
          <p className="text-muted-foreground">No guests found</p>
        </div>)}
    </div>);
}
