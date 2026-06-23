import { ObjectId } from "mongodb";
import { defaultCeremonies, defaultGuests, defaultTasks, defaultVendors, } from "@/lib/site-data";
const globalForStore = globalThis;
function seedGuests() {
    return defaultGuests.map((item, index) => ({ id: String(index + 1), ...item }));
}
function seedVendors() {
    return defaultVendors.map((item, index) => ({ id: String(index + 1), ...item }));
}
function seedTasks() {
    return defaultTasks.map((item, index) => ({ id: String(index + 1), ...item }));
}
function seedCeremonies() {
    return defaultCeremonies.map((item, index) => ({ id: String(index + 1), ...item }));
}
function getStore() {
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
function getNextId(name) {
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
export function listFallback(name) {
    return [...getStore()[name]];
}
export function getFallback(name, id) {
    return getStore()[name].find((item) => item.id === id) ?? null;
}
export function createFallback(name, data) {
    const item = { id: getNextId(name), ...data };
    getStore()[name].unshift(item);
    return item;
}
export function updateFallback(name, id, patch) {
    const store = getStore()[name];
    const index = store.findIndex((item) => item.id === id);
    if (index === -1)
        return null;
    const updated = { ...store[index], ...patch, id };
    store[index] = updated;
    return updated;
}
export function deleteFallback(name, id) {
    const store = getStore()[name];
    const before = store.length;
    globalForStore.__wildflowerStore = {
        ...getStore(),
        [name]: store.filter((item) => item.id !== id),
    };
    return before !== globalForStore.__wildflowerStore[name].length;
}
export function toSeedWithObjectIds(items) {
    return items.map((item) => ({
        ...item,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
    }));
}
