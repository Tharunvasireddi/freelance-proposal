import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const responseSchema = {
  type: "object",
  properties: {
    scope: { type: "string" },
    timeline: { type: "string" },
    pricing: { type: "string" },
    contract: { type: "string" },
  },
  required: ["scope", "timeline", "pricing", "contract"],
  additionalProperties: false,
};

function parseJsonObject(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty AI response");
  }

  try {
    return JSON.parse(rawText);
  } catch {
    const start = rawText.indexOf("{");
    const end = rawText.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("AI response is not valid JSON");
    }
    return JSON.parse(rawText.slice(start, end + 1));
  }
}

function sanitizeGeneratedField(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function generateProposalSections(originalInput) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const completion = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "You are a senior freelance proposal assistant. Generate concise, professional outputs suitable for client delivery.",
          },
          {
            text: `Client requirements:\n${originalInput}`,
          },
        ],
      },
    ],
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const raw = completion.text;
  const payload = parseJsonObject(raw || "");

  return {
    scope: sanitizeGeneratedField(payload.scope),
    timeline: sanitizeGeneratedField(payload.timeline),
    pricing: sanitizeGeneratedField(payload.pricing),
    contract: sanitizeGeneratedField(payload.contract),
  };
}
