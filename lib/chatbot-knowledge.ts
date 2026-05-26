import { defaultCeremonies, defaultTasks, defaultVendors } from "@/lib/site-data";

function formatList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildChatKnowledgeBase() {
  const ceremonyLines = defaultCeremonies.map(
    (ceremony) =>
      `${ceremony.name}: ${ceremony.type} at ${ceremony.venue}, ${ceremony.address}. Date ${ceremony.date} at ${ceremony.time}. Expected guests ${ceremony.expectedGuests}. Budget ${ceremony.budget}. ${ceremony.description}`
  );

  const vendorLines = defaultVendors.map(
    (vendor) =>
      `${vendor.name} (${vendor.category}) - ${vendor.description} Contact ${vendor.contact}, ${vendor.email}, ${vendor.phone}. Location ${vendor.location}. Status ${vendor.status}. Rating ${vendor.rating}/5.`
  );

  const taskLines = defaultTasks.map(
    (task) =>
      `${task.title} for ${task.ceremony}: ${task.description}. Due ${task.dueDate}. Priority ${task.priority}. Status ${task.status}. Assignee ${task.assignee}. Category ${task.category}.`
  );

  return [
    "Wildflower Co. is an event planning and ceremony management app for weddings, corporate events, anniversaries, birthdays, and vow renewals.",
    "It helps answer questions about the platform purpose, ceremonies, venues, guest counts, budgets, vendors, food, flowers, and planning tasks.",
    "Known ceremonies:\n" + formatList(ceremonyLines),
    "Known vendors:\n" + formatList(vendorLines),
    "Known tasks:\n" + formatList(taskLines),
  ].join("\n\n");
}
