import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { defaultGuests } from "@/lib/site-data";
import { toClientDocs } from "@/lib/api-helpers";
import { createFallback, listFallback } from "@/lib/resource-store";
import { guestCreateSchema } from "@/lib/validation";
import { jsonError, noStoreHeaders, readJsonBody, requireAdmin } from "@/lib/security";
export async function GET() {
    const authError = await requireAdmin();
    if (authError)
        return authError;
    const collection = await getCollection("guests");
    if (!collection)
        return NextResponse.json(listFallback("guests"), { headers: noStoreHeaders() });
    if ((await collection.countDocuments()) === 0) {
        await collection.insertMany(defaultGuests.map((item) => ({ ...item, createdAt: new Date(), updatedAt: new Date() })));
    }
    const guests = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(toClientDocs(guests), { headers: noStoreHeaders() });
}
export async function POST(request) {
    const authError = await requireAdmin();
    if (authError)
        return authError;
    const collection = await getCollection("guests");
    const body = await readJsonBody(request);
    if (!body)
        return jsonError("Invalid JSON body");
    const parsed = guestCreateSchema.safeParse(body);
    if (!parsed.success)
        return jsonError("Invalid guest data");
    if (!collection)
        return NextResponse.json(createFallback("guests", parsed.data), { status: 201, headers: noStoreHeaders() });
    const result = await collection.insertOne({ ...parsed.data, createdAt: new Date(), updatedAt: new Date() });
    return NextResponse.json({ id: result.insertedId.toString(), ...parsed.data }, { status: 201, headers: noStoreHeaders() });
}
