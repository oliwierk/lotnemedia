import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Brak zmiennych w .env.local: ${missing.join(", ")}`);
  console.error("Uzupełnij DB_HOST / DB_USER / DB_PASSWORD / DB_NAME danymi z bazy MySQL na Hostline i spróbuj ponownie.");
  process.exit(1);
}

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const schema = fs.readFileSync(path.join(process.cwd(), "sql", "schema.sql"), "utf-8");
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await pool.query(stmt);
  }
  console.log("✓ Schemat utworzony (portfolio_items, site_content).");

  // CREATE TABLE IF NOT EXISTS nie dołoży kolumny do istniejącej tabeli — robimy to osobno.
  const [textsCol] = await pool.query(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'site_content' AND COLUMN_NAME = 'texts'"
  );
  if (textsCol.length === 0) {
    await pool.query("ALTER TABLE site_content ADD COLUMN texts JSON");
    console.log("✓ Dodano kolumnę site_content.texts (teksty z panelu).");
  }

  const content = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "content.json"), "utf-8"));
  const [existingContent] = await pool.query("SELECT id FROM site_content WHERE id = 1");
  if (existingContent.length === 0) {
    await pool.query(
      "INSERT INTO site_content (id, bio_short, bio_full, awards, texts) VALUES (1, ?, ?, ?, ?)",
      [
        content.bioShort || "",
        content.bioFull || "",
        JSON.stringify(content.awards || []),
        JSON.stringify(content.texts || {}),
      ]
    );
    console.log("✓ Zaimportowano treść (bio, nagrody).");
  } else {
    console.log("… site_content już istnieje — pomijam import.");
  }

  const items = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "portfolio.json"), "utf-8"));
  const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM portfolio_items");
  if (count === 0) {
    for (const item of items) {
      await pool.query(
        "INSERT INTO portfolio_items (id, type, title, category, youtube_id, bg, thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [item.id, item.type, item.title, item.category, item.youtubeId || null, item.bg, item.thumbnail || null]
      );
    }
    console.log(`✓ Zaimportowano ${items.length} pozycji portfolio.`);
  } else {
    console.log("… portfolio_items już zawiera dane — pomijam import.");
  }

  await pool.end();
  console.log("Gotowe. Ustaw DB_HOST i resztę zmiennych DB_* w środowisku produkcyjnym, żeby panel zaczął używać bazy.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
