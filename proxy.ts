import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 120;

type Counter = {
  count: number;
  resetAt: number;
};

const rateStore = new Map<string, Counter>();

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function isWriteMethod(method: string) {
  return method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
}

function checkRateLimit(request: NextRequest) {
  const now = Date.now();
  const ip = getClientIp(request);
  const key = `${ip}:${request.nextUrl.pathname}`;
  const current = rateStore.get(key);

  if (!current || current.resetAt < now) {
    rateStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  current.count += 1;
  rateStore.set(key, current);
  return current.count <= MAX_REQUESTS_PER_WINDOW;
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === request.nextUrl.origin;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const allowedMethods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);
  if (!allowedMethods.has(request.method)) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!checkRateLimit(request)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (isWriteMethod(request.method) && !isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-site request blocked" }, { status: 403 });
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
