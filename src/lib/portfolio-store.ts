import fs from "fs";
import path from "path";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { getPool, isDbConfigured } from "./db";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");

export type PortfolioItem = {
  id: string;
  type: "video" | "photo";
  title: string;
  category: string;
  youtubeId?: string;
  bg: string;
  thumbnail?: string;
};

function readJson(): PortfolioItem[] {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function writeJson(data: PortfolioItem[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function rowToItem(row: RowDataPacket): PortfolioItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    category: row.category,
    youtubeId: row.youtube_id || "",
    bg: row.bg,
    thumbnail: row.thumbnail || "",
  };
}

export async function listItems(): Promise<PortfolioItem[]> {
  if (!isDbConfigured()) return readJson();
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM portfolio_items ORDER BY created_at ASC");
  return rows.map(rowToItem);
}

export async function createItem(data: Omit<PortfolioItem, "id">): Promise<PortfolioItem> {
  const id = `item_${Date.now()}`;
  const item: PortfolioItem = { ...data, id };

  if (!isDbConfigured()) {
    const items = readJson();
    items.push(item);
    writeJson(items);
    return item;
  }

  const pool = getPool();
  await pool.query(
    "INSERT INTO portfolio_items (id, type, title, category, youtube_id, bg, thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, data.type, data.title, data.category, data.youtubeId || null, data.bg, data.thumbnail || null]
  );
  return item;
}

export async function updateItem(id: string, data: Omit<PortfolioItem, "id">): Promise<PortfolioItem | null> {
  if (!isDbConfigured()) {
    const items = readJson();
    const idx = items.findIndex((it) => it.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, id };
    writeJson(items);
    return items[idx];
  }

  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE portfolio_items SET type=?, title=?, category=?, youtube_id=?, bg=?, thumbnail=? WHERE id=?",
    [data.type, data.title, data.category, data.youtubeId || null, data.bg, data.thumbnail || null, id]
  );
  if (result.affectedRows === 0) return null;
  return { ...data, id };
}

export async function deleteItem(id: string): Promise<boolean> {
  if (!isDbConfigured()) {
    const items = readJson();
    const filtered = items.filter((it) => it.id !== id);
    writeJson(filtered);
    return true;
  }

  const pool = getPool();
  await pool.query("DELETE FROM portfolio_items WHERE id=?", [id]);
  return true;
}
