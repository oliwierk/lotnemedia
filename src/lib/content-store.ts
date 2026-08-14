import fs from "fs";
import path from "path";
import { RowDataPacket } from "mysql2";
import { getPool, isDbConfigured } from "./db";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

export type Award = { year: string; title: string; org: string };
export type Content = { bioShort: string; bioFull: string; awards: Award[] };

function readJson(): Content {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function writeJson(data: Content) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

async function ensureRow() {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM site_content WHERE id = 1");
  if (rows.length === 0) {
    await pool.query("INSERT INTO site_content (id, bio_short, bio_full, awards) VALUES (1, '', '', '[]')");
  }
}

export async function getContent(): Promise<Content> {
  if (!isDbConfigured()) return readJson();

  const pool = getPool();
  await ensureRow();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT bio_short, bio_full, awards FROM site_content WHERE id = 1"
  );
  const row = rows[0];
  const awards = typeof row.awards === "string" ? JSON.parse(row.awards) : row.awards || [];
  return { bioShort: row.bio_short || "", bioFull: row.bio_full || "", awards };
}

export async function updateContent(patch: Partial<Content>): Promise<Content> {
  const current = await getContent();
  const updated: Content = { ...current, ...patch };

  if (!isDbConfigured()) {
    writeJson(updated);
    return updated;
  }

  const pool = getPool();
  await ensureRow();
  await pool.query("UPDATE site_content SET bio_short = ?, bio_full = ?, awards = ? WHERE id = 1", [
    updated.bioShort,
    updated.bioFull,
    JSON.stringify(updated.awards),
  ]);
  return updated;
}
