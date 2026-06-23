"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/safe-json";
export default function VendorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const [vendor, setVendor] = useState(null);
    const [expandedReview, setExpandedReview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (!id)
            return;
        const loadVendor = async () => {
            const response = await fetch(`/api/vendors/${id}`);
            if (response.ok) {
                const data = await readJsonResponse(response);
                if (!data) {
                    setIsLoading(false);
                    return;
                }
                setVendor(data);
            }
            setIsLoading(false);
        };
        loadVendor();
    }, [id]);
    if (isLoading) {
        return <div className="max-w-3xl mx-auto py-12 text-muted-foreground">Loading vendor...</div>;
    }
    if (!vendor) {
        return (<div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-muted-foreground">Vendor not found.</p>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/dashboard/vendors">Back to vendors</Link>
          </Button>
        </div>
      </div>);
    }
    return (<div className="max-w-3xl mx-auto space-y-8">
      <div>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4"/>
          Back to vendors
        </button>
        <h1 className="text-3xl lg:text-4xl font-display">{vendor.name}</h1>
        <p className="text-muted-foreground mt-1">{vendor.category} — {vendor.location}</p>
      </div>

      <div className="bg-card border border-foreground/10 p-6">
        <div className="flex items-start gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < vendor.rating ? "fill-[#eca8d6] text-[#eca8d6]" : "text-muted-foreground/30"}`}/>))}
              <span className="text-sm text-muted-foreground">{vendor.rating}.0</span>
            </div>
            <p className="text-sm text-muted-foreground">Contact: {vendor.contact}</p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4"/>{vendor.email}</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4"/>{vendor.phone}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/>{vendor.location}</div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-display mb-2">About</h2>
            <p className="text-sm text-muted-foreground">{vendor.description}</p>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display">Reviews</h3>
                <span className="text-sm text-muted-foreground">{vendor.reviews.length} reviews</span>
              </div>

              <div className="mt-4 space-y-4">
                {vendor.reviews.map((review) => (<article key={review.id} className="bg-background border border-foreground/5 p-4 rounded-md">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{review.author}</div>
                          <div className="text-xs text-muted-foreground">• {review.date}</div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {expandedReview === review.id ? (<p>{review.text}</p>) : (<p>{review.text.length > 140 ? review.text.slice(0, 140) + "..." : review.text}</p>)}
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="text-sm text-muted-foreground">{review.rating} / 5</div>
                        <button onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)} className="text-xs text-foreground mt-2">
                          {expandedReview === review.id ? "Show less" : "Read more"}
                        </button>
                      </div>
                    </div>
                  </article>))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/dashboard/vendors">Back</Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/vendors/${vendor.id}`}>Edit Vendor</Link>
        </Button>
      </div>
    </div>);
}
