import { NextResponse } from "next/server";

/**
 * Tłumaczenie PL → EN.
 *
 * Domyślnie korzysta z MyMemory — darmowego API bez klucza i bez rejestracji.
 * Jeśli w środowisku jest `DEEPL_API_KEY`, używa DeepL (darmowy plan: 500 tys. znaków
 * miesięcznie), bo jakość polskiego jest wyraźnie lepsza. Gdy DeepL zawiedzie,
 * automatycznie wraca do MyMemory.
 */

const MAX_TEXTS = 60;
const MAX_CHARS_PER_TEXT = 5000;
/** MyMemory obcina długie zapytania — dłuższe teksty tniemy na kawałki. */
const MYMEMORY_CHUNK = 480;
const CACHE_LIMIT = 1000;

const cache = new Map<string, string>();

function cacheGet(key: string): string | undefined {
  return cache.get(key);
}

function cacheSet(key: string, value: string) {
  if (cache.size >= CACHE_LIMIT) {
    // Najprostsza eksmisja: usuwamy najstarszy wpis (Map zachowuje kolejność wstawiania).
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
}

/* ─── DeepL (opcjonalny) ─── */

function deeplEndpoint(key: string): string {
  if (process.env.DEEPL_API_URL) return process.env.DEEPL_API_URL;
  // Klucze darmowego planu kończą się na ":fx" i działają tylko na api-free.
  return key.trim().endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";
}

async function translateWithDeepL(texts: string[], key: string): Promise<string[]> {
  const res = await fetch(deeplEndpoint(key), {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: texts, source_lang: "PL", target_lang: "EN-GB" }),
  });

  if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as { translations?: { text?: string }[] };
  const out = data.translations?.map((t) => t.text ?? "");
  if (!out || out.length !== texts.length) throw new Error("DeepL: nieoczekiwana odpowiedź");
  return out;
}

/* ─── MyMemory (domyślny, bez klucza) ─── */

/** Dzieli tekst na fragmenty ≤ limit, w miarę możliwości na granicy zdań. */
function chunkText(text: string, limit = MYMEMORY_CHUNK): string[] {
  if (text.length <= limit) return [text];

  const chunks: string[] = [];
  let current = "";

  // Zdania (kropka/!/?) albo — gdy pojedyncze zdanie jest za długie — słowa.
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
  for (const sentence of sentences) {
    const pieces = sentence.length > limit ? sentence.split(/(?<=\s)/) : [sentence];
    for (const piece of pieces) {
      if (current && current.length + piece.length > limit) {
        chunks.push(current);
        current = "";
      }
      // Pojedyncze słowo dłuższe niż limit — tniemy twardo.
      if (piece.length > limit) {
        for (let i = 0; i < piece.length; i += limit) chunks.push(piece.slice(i, i + limit));
        continue;
      }
      current += piece;
    }
  }
  if (current) chunks.push(current);
  return chunks.filter((c) => c.length > 0);
}

async function myMemoryChunk(text: string): Promise<string> {
  const params = new URLSearchParams({ q: text, langpair: "pl|en" });
  // Podanie adresu e-mail podnosi darmowy limit z 5 tys. do 50 tys. znaków dziennie.
  const email = process.env.MYMEMORY_EMAIL;
  if (email) params.set("de", email);

  const res = await fetch(`https://api.mymemory.translated.net/get?${params}`);
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);

  const data = (await res.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number | string;
  };
  const translated = data.responseData?.translatedText;
  if (!translated) throw new Error("MyMemory: pusta odpowiedź");
  // Przy przekroczeniu limitu MyMemory zwraca komunikat zamiast tłumaczenia.
  if (/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(translated)) {
    throw new Error("MyMemory: limit zapytań");
  }
  return translated;
}

async function translateWithMyMemory(text: string): Promise<string> {
  // Puste linie zachowujemy, żeby nie gubić akapitów (np. podtytuł w hero).
  const lines = text.split("\n");
  const out: string[] = [];

  for (const line of lines) {
    if (!line.trim()) {
      out.push(line);
      continue;
    }
    const parts: string[] = [];
    for (const chunk of chunkText(line)) {
      parts.push(await myMemoryChunk(chunk));
    }
    out.push(parts.join(" ").replace(/\s+/g, " ").trim());
  }
  return out.join("\n");
}

/* ─── handler ─── */

export async function POST(request: Request) {
  let body: { texts?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy JSON" }, { status: 400 });
  }

  const input = body.texts;
  if (!Array.isArray(input) || input.length === 0) {
    return NextResponse.json({ translations: [] });
  }
  if (input.length > MAX_TEXTS) {
    return NextResponse.json({ error: `Maksymalnie ${MAX_TEXTS} tekstów naraz` }, { status: 400 });
  }

  const texts = input.map((t) => (typeof t === "string" ? t.slice(0, MAX_CHARS_PER_TEXT) : ""));
  const deeplKey = process.env.DEEPL_API_KEY;
  const provider = deeplKey ? "deepl" : "mymemory";

  // Puste teksty i trafienia w cache załatwiamy bez odpytywania API.
  const translations: (string | null)[] = texts.map((t) =>
    t.trim() === "" ? t : (cacheGet(`${provider}:${t}`) ?? null)
  );
  const todo = texts
    .map((t, i) => ({ t, i }))
    .filter(({ i, t }) => translations[i] === null && t.trim() !== "");

  if (todo.length === 0) {
    return NextResponse.json({ translations, provider });
  }

  if (deeplKey) {
    try {
      const out = await translateWithDeepL(
        todo.map((x) => x.t),
        deeplKey
      );
      todo.forEach(({ i, t }, n) => {
        translations[i] = out[n];
        cacheSet(`deepl:${t}`, out[n]);
      });
      return NextResponse.json({ translations, provider: "deepl" });
    } catch (err) {
      console.error("DeepL nie zadziałał, wracam do MyMemory:", err);
    }
  }

  // MyMemory: sekwencyjnie, żeby nie wpaść w limit zapytań na IP.
  for (const { t, i } of todo) {
    try {
      const out = await translateWithMyMemory(t);
      translations[i] = out;
      cacheSet(`mymemory:${t}`, out);
    } catch (err) {
      console.error("Nie udało się przetłumaczyć fragmentu:", err);
      translations[i] = null;
    }
  }

  return NextResponse.json({ translations, provider: "mymemory" });
}
