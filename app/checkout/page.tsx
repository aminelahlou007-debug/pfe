import type { Metadata } from "next";
import { FakeCheckout } from "@/components/checkout/fake-checkout";

export const metadata: Metadata = {
  title: "Checkout | Wildflower Co.",
  description: "Simulated purchase flow for guest users and portfolio demos.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: { plan?: string };
}) {
  return (
    <main className="min-h-screen bg-background px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">Customer checkout</p>
          <h1 className="mt-3 text-4xl font-display lg:text-6xl">Complete your demo purchase</h1>
        </div>

        <FakeCheckout plan={searchParams?.plan || "professional"} />
      </div>
    </main>
  );
}