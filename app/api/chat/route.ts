import { NextResponse } from "next/server";
import { buildChatKnowledgeBase } from "@/lib/chatbot-knowledge";
import { defaultCeremonies } from "@/lib/site-data";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1200;
const MODEL_TIMEOUT_MS = 9000;
const CHAT_KNOWLEDGE_BASE = buildChatKnowledgeBase();
const CEREMONY_GUEST_COUNTS = defaultCeremonies.map((ceremony) => ({
  name: ceremony.name,
  expectedGuests: Number(ceremony.expectedGuests || 0),
}));
const TOTAL_GUESTS = CEREMONY_GUEST_COUNTS.reduce((sum, ceremony) => sum + ceremony.expectedGuests, 0);

function normalizeQuestion(input: string) {
  return input.toLowerCase();
}

function fallbackAnswer(question: string) {
  const normalized = normalizeQuestion(question);

  if (normalized.includes("guest") || normalized.includes("guests") || normalized.includes("guest count") || normalized.includes("counts")) {
    const matchedCeremony = CEREMONY_GUEST_COUNTS.find((ceremony) => normalized.includes(ceremony.name.toLowerCase()));
    if (matchedCeremony) {
      return `${matchedCeremony.name} currently has an expected guest count of ${matchedCeremony.expectedGuests}.`;
    }
    const topCeremonies = CEREMONY_GUEST_COUNTS.map((ceremony) => `${ceremony.name}: ${ceremony.expectedGuests}`).join("; ");
    return `Across demo ceremonies, the expected total guest count is ${TOTAL_GUESTS}. Breakdown: ${topCeremonies}.`;
  }

  if (normalized.includes("purpose") || normalized.includes("what is this") || normalized.includes("what does")) {
    return "Wildflower Co. is an event planning and ceremony management app. It helps organize ceremonies, guests, vendors, tasks, and event details in one place.";
  }

  if (normalized.includes("flower") || normalized.includes("floral")) {
    return "For flowers, the demo data includes Bloom Flowers Co., a florist focused on bespoke floral arrangements, seasonal blooms, and sustainable sourcing.";
  }

  if (normalized.includes("food") || normalized.includes("menu") || normalized.includes("cater")) {
    return "For food, the demo data includes Elite Catering, which offers full-service catering with customizable menus, tastings, and staffing.";
  }

  if (normalized.includes("venue") || normalized.includes("where") || normalized.includes("location") || normalized.includes("area")) {
    return "The demo ceremonies include venues like Grand Ballroom, Convention Center, Garden Estate, Rooftop Venue, and Beach Resort. I can also tell you the address for a specific event if you ask by name.";
  }

  if (normalized.includes("task") || normalized.includes("todo") || normalized.includes("planning")) {
    return "The app tracks planning tasks like finalizing menus, confirming flower arrangements, sending guest counts, reviewing AV requirements, and ordering decorations.";
  }

  if (normalized.includes("vendor")) {
    return "The demo vendors include florist, catering, entertainment, photography, and bakery listings. Ask for a specific vendor category or name and I can narrow it down.";
  }

  return "I can answer questions about the app purpose, ceremonies, venues, guest counts, vendors, flowers, food, and planning tasks. Try asking for a specific event or category.";
}

async function getModelAnswer(messages: ChatMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: [
                  "You are a helpful assistant for Wildflower Co.",
                  "Only answer using the provided knowledge base and the user's question.",
                  "If the answer is not in the knowledge base, say you do not know and suggest asking about the demo ceremonies, vendors, flowers, food, venues, or tasks.",
                  `Knowledge base:\n${CHAT_KNOWLEDGE_BASE}`,
                ].join("\n\n"),
              },
            ],
          },
          ...messages.map((message) => ({
            role: message.role,
            content: [{ type: "input_text", text: message.content }],
          })),
        ],
        max_output_tokens: 250,
        temperature: 0.2,
        metadata: {
          latestUserMessage,
        },
      }),
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    return null;
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    return null;
  }

  const topLevel = typeof data?.output_text === "string" ? data.output_text.trim() : "";
  if (topLevel) return topLevel;

  if (!Array.isArray(data?.output)) return null;

  const parts: string[] = [];

  for (const item of data.output) {
    const contents = Array.isArray(item?.content) ? item.content : [];
    for (const block of contents) {
      const text = typeof block?.text === "string" ? block.text : block?.text?.value;
      if (typeof text === "string") {
        const cleaned = text.trim();
        if (cleaned) parts.push(cleaned);
      }
    }
  }

  const combined = parts.join("\n").trim();
  return combined || null;
}

function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];

  const sanitized: ChatMessage[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const roleValue = (item as { role?: unknown }).role;
    const contentValue = (item as { content?: unknown }).content;
    if (typeof contentValue !== "string") continue;

    const role: "user" | "assistant" = roleValue === "assistant" ? "assistant" : "user";
    const content = contentValue.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!content) continue;

    sanitized.push({ role, content });
  }

  return sanitized.slice(-MAX_MESSAGES);
}

export async function POST(request: Request) {
  let body: { messages?: unknown } | null = null;

  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const messages = sanitizeMessages(body?.messages);

  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";

  if (!latestUserMessage.trim()) {
    return NextResponse.json({ answer: "Ask me about the site purpose, ceremonies, vendors, flowers, food, venues, or tasks." });
  }

  const modelAnswer = await getModelAnswer(messages);
  const answer = modelAnswer ?? fallbackAnswer(latestUserMessage);

  return NextResponse.json({ answer }, { headers: { "Cache-Control": "no-store" } });
}
