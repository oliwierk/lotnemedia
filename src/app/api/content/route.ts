import { NextResponse } from "next/server";
import { readContent, saveContent, type Content } from "@/lib/content-store";
import type { TextOverrides } from "@/i18n/text-fields";

const MAX_TEXT_LENGTH = 5000;

function checkAuth(request: Request) {
  const key = request.headers.get("x-admin-key");
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && key === pw;
}

function sanitizeTexts(input: unknown): TextOverrides | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const out: TextOverrides = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (typeof value !== "string") continue;
    out[key] = value.slice(0, MAX_TEXT_LENGTH);
  }
  return out;
}

export async function GET() {
  return NextResponse.json(await readContent());
}

export async function PUT(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const patch: Partial<Content> = {};

  if (typeof body.bioShort === "string") patch.bioShort = body.bioShort;
  if (typeof body.bioFull === "string") patch.bioFull = body.bioFull;
  if (Array.isArray(body.awards)) patch.awards = body.awards;
  if ("texts" in body) {
    const texts = sanitizeTexts(body.texts);
    if (!texts) return NextResponse.json({ error: "Invalid texts" }, { status: 400 });
    patch.texts = texts;
  }

  const { content, saved, error } = await saveContent(patch);
  if (!saved) return NextResponse.json({ error: error || "Zapis nie powiódł się" }, { status: 500 });
  return NextResponse.json(content);
}
