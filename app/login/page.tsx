import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Login | Wildflower Co.",
  description: "Choose a demo view and jump straight into the customer or admin experience.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <section className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Demo access
            </span>
            <div className="max-w-2xl space-y-4">
              <h1 className="text-5xl font-display leading-tight lg:text-7xl">Choose a view and enter instantly.</h1>
              <p className="text-lg text-muted-foreground lg:text-xl">No account, no request, no delay. Pick guest or admin and open the matching demo space immediately.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-foreground/10 bg-card p-5">
                <ShoppingBag className="h-5 w-5 text-[#eca8d6]" />
                <h2 className="mt-4 text-lg font-display">Guest / Buyer</h2>
                <p className="mt-2 text-sm text-muted-foreground">Preview pricing, then open the purchase screen instantly.</p>
              </div>
              <div className="rounded-3xl border border-foreground/10 bg-card p-5">
                <ShieldCheck className="h-5 w-5 text-[#eca8d6]" />
                <h2 className="mt-4 text-lg font-display">Admin / Editor</h2>
                <p className="mt-2 text-sm text-muted-foreground">Use the admin demo view to open the dashboard and edit the project.</p>
              </div>
            </div>
          </section>

          <Suspense fallback={<div className="rounded-3xl border border-foreground/10 bg-card p-6 text-sm text-muted-foreground lg:p-8">Loading login form...</div>}>
            <AuthForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}