import { NextResponse } from "next/server";

// In-memory cache: key = JSON of input texts, value = translations array
const cache = new Map<string, string[]>();

async function translateOne(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pl|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory error: ${res.status}`);
  const data = (await res.json()) as { responseData?: { translatedText?: string }; responseStatus?: number };
  const translated = data.responseData?.translatedText;
  if (!translated) throw new Error("Empty translation");
  return translated;
}

export async function POST(request: Request) {
  const { texts } = (await request.json()) as { texts: string[] };

  if (!Array.isArray(texts) || texts.length === 0) {
    return NextResponse.json({ translations: [] });
  }

  const cacheKey = JSON.stringify(texts);
  if (cache.has(cacheKey)) {
    return NextResponse.json({ translations: cache.get(cacheKey) });
  }

  const translations = await Promise.all(texts.map(translateOne));

  cache.set(cacheKey, translations);
  return NextResponse.json({ translations });
}
