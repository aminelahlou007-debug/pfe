import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { defaultVendors, VendorRecord } from "@/lib/site-data";
import { toClientDocs } from "@/lib/api-helpers";
import { createFallback, listFallback } from "@/lib/resource-store";
import { vendorCreateSchema } from "@/lib/validation";
import { jsonError, noStoreHeaders, readJsonBody, requireAdmin } from "@/lib/security";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const collection = await getCollection<VendorRecord>("vendors");
  if (!collection) return NextResponse.json(listFallback("vendors"), { headers: noStoreHeaders() });
  if ((await collection.countDocuments()) === 0) {
    await collection.insertMany(defaultVendors.map((item) => ({ ...item, createdAt: new Date(), updatedAt: new Date() })));
  }
  const vendors = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(toClientDocs(vendors), { headers: noStoreHeaders() });
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const collection = await getCollection<VendorRecord>("vendors");
  const body = await readJsonBody<unknown>(request);
  if (!body) return jsonError("Invalid JSON body");
  const parsed = vendorCreateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid vendor data");
  if (!collection) return NextResponse.json(createFallback("vendors", parsed.data), { status: 201, headers: noStoreHeaders() });
  const result = await collection.insertOne({ ...parsed.data, createdAt: new Date(), updatedAt: new Date() });
  return NextResponse.json({ id: result.insertedId.toString(), ...parsed.data }, { status: 201, headers: noStoreHeaders() });
}
