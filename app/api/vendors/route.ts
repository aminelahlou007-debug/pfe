import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { defaultVendors, VendorRecord } from "@/lib/site-data";
import { toClientDocs } from "@/lib/api-helpers";
import { createFallback, listFallback } from "@/lib/resource-store";

function normalizeVendor(body: Partial<VendorRecord>): VendorRecord {
  return {
    name: body.name ?? "Untitled Vendor",
    category: body.category ?? "Other",
    contact: body.contact ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    location: body.location ?? "",
    rating: body.rating ?? 0,
    status: body.status ?? "Pending",
    description: body.description ?? body.notes ?? "",
    reviews: body.reviews ?? [],
  };
}

export async function GET() {
  const collection = await getCollection<VendorRecord>("vendors");
  if (!collection) return NextResponse.json(listFallback("vendors"));
  if ((await collection.countDocuments()) === 0) {
    await collection.insertMany(defaultVendors.map((item) => ({ ...item, createdAt: new Date(), updatedAt: new Date() })));
  }
  const vendors = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(toClientDocs(vendors));
}

export async function POST(request: Request) {
  const collection = await getCollection<VendorRecord>("vendors");
  const body = normalizeVendor((await request.json()) as Partial<VendorRecord>);
  if (!collection) return NextResponse.json(createFallback("vendors", body), { status: 201 });
  const result = await collection.insertOne({ ...body, createdAt: new Date(), updatedAt: new Date() });
  return NextResponse.json({ id: result.insertedId.toString(), ...body }, { status: 201 });
}
