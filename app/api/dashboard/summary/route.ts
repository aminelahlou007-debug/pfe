import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { defaultCeremonies, defaultGuests, defaultTasks, defaultVendors } from "@/lib/site-data";
import { listFallback } from "@/lib/resource-store";

async function ensureSeeded<T extends Record<string, unknown>>(name: string, defaults: T[]) {
  const collection = await getCollection<T>(name);
  if (!collection) return null;
  if ((await collection.countDocuments()) === 0) {
    await collection.insertMany(defaults.map((item) => ({ ...item, createdAt: new Date(), updatedAt: new Date() })));
  }
  return collection;
}

export async function GET() {
  const guests = await ensureSeeded("guests", defaultGuests);
  const vendors = await ensureSeeded("vendors", defaultVendors);
  const tasks = await ensureSeeded("tasks", defaultTasks);
  const ceremonies = await ensureSeeded("ceremonies", defaultCeremonies);

  if (!guests || !vendors || !tasks || !ceremonies) {
    return NextResponse.json({
      stats: {
        activeEvents: listFallback("ceremonies").length,
        totalGuests: listFallback("guests").length,
        vendors: listFallback("vendors").length,
        openTasks: listFallback("tasks").length,
      },
      upcomingCeremonies: listFallback("ceremonies").slice(0, 3).map((item) => ({
        id: item.id,
        name: String(item.name),
        date: String((item as any).date ?? ""),
        guests: Number((item as any).expectedGuests ?? 0),
        status: "On Track",
      })),
    });
  }

  const [guestCount, vendorCount, taskCount, ceremonyCount, upcoming] = await Promise.all([
    guests.countDocuments(),
    vendors.countDocuments(),
    tasks.countDocuments(),
    ceremonies.countDocuments(),
    ceremonies.find({}).sort({ createdAt: -1 }).limit(3).toArray(),
  ]);

  return NextResponse.json({
    stats: {
      activeEvents: ceremonyCount,
      totalGuests: guestCount,
      vendors: vendorCount,
      openTasks: taskCount,
    },
    upcomingCeremonies: upcoming.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      date: item.date,
      guests: Number(item.expectedGuests || 0),
      status: "On Track",
    })),
  });
}
