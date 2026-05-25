import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { GuestRecord } from "@/lib/site-data";
import { toClientDoc, toObjectId } from "@/lib/api-helpers";
import { deleteFallback, getFallback, updateFallback } from "@/lib/resource-store";
import { guestUpdateSchema } from "@/lib/validation";
import { jsonError, noStoreHeaders, readJsonBody, requireAdmin } from "@/lib/security";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const collection = await getCollection<GuestRecord>("guests");
  if (!collection) {
    const guest = getFallback("guests", id);
    if (!guest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(guest, { headers: noStoreHeaders() });
  }
  const objectId = toObjectId(id);
  if (!objectId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const guest = await collection.findOne({ _id: objectId });
  if (!guest) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(toClientDoc(guest), { headers: noStoreHeaders() });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const collection = await getCollection<GuestRecord>("guests");
  const body = await readJsonBody<unknown>(request);
  if (!body) return jsonError("Invalid JSON body");
  const parsed = guestUpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid guest data");
  if (!collection) {
    const updated = updateFallback("guests", id, parsed.data);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated, { headers: noStoreHeaders() });
  }
  const objectId = toObjectId(id);
  if (!objectId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const result = await collection.updateOne({ _id: objectId }, { $set: { ...parsed.data, updatedAt: new Date() } });
  if (!result.matchedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = await collection.findOne({ _id: objectId });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(toClientDoc(updated), { headers: noStoreHeaders() });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const collection = await getCollection<GuestRecord>("guests");
  if (!collection) {
    const deleted = deleteFallback("guests", id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true }, { headers: noStoreHeaders() });
  }
  const objectId = toObjectId(id);
  if (!objectId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const result = await collection.deleteOne({ _id: objectId });
  if (!result.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() });
}
