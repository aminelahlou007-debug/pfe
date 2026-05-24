import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { GuestRecord } from "@/lib/site-data";
import { toClientDoc, toObjectId } from "@/lib/api-helpers";
import { deleteFallback, getFallback, updateFallback } from "@/lib/resource-store";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = await getCollection<GuestRecord>("guests");
  if (!collection) {
    const guest = getFallback("guests", id);
    if (!guest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(guest);
  }
  const objectId = toObjectId(id);
  if (!objectId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const guest = await collection.findOne({ _id: objectId });
  if (!guest) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(toClientDoc(guest));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = await getCollection<GuestRecord>("guests");
  const body = (await request.json()) as Partial<GuestRecord>;
  if (!collection) {
    const updated = updateFallback("guests", id, body);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  }
  const objectId = toObjectId(id);
  if (!objectId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const result = await collection.findOneAndUpdate(
    { _id: objectId },
    { $set: { ...body, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(toClientDoc(result));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = await getCollection<GuestRecord>("guests");
  if (!collection) {
    const deleted = deleteFallback("guests", id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  }
  const objectId = toObjectId(id);
  if (!objectId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const result = await collection.deleteOne({ _id: objectId });
  if (!result.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
