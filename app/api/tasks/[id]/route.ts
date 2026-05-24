import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { TaskRecord } from "@/lib/site-data";
import { toClientDoc, toObjectId } from "@/lib/api-helpers";
import { deleteFallback, getFallback, updateFallback } from "@/lib/resource-store";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = await getCollection<TaskRecord>("tasks");
  if (!collection) {
    const task = getFallback("tasks", id);
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(task);
  }
  const objectId = toObjectId(id);
  if (!objectId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const task = await collection.findOne({ _id: objectId });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(toClientDoc(task));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = await getCollection<TaskRecord>("tasks");
  const body = (await request.json()) as Partial<TaskRecord>;
  if (!collection) {
    const updated = updateFallback("tasks", id, body);
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
  const collection = await getCollection<TaskRecord>("tasks");
  if (!collection) {
    const deleted = deleteFallback("tasks", id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  }
  const objectId = toObjectId(id);
  if (!objectId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const result = await collection.deleteOne({ _id: objectId });
  if (!result.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
