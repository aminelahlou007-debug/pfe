import { z } from "zod";
const trimmedString = (max = 500) => z.string().trim().min(1).max(max);
export const guestCreateSchema = z.object({
    name: trimmedString(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().max(40).optional().default(""),
    ceremony: trimmedString(120),
    rsvp: z.enum(["Confirmed", "Pending", "Declined"]),
    dietary: z.string().trim().max(200).optional().default(""),
    plusOne: z.boolean().optional().default(false),
    notes: z.string().trim().max(1000).optional().default(""),
});
export const guestUpdateSchema = guestCreateSchema.partial();
const vendorBaseSchema = z.object({
    name: trimmedString(140),
    category: trimmedString(80),
    contact: z.string().trim().max(120).optional().default(""),
    email: z.string().trim().email().max(254).optional().default(""),
    phone: z.string().trim().max(40).optional().default(""),
    location: z.string().trim().max(120).optional().default(""),
    rating: z.coerce.number().min(0).max(5).optional().default(0),
    status: z.enum(["Active", "Pending", "Inactive"]),
    description: z.string().trim().max(2000).optional().default(""),
    notes: z.string().trim().max(2000).optional().default(""),
    reviews: z.array(z.any()).optional().default([]),
});
export const vendorCreateSchema = vendorBaseSchema.transform(({ notes, ...rest }) => ({
    ...rest,
    description: rest.description || notes || "",
}));
export const vendorUpdateSchema = vendorBaseSchema.partial();
export const taskCreateSchema = z.object({
    title: trimmedString(140),
    description: z.string().trim().max(2000).optional().default(""),
    ceremony: z.string().trim().max(120).optional().default(""),
    dueDate: z.string().trim().max(40).optional().default(""),
    priority: z.enum(["High", "Medium", "Low"]),
    status: z.enum(["Todo", "In Progress", "Done"]),
    assignee: z.string().trim().max(120).optional().default(""),
    category: z.string().trim().max(120).optional().default(""),
});
export const taskUpdateSchema = taskCreateSchema.partial();
export const ceremonyCreateSchema = z.object({
    name: trimmedString(140),
    type: z.string().trim().max(80).optional().default("Other"),
    date: z.string().trim().max(40).optional().default(""),
    time: z.string().trim().max(40).optional().default(""),
    venue: z.string().trim().max(140).optional().default(""),
    address: z.string().trim().max(200).optional().default(""),
    expectedGuests: z.string().trim().max(20).optional().default("0"),
    budget: z.string().trim().max(40).optional().default(""),
    description: z.string().trim().max(2000).optional().default(""),
});
export const ceremonyUpdateSchema = ceremonyCreateSchema.partial();
