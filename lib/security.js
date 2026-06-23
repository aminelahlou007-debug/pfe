import { NextResponse } from "next/server";
export function jsonError(message, status = 400) {
    return NextResponse.json({ error: message }, { status, headers: noStoreHeaders() });
}
export function noStoreHeaders() {
    return {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
    };
}
export async function requireAdmin() {
    return null;
}
export async function readJsonBody(request) {
    try {
        return (await request.json());
    }
    catch {
        return null;
    }
}
