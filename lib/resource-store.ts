import { ObjectId } from "mongodb";
import {
  CeremonyRecord,
  defaultCeremonies,
  defaultGuests,
  defaultTasks,
  defaultVendors,
  GuestRecord,
  TaskRecord,
  VendorRecord,
} from "@/lib/site-data";

type BaseDoc = Record<string, unknown> & { id: string };

type CollectionName = "guests" | "vendors" | "tasks" | "ceremonies";

type StoreMap = {
  guests: BaseDoc[];
  vendors: BaseDoc[];
  tasks: BaseDoc[];
  ceremonies: BaseDoc[];
};

const globalForStore = globalThis as typeof globalThis & {
  __wildflowerStore?: StoreMap;
  __wildflowerCounters?: Record<CollectionName, number>;
};

function seedGuests(): BaseDoc[] {
  return defaultGuests.map((item, index) => ({ id: String(index + 1), ...item }));
}

function seedVendors(): BaseDoc[] {
  return defaultVendors.map((item, index) => ({ id: String(index + 1), ...item }));
}

function seedTasks(): BaseDoc[] {
  return defaultTasks.map((item, index) => ({ id: String(index + 1), ...item }));
}

function seedCeremonies(): BaseDoc[] {
  return defaultCeremonies.map((item, index) => ({ id: String(index + 1), ...item }));
}

function getStore(): StoreMap {
  if (!globalForStore.__wildflowerStore) {
    globalForStore.__wildflowerStore = {
      guests: seedGuests(),
      vendors: seedVendors(),
      tasks: seedTasks(),
      ceremonies: seedCeremonies(),
    };
    globalForStore.__wildflowerCounters = {
      guests: globalForStore.__wildflowerStore.guests.length,
      vendors: globalForStore.__wildflowerStore.vendors.length,
      tasks: globalForStore.__wildflowerStore.tasks.length,
      ceremonies: globalForStore.__wildflowerStore.ceremonies.length,
    };
  }

  return globalForStore.__wildflowerStore;
}

function getNextId(name: CollectionName) {
  if (!globalForStore.__wildflowerCounters) {
    globalForStore.__wildflowerCounters = {
      guests: 0,
      vendors: 0,
      tasks: 0,
      ceremonies: 0,
    };
  }

  globalForStore.__wildflowerCounters[name] += 1;
  return String(globalForStore.__wildflowerCounters[name]);
}

export function listFallback(name: CollectionName) {
  return [...getStore()[name]];
}

export function getFallback(name: CollectionName, id: string) {
  return getStore()[name].find((item) => item.id === id) ?? null;
}

export function createFallback<T extends BaseDoc>(name: CollectionName, data: Omit<T, "id">) {
  const item = { id: getNextId(name), ...data } as T;
  getStore()[name].unshift(item as BaseDoc);
  return item;
}

export function updateFallback<T extends BaseDoc>(name: CollectionName, id: string, patch: Partial<Omit<T, "id">>) {
  const store = getStore()[name];
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...store[index], ...patch, id } as T;
  store[index] = updated as BaseDoc;
  return updated;
}

export function deleteFallback(name: CollectionName, id: string) {
  const store = getStore()[name];
  const before = store.length;
  globalForStore.__wildflowerStore = {
    ...getStore(),
    [name]: store.filter((item) => item.id !== id),
  };
  return before !== globalForStore.__wildflowerStore[name].length;
}

export function toSeedWithObjectIds<T extends Record<string, unknown>>(items: T[]) {
  return items.map((item) => ({
    ...item,
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export type { CollectionName, BaseDoc };
