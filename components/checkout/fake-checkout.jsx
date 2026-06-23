"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export function FakeCheckout({ plan }) {
    const [isComplete, setIsComplete] = useState(false);
    const planLabel = useMemo(() => {
        const normalized = plan.toLowerCase();
        if (normalized.includes("enterprise"))
            return "Enterprise";
        if (normalized.includes("professional") || normalized.includes("pro"))
            return "Professional";
        return "Starter";
    }, [plan]);
    return (<div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="rounded-3xl border border-foreground/10 bg-card p-6 lg:p-8">
        <p className="text-sm font-mono text-muted-foreground">Fake checkout</p>
        <h2 className="mt-3 text-3xl font-display">Complete your booking</h2>
        <p className="mt-2 text-muted-foreground">
          This is a simulated purchase flow for portfolio demos. No payment will be charged.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-foreground/10 p-4">
            <div className="text-sm text-muted-foreground">Plan</div>
            <div className="mt-1 text-xl font-display">{planLabel}</div>
          </div>
          <div className="rounded-2xl border border-foreground/10 p-4">
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="mt-1 text-xl font-display">Ready</div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <input className="h-12 rounded-xl border border-foreground/10 bg-background px-4 text-sm outline-none" placeholder="Card number" defaultValue="4242 4242 4242 4242"/>
          <input className="h-12 rounded-xl border border-foreground/10 bg-background px-4 text-sm outline-none" placeholder="Name on card" defaultValue="Demo User"/>
          <input className="h-12 rounded-xl border border-foreground/10 bg-background px-4 text-sm outline-none" placeholder="MM/YY" defaultValue="12/28"/>
          <input className="h-12 rounded-xl border border-foreground/10 bg-background px-4 text-sm outline-none" placeholder="CVC" defaultValue="123"/>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => setIsComplete(true)} className="rounded-full bg-foreground text-background hover:bg-foreground/90">
            Complete fake purchase
          </Button>
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/">Back to home</Link>
          </Button>
        </div>

        {isComplete && (<div className="mt-6 rounded-2xl border border-[#eca8d6]/30 bg-[#eca8d6]/10 p-4 text-sm">
            Purchase recorded. This demo order is now marked as paid and ready for your next portfolio screenshot.
          </div>)}
      </div>

      <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6 lg:p-8">
        <p className="text-sm font-mono text-muted-foreground">Order summary</p>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
            <span>Plan</span>
            <span className="font-medium">{planLabel}</span>
          </div>
          <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
            <span>Access</span>
            <span className="font-medium">Guest customer</span>
          </div>
          <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
            <span>Delivery</span>
            <span className="font-medium">Instant demo unlock</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total</span>
            <span className="text-2xl font-display">$0</span>
          </div>
        </div>
      </div>
    </div>);
}
