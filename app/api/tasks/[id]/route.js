import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { toClientDoc, toObjectId } from "@/lib/api-helpers";
import { deleteFallback, getFallback, updateFallback } from "@/lib/resource-store";
import { taskUpdateSchema } from "@/lib/validation";
import { jsonError, noStoreHeaders, readJsonBody, requireAdmin } from "@/lib/security";
export async function GET(_, { params }) {
    const authError = await requireAdmin();
    if (authError)
        return authError;
    const { id } = await params;
    const collection = await getCollection("tasks");
    if (!collection) {
        const task = getFallback("tasks", id);
        if (!task)
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(task, { headers: noStoreHeaders() });
    }
    const objectId = toObjectId(id);
    if (!objectId)
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const task = await collection.findOne({ _id: objectId });
    if (!task)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(toClientDoc(task), { headers: noStoreHeaders() });
}
export async function PUT(request, { params }) {
    const authError = await requireAdmin();
    if (authError)
        return authError;
    const { id } = await params;
    const collection = await getCollection("tasks");
    const body = await readJsonBody(request);
    if (!body)
        return jsonError("Invalid JSON body");
    const parsed = taskUpdateSchema.safeParse(body);
    if (!parsed.success)
        return jsonError("Invalid task data");
    if (!collection) {
        const updated = updateFallback("tasks", id, parsed.data);
        if (!updated)
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(updated, { headers: noStoreHeaders() });
    }
    const objectId = toObjectId(id);
    if (!objectId)
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const result = await collection.updateOne({ _id: objectId }, { $set: { ...parsed.data, updatedAt: new Date() } });
    if (!result.matchedCount)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = await collection.findOne({ _id: objectId });
    if (!updated)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(toClientDoc(updated), { headers: noStoreHeaders() });
}
export async function DELETE(_, { params }) {
    const authError = await requireAdmin();
    if (authError)
        return authError;
    const { id } = await params;
    const collection = await getCollection("tasks");
    if (!collection) {
        const deleted = deleteFallback("tasks", id);
        if (!deleted)
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ ok: true }, { headers: noStoreHeaders() });
    }
    const objectId = toObjectId(id);
    if (!objectId)
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const result = await collection.deleteOne({ _id: objectId });
    if (!result.deletedCount)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true }, { headers: noStoreHeaders() });
}
