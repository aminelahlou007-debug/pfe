"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Role = "customer" | "admin";

const demoCredentials: Record<Role, { email: string; password: string; note: string }> = {
  customer: {
    email: "customer@wildflower.co",
    password: "guest123",
    note: "Use this to preview the customer purchase flow.",
  },
  admin: {
    email: "admin@wildflower.co",
    password: "admin123",
    note: "Use this to open the editing dashboard.",
  },
};

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role>(searchParams.get("mode") === "admin" ? "admin" : "customer");
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = useMemo(() => {
    const fallback = role === "admin" ? "/dashboard" : "/checkout";
    return searchParams.get("callbackUrl") || fallback;
  }, [role, searchParams]);

  const roleCopy = demoCredentials[role];

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    window.localStorage.setItem("wildflower-site-mode", role);
    document.cookie = `wildflower-site-mode=${role}; path=/; max-age=31536000; samesite=lax`;
    router.push(callbackUrl);
    router.refresh();
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-foreground/10 bg-card p-6 lg:p-8 shadow-xl">
      <div className="grid grid-cols-2 gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] p-1">
        {(["customer", "admin"] as Role[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleRoleChange(item)}
            className={cn("rounded-full px-4 py-2 text-sm transition-colors", role === item ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
          >
            {item === "customer" ? "Guest view" : "Admin view"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-foreground/10 bg-foreground/[0.03] p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Demo credentials</p>
        <p className="mt-1">{roleCopy.note}</p>
        <p className="mt-1 text-xs">This is a fake login. It only stores the selected view locally and opens the requested page immediately.</p>
      </div>

      <Button type="submit" className="h-12 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90" disabled={isLoading}>
        {isLoading ? "Signing in..." : role === "admin" ? "Open dashboard" : "Continue to checkout"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}