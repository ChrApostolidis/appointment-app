import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { categories } from "../../registerForms/data";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const RequestSchema = z.object({
  problem: z.string().trim().min(3).max(1000),
});

const categoryNames = categories.map((c) => c.name);
const categoryNameSet = new Set(categoryNames);

const ClassificationSchema = z.object({
  needs_clarification: z.boolean(),
  clarification_question: z.string().optional(),
  matches: z
    .array(
      z.object({
        category: z.string(),
        reason: z.string(),
      })
    )
    .max(3),
});

function buildPrompt(problem: string) {
  return `
You are a professional matching assistant for a marketplace platform that connects users with professionals across many fields (medical, legal, trades, financial, creative, technical, beauty, home services, education, hospitality, and more).

Your only job: read a user's problem and match it to the most relevant professional category (or categories) from the LIST below.

## RULES
- Only use categories from the LIST. Never invent, rename, pluralize, or merge categories. Spell each match EXACTLY as it appears in the LIST (case and punctuation must match).
- Return between 1 and 3 categories. Pick the fewest that cover the problem well, ranked best fit first.
- If the problem is too vague, off-topic, gibberish, or too short to match confidently, set "needs_clarification" to true, leave "matches" as [], and provide a short, friendly "clarification_question" that invites the user to give more detail. Do NOT guess.
- Treat as needing clarification: random characters ("asdkjf"), one-word inputs that could match many things ("help", "issue"), unrelated chit-chat ("hi", "what's the weather"), or anything where you'd be guessing more than matching.
- "Reason" must be one short, friendly sentence written for the end user (not technical jargon). Mention what the professional will do for them.
- Do NOT include any text outside the JSON. No markdown, no code fences, no comments.

## CATEGORIES LIST
${categoryNames.join(", ")}

## USER PROBLEM
"""${problem}"""

## OUTPUT FORMAT (strict JSON)
If you can match confidently:
{"needs_clarification": false, "matches": [{"category": "Exact Category Name", "reason": "One friendly sentence."}]}

If the problem is too vague / off-topic / gibberish:
{"needs_clarification": true, "clarification_question": "A short helpful question.", "matches": []}
`.trim();
}

function extractJson(raw: string): string {
  const stripped = raw.replace(/```json|```/g, "").trim();
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return stripped;
  return stripped.slice(start, end + 1);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        needs_clarification: true,
        clarification_question:
          "Could you describe your problem in a bit more detail? A short sentence is enough.",
        matches: [],
      },
      { status: 200 }
    );
  }

  const { problem } = parsed.data;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: buildPrompt(problem),
    });
  } catch (error) {
    console.error("Gemini request failed:", error);
    const detail =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Could not reach the matching service. Please try again.",
        detail,
      },
      { status: 502 }
    );
  }

  const text = response.text ?? "";
  const cleaned = extractJson(text);

  let raw: unknown;
  try {
    raw = JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", error, text);
    return NextResponse.json(
      {
        needs_clarification: true,
        clarification_question:
          "I couldn't quite understand that. Could you rephrase your problem with a bit more detail?",
        matches: [],
      },
      { status: 200 }
    );
  }

  const validated = ClassificationSchema.safeParse(raw);
  if (!validated.success) {
    return NextResponse.json(
      {
        needs_clarification: true,
        clarification_question:
          "I couldn't quite understand that. Could you rephrase your problem with a bit more detail?",
        matches: [],
      },
      { status: 200 }
    );
  }

  const allowedMatches = validated.data.matches.filter((m) =>
    categoryNameSet.has(m.category)
  );

  if (!validated.data.needs_clarification && allowedMatches.length === 0) {
    return NextResponse.json({
      needs_clarification: true,
      clarification_question:
        "I couldn't find a clear match. Could you describe what kind of help you need (e.g. home repair, health, legal, design)?",
      matches: [],
    });
  }

  return NextResponse.json({
    needs_clarification: validated.data.needs_clarification,
    clarification_question: validated.data.clarification_question,
    matches: allowedMatches,
  });
}
