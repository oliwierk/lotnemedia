import fs from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

/**
 * Magazyn treści dla wdrożenia na Vercelu.
 *
 * Na Vercelu system plików jest tylko do odczytu, więc treści nie da się trzymać
 * w `data/*.json`. Zamiast tego zapisujemy ją w Vercel Blob, a lokalnie (gdzie
 * nie ma tokenu) nadal używamy plików — dzięki temu `npm run dev` działa jak dotąd.
 *
 * Odczyt idzie przez `get()`, czyli wprost z magazynu, z pominięciem cache CDN —
 * inaczej zmiana z panelu bywałaby widoczna dopiero po kilkudziesięciu minutach.
 */

export function isBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/** Ścieżki w magazynie. Stałe, bez losowego sufiksu — zawsze nadpisujemy ten sam plik. */
export const BLOB_PATHS = {
  content: "data/content.json",
  portfolio: "data/portfolio.json",
} as const;

/**
 * Krótki cache w pamięci procesu. Strona renderuje się przy każdym żądaniu,
 * więc bez tego każde wejście na stronę pytałoby magazyn o treść.
 */
const CACHE_MS = 10_000;
const cache = new Map<string, { value: unknown; at: number }>();

export function invalidateBlobCache(pathname?: string) {
  if (pathname) cache.delete(pathname);
  else cache.clear();
}

/** Odczyt pliku JSON z Blob (albo z dysku, gdy nie ma tokenu). */
export async function readJsonBlob<T>(pathname: string, localPath: string, fallback: T): Promise<T> {
  if (!isBlobConfigured()) return readLocal(localPath, fallback);

  const cached = cache.get(pathname);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value as T;

  try {
    const result = await get(pathname, { access: "public", useCache: false });
    if (!result || !result.stream) {
      // Pierwszy start — w magazynie nic jeszcze nie ma, bierzemy treść z paczki.
      return readLocal(localPath, fallback);
    }
    const text = await new Response(result.stream).text();
    const value = JSON.parse(text) as T;
    cache.set(pathname, { value, at: Date.now() });
    return value;
  } catch (err) {
    console.error(`Nie udało się odczytać ${pathname} z magazynu:`, err);
    return readLocal(localPath, fallback);
  }
}

/** Zapis pliku JSON do Blob (albo na dysk, gdy nie ma tokenu). */
export async function writeJsonBlob<T>(pathname: string, localPath: string, data: T): Promise<void> {
  if (!isBlobConfigured()) {
    writeLocal(localPath, data);
    return;
  }

  await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    // Minimalna dozwolona wartość; i tak czytamy z pominięciem cache.
    cacheControlMaxAge: 60,
  });
  cache.set(pathname, { value: data, at: Date.now() });
}

/* ─── tryb lokalny (bez tokenu) ─── */

function readLocal<T>(localPath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(localPath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(localPath: string, data: T): void {
  const tmp = `${localPath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, localPath);
}

export function dataPath(file: string): string {
  return path.join(process.cwd(), "data", file);
}
