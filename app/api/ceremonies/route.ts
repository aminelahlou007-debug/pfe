import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { CeremonyRecord, defaultCeremonies } from "@/lib/site-data";
import { toClientDocs } from "@/lib/api-helpers";
import { createFallback, listFallback } from "@/lib/resource-store";
import { ceremonyCreateSchema } from "@/lib/validation";
import { jsonError, noStoreHeaders, readJsonBody, requireAdmin } from "@/lib/security";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const collection = await getCollection<CeremonyRecord>("ceremonies");
  if (!collection) return NextResponse.json(listFallback("ceremonies"), { headers: noStoreHeaders() });
  if ((await collection.countDocuments()) === 0) {
    await collection.insertMany(defaultCeremonies.map((item) => ({ ...item, createdAt: new Date(), updatedAt: new Date() })));
  }
  const ceremonies = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(toClientDocs(ceremonies), { headers: noStoreHeaders() });
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const collection = await getCollection<CeremonyRecord>("ceremonies");
  const body = await readJsonBody<unknown>(request);
  if (!body) return jsonError("Invalid JSON body");
  const parsed = ceremonyCreateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid ceremony data");
  if (!collection) return NextResponse.json(createFallback("ceremonies", parsed.data), { status: 201, headers: noStoreHeaders() });
  const result = await collection.insertOne({ ...parsed.data, createdAt: new Date(), updatedAt: new Date() });
  return NextResponse.json({ id: result.insertedId.toString(), ...parsed.data }, { status: 201, headers: noStoreHeaders() });
}
