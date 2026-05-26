import { NextResponse } from "next/server";
import { buildChatKnowledgeBase } from "@/lib/chatbot-knowledge";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function normalizeQuestion(input: string) {
  return input.toLowerCase();
}

function fallbackAnswer(question: string) {
  const normalized = normalizeQuestion(question);

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
  const knowledgeBase = buildChatKnowledgeBase();
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
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
                `Knowledge base:\n${knowledgeBase}`,
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

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const text = data.output_text?.trim();
  return typeof text === "string" && text.length > 0 ? text : null;
}

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[] } | null = null;

  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const messages = Array.isArray(body?.messages)
    ? body!.messages
        .filter((message) => message && typeof message.content === "string")
        .slice(-12)
    : [];

  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";

  if (!latestUserMessage.trim()) {
    return NextResponse.json({ answer: "Ask me about the site purpose, ceremonies, vendors, flowers, food, venues, or tasks." });
  }

  const modelAnswer = await getModelAnswer(messages);
  const answer = modelAnswer ?? fallbackAnswer(latestUserMessage);

  return NextResponse.json({ answer });
}
