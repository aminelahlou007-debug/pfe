import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { defaultGuests, GuestRecord } from "@/lib/site-data";
import { toClientDocs } from "@/lib/api-helpers";
import { createFallback, listFallback } from "@/lib/resource-store";

export async function GET() {
  const collection = await getCollection<GuestRecord>("guests");
  if (!collection) return NextResponse.json(listFallback("guests"));
  if ((await collection.countDocuments()) === 0) {
    await collection.insertMany(defaultGuests.map((item) => ({ ...item, createdAt: new Date(), updatedAt: new Date() })));
  }
  const guests = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(toClientDocs(guests));
}

export async function POST(request: Request) {
  const collection = await getCollection<GuestRecord>("guests");
  const body = (await request.json()) as GuestRecord;
  if (!collection) return NextResponse.json(createFallback("guests", body), { status: 201 });
  const result = await collection.insertOne({ ...body, createdAt: new Date(), updatedAt: new Date() });
  return NextResponse.json({ id: result.insertedId.toString(), ...body }, { status: 201 });
}
