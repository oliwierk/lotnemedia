import type { TextOverrides } from "@/i18n/text-fields";
import { BLOB_PATHS, dataPath, readJsonBlob, writeJsonBlob } from "./blob-store";

/**
 * Treść strony: bio, nagrody i teksty z panelu.
 *
 * Gdzie trafiają dane, zależy od środowiska:
 *  - Vercel (jest BLOB_READ_WRITE_TOKEN) → Vercel Blob, bo system plików jest tylko do odczytu,
 *  - lokalnie / własny serwer → plik `data/content.json`.
 *
 * Wybór dzieje się w blob-store.ts, tutaj korzystamy z jednego interfejsu.
 */

export type Award = { year: string; title: string; org: string };
export type Content = {
  bioShort: string;
  bioFull: string;
  awards: Award[];
  texts: TextOverrides;
};

const EMPTY: Content = { bioShort: "", bioFull: "", awards: [], texts: {} };

export async function readContent(): Promise<Content> {
  const data = await readJsonBlob<Partial<Content>>(
    BLOB_PATHS.content,
    dataPath("content.json"),
    EMPTY
  );
  return { ...EMPTY, ...data };
}

export type SaveResult = { content: Content; saved: boolean; error?: string };

export async function saveContent(patch: Partial<Content>): Promise<SaveResult> {
  const updated: Content = { ...(await readContent()), ...patch };
  try {
    await writeJsonBlob(BLOB_PATHS.content, dataPath("content.json"), updated);
    return { content: updated, saved: true };
  } catch (err) {
    console.error("Nie udało się zapisać treści:", err);
    return {
      content: updated,
      saved: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
