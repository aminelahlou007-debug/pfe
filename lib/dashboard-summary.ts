import { NextResponse } from "next/server";
import type { OptionalUnlessRequiredId } from "mongodb";
import { getCollection } from "@/lib/mongodb";
import { defaultCeremonies, defaultGuests, defaultTasks, defaultVendors } from "@/lib/site-data";
import { listFallback } from "@/lib/resource-store";
import { noStoreHeaders } from "@/lib/security";

type CeremonySummary = {
  id: string;
  name: string;
  date: string;
  guests: number;
  status: "On Track";
};

type DashboardSummary = {
  stats: {
    activeEvents: number;
    totalGuests: number;
    vendors: number;
    openTasks: number;
  };
  upcomingCeremonies: CeremonySummary[];
};

async function ensureSeeded<T extends Record<string, unknown>>(name: string, defaults: T[]) {
  const collection = await getCollection<T>(name);
  if (!collection) return null;
  if ((await collection.countDocuments()) === 0) {
    const seededDocs = defaults.map((item) => ({ ...item, createdAt: new Date(), updatedAt: new Date() })) as unknown as OptionalUnlessRequiredId<T>[];
    await collection.insertMany(seededDocs);
  }
  return collection;
}

function toUpcomingCeremony(item: any): CeremonySummary {
  return {
    id: item._id?.toString?.() ?? item.id ?? "",
    name: String(item.name ?? ""),
    date: String(item.date ?? ""),
    guests: Number(item.expectedGuests ?? 0),
    status: "On Track",
  };
}

function sortCeremonies(items: any[]) {
  return [...items].sort((left, right) => Date.parse(String(left.date ?? "")) - Date.parse(String(right.date ?? "")));
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [guests, vendors, tasks, ceremonies] = await Promise.all([
    ensureSeeded("guests", defaultGuests),
    ensureSeeded("vendors", defaultVendors),
    ensureSeeded("tasks", defaultTasks),
    ensureSeeded("ceremonies", defaultCeremonies),
  ]);

  if (!guests || !vendors || !tasks || !ceremonies) {
    const fallbackCeremonies = sortCeremonies(listFallback("ceremonies")).slice(0, 3).map(toUpcomingCeremony);

    return {
      stats: {
        activeEvents: listFallback("ceremonies").length,
        totalGuests: listFallback("guests").length,
        vendors: listFallback("vendors").length,
        openTasks: listFallback("tasks").length,
      },
      upcomingCeremonies: fallbackCeremonies,
    };
  }

  const [guestCount, vendorCount, taskCount, ceremonyCount, upcoming] = await Promise.all([
    guests.countDocuments(),
    vendors.countDocuments(),
    tasks.countDocuments(),
    ceremonies.countDocuments(),
    ceremonies.find({}).toArray(),
  ]);

  return {
    stats: {
      activeEvents: ceremonyCount,
      totalGuests: guestCount,
      vendors: vendorCount,
      openTasks: taskCount,
    },
    upcomingCeremonies: sortCeremonies(upcoming).slice(0, 3).map(toUpcomingCeremony),
  };
}

export function dashboardSummaryResponse(summary: DashboardSummary) {
  return NextResponse.json(summary, { headers: noStoreHeaders() });
}

export type { DashboardSummary, CeremonySummary };