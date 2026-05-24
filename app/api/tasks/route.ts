import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { defaultTasks, TaskRecord } from "@/lib/site-data";
import { toClientDocs } from "@/lib/api-helpers";
import { createFallback, listFallback } from "@/lib/resource-store";

function normalizeTask(body: Partial<TaskRecord>): TaskRecord {
  return {
    title: body.title ?? "Untitled Task",
    description: body.description ?? "",
    ceremony: body.ceremony ?? "",
    dueDate: body.dueDate ?? "",
    priority: body.priority ?? "Low",
    status: body.status ?? "Todo",
    assignee: body.assignee ?? "",
    category: body.category ?? "",
  };
}

export async function GET() {
  const collection = await getCollection<TaskRecord>("tasks");
  if (!collection) return NextResponse.json(listFallback("tasks"));
  if ((await collection.countDocuments()) === 0) {
    await collection.insertMany(defaultTasks.map((item) => ({ ...item, createdAt: new Date(), updatedAt: new Date() })));
  }
  const tasks = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(toClientDocs(tasks));
}

export async function POST(request: Request) {
  const collection = await getCollection<TaskRecord>("tasks");
  const body = normalizeTask((await request.json()) as Partial<TaskRecord>);
  if (!collection) return NextResponse.json(createFallback("tasks", body), { status: 201 });
  const result = await collection.insertOne({ ...body, createdAt: new Date(), updatedAt: new Date() });
  return NextResponse.json({ id: result.insertedId.toString(), ...body }, { status: 201 });
}
