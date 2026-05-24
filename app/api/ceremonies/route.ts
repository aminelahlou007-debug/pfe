import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { CeremonyRecord, defaultCeremonies } from "@/lib/site-data";
import { toClientDocs } from "@/lib/api-helpers";
import { createFallback, listFallback } from "@/lib/resource-store";

function normalizeCeremony(body: Partial<CeremonyRecord>): CeremonyRecord {
  return {
    name: body.name ?? "Untitled Event",
    type: body.type ?? "Other",
    date: body.date ?? "",
    time: body.time ?? "",
    venue: body.venue ?? "",
    address: body.address ?? "",
    expectedGuests: body.expectedGuests ?? "0",
    budget: body.budget ?? "",
    description: body.description ?? "",
  };
}

export async function GET() {
  const collection = await getCollection<CeremonyRecord>("ceremonies");
  if (!collection) return NextResponse.json(listFallback("ceremonies"));
  if ((await collection.countDocuments()) === 0) {
    await collection.insertMany(defaultCeremonies.map((item) => ({ ...item, createdAt: new Date(), updatedAt: new Date() })));
  }
  const ceremonies = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(toClientDocs(ceremonies));
}

export async function POST(request: Request) {
  const collection = await getCollection<CeremonyRecord>("ceremonies");
  const body = normalizeCeremony((await request.json()) as Partial<CeremonyRecord>);
  if (!collection) return NextResponse.json(createFallback("ceremonies", body), { status: 201 });
  const result = await collection.insertOne({ ...body, createdAt: new Date(), updatedAt: new Date() });
  return NextResponse.json({ id: result.insertedId.toString(), ...body }, { status: 201 });
}
