"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";
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
  const [email, setEmail] = useState(demoCredentials[role].email);
  const [password, setPassword] = useState(demoCredentials[role].password);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = useMemo(() => {
    const fallback = role === "admin" ? "/dashboard" : "/checkout";
    return searchParams.get("callbackUrl") || fallback;
  }, [role, searchParams]);

  const roleCopy = demoCredentials[role];

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    setEmail(demoCredentials[nextRole].email);
    setPassword(demoCredentials[nextRole].password);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role,
      callbackUrl,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid demo credentials. Use the sample account shown on this page.");
      return;
    }

    router.push(result?.url || callbackUrl);
    router.refresh();
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
            {item === "customer" ? "Guest / Buyer" : "Admin / Editor"}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 w-full rounded-xl border border-foreground/10 bg-background px-4 text-sm outline-none focus:border-foreground/30"
          placeholder={roleCopy.email}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 w-full rounded-xl border border-foreground/10 bg-background px-4 text-sm outline-none focus:border-foreground/30"
          placeholder={demoCredentials[role].password}
          autoComplete="current-password"
          required
        />
      </div>

      <input type="hidden" name="role" value={role} />

      <div className="rounded-2xl border border-dashed border-foreground/10 bg-foreground/[0.03] p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Demo credentials</p>
        <p className="mt-1">{roleCopy.email} / {roleCopy.password}</p>
        <p className="mt-1">{roleCopy.note}</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="h-12 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90" disabled={isLoading}>
        {isLoading ? "Signing in..." : role === "admin" ? "Open dashboard" : "Continue to checkout"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}