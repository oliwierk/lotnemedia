import { BLOB_PATHS, dataPath, readJsonBlob, writeJsonBlob } from "./blob-store";

/** Galeria realizacji — magazyn działa tak samo jak dla treści (patrz content-store.ts). */

export type PortfolioItem = {
  id: string;
  type: "video" | "photo";
  title: string;
  category: string;
  youtubeId?: string;
  bg: string;
  thumbnail?: string;
};

export async function readItems(): Promise<PortfolioItem[]> {
  const items = await readJsonBlob<PortfolioItem[]>(
    BLOB_PATHS.portfolio,
    dataPath("portfolio.json"),
    []
  );
  return Array.isArray(items) ? items : [];
}

async function save(items: PortfolioItem[]): Promise<void> {
  await writeJsonBlob(BLOB_PATHS.portfolio, dataPath("portfolio.json"), items);
}

export async function createItem(data: Omit<PortfolioItem, "id">): Promise<PortfolioItem> {
  const item: PortfolioItem = { ...data, id: `item_${Date.now()}` };
  await save([...(await readItems()), item]);
  return item;
}

export async function updateItem(
  id: string,
  data: Omit<PortfolioItem, "id">
): Promise<PortfolioItem | null> {
  const items = await readItems();
  const idx = items.findIndex((it) => it.id === id);
  if (idx === -1) return null;

  const item: PortfolioItem = { ...items[idx], ...data, id };
  items[idx] = item;
  await save(items);
  return item;
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await readItems();
  await save(items.filter((it) => it.id !== id));
  return true;
}
