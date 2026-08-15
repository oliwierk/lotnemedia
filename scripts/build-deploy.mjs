/**
 * Składa gotową do wgrania paczkę w katalogu `out/`.
 *
 * Uruchamiane przez `npm run deploy:build` (najpierw `next build`).
 * Next zapisuje samodzielny serwer w `.next/standalone`, ale celowo NIE kopiuje tam
 * `public/` ani `.next/static` — robimy to tutaj, razem z danymi i skryptem migracji.
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");
const out = path.join(root, "out");

if (!fs.existsSync(standalone)) {
  console.error("Brak .next/standalone — uruchom najpierw `npm run build`.");
  process.exit(1);
}

// Czysty start, żeby nie zostały pliki z poprzedniej wersji.
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(standalone, out, { recursive: true });

// Pliki statyczne (JS/CSS/fonty) i zasoby z public/ — bez nich strona się nie ostyluje.
fs.cpSync(path.join(root, ".next", "static"), path.join(out, ".next", "static"), { recursive: true });
fs.cpSync(path.join(root, "public"), path.join(out, "public"), { recursive: true });

// Dane działają jako magazyn zapasowy, gdy nie ma skonfigurowanej bazy.
fs.cpSync(path.join(root, "data"), path.join(out, "data"), { recursive: true });

// Schemat i migracja — potrzebne przy pierwszym podpięciu MySQL.
fs.cpSync(path.join(root, "sql"), path.join(out, "sql"), { recursive: true });
fs.mkdirSync(path.join(out, "scripts"), { recursive: true });
fs.cpSync(path.join(root, "scripts", "migrate-to-db.mjs"), path.join(out, "scripts", "migrate-to-db.mjs"));

// Katalog na zdjęcia wgrywane z panelu.
fs.mkdirSync(path.join(out, "public", "uploads"), { recursive: true });

// Wzór konfiguracji — na serwerze uzupełnia się go jako .env.local (albo zmienne środowiskowe).
fs.copyFileSync(path.join(root, ".env.example"), path.join(out, ".env.example"));

// Next kopiuje do standalone pełny package.json projektu — razem z playwright,
// typescriptem i eslintem. Panele hostingów (DirectAdmin/cPanel) mają przycisk
// „Run NPM install", który próbowałby to wszystko ściągnąć, choć zależności są już
// w paczce. Zostawiamy więc minimalny plik, żeby to kliknięcie było nieszkodliwe.
// Bez pola "type" — server.js jest w CommonJS.
// Zostawiamy same zależności produkcyjne — bez playwrighta, typescripta, eslinta
// i pakietów @types. Dzięki temu „Run NPM install" jest działającym planem B, gdyby
// panel hostingu podmienił node_modules na własne dowiązanie, a nie ściąga 300 MB
// narzędzi deweloperskich.
const RUNTIME_DEPS = ["gsap", "mysql2", "next", "qrcode", "react", "react-dom"];
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf-8"));
const dependencies = Object.fromEntries(
  RUNTIME_DEPS.map((name) => {
    const version = pkg.dependencies[name];
    if (!version) throw new Error(`Brak zależności ${name} w package.json`);
    return [name, version];
  })
);
fs.writeFileSync(
  path.join(out, "package.json"),
  JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      private: true,
      scripts: {
        start: "node server.js",
        "db:migrate": "node scripts/migrate-to-db.mjs",
      },
      dependencies,
    },
    null,
    2
  ) + "\n"
);

// Plik startowy dla hostingów z Passengerem (Hostline, cPanel, DirectAdmin).
// server.js binduje się do process.env.HOSTNAME, a na hostingu współdzielonym
// ta zmienna zawiera nazwę maszyny (np. "s12.hostline.pl") zamiast adresu IP —
// aplikacja wtedy nie wstaje. Tu wymuszamy adres pętli zwrotnej.
fs.writeFileSync(
  path.join(out, "app.js"),
  `/**
 * Plik startowy dla hostingu współdzielonego (Passenger / Node.js Selector).
 * W panelu ustaw "Application startup file" na: app.js
 *
 * Na VPS-ie możesz uruchamiać bezpośrednio server.js — wtedy aplikacja słucha
 * na 0.0.0.0. Tutaj wymuszamy 127.0.0.1, bo przed aplikacją stoi serwer WWW,
 * a HOSTNAME na hostingu współdzielonym bywa nazwą maszyny, nie adresem IP.
 */
if (!/^[\\d.]+$/.test(process.env.HOSTNAME || "")) {
  process.env.HOSTNAME = "127.0.0.1";
}

require("./server.js");
`
);

// mysql2 bywa pomijany przy śledzeniu zależności, bo trafia tam przez zmienne ścieżki.
const mysqlSrc = path.join(root, "node_modules", "mysql2");
const mysqlDst = path.join(out, "node_modules", "mysql2");
if (fs.existsSync(mysqlSrc) && !fs.existsSync(mysqlDst)) {
  fs.cpSync(mysqlSrc, mysqlDst, { recursive: true });
  console.log("• dołożono mysql2 do node_modules");
}

// Gotowy import do phpMyAdmin — plan B, gdy nie ma dostępu do SSH.
// Zawiera schemat i aktualną treść z data/*.json.
function sqlString(value) {
  if (value === null || value === undefined) return "NULL";
  const escaped = String(value)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "''")
    .replace(/\0/g, "");
  return `'${escaped}'`;
}

const content = JSON.parse(fs.readFileSync(path.join(root, "data", "content.json"), "utf-8"));
const items = JSON.parse(fs.readFileSync(path.join(root, "data", "portfolio.json"), "utf-8"));
const schema = fs.readFileSync(path.join(root, "sql", "schema.sql"), "utf-8");

const seed = [
  "-- Lotne Media — schemat + treść startowa.",
  "-- Import w phpMyAdmin: wybierz swoją bazę → zakładka Import → wskaż ten plik.",
  "-- Alternatywa dla `node scripts/migrate-to-db.mjs` (gdy nie masz dostępu do SSH).",
  "",
  "SET NAMES utf8mb4;",
  "",
  schema.trim(),
  "",
  "-- Treść: bio, nagrody, teksty z panelu",
  `INSERT INTO site_content (id, bio_short, bio_full, awards, texts) VALUES (1, ${sqlString(
    content.bioShort || ""
  )}, ${sqlString(content.bioFull || "")}, ${sqlString(
    JSON.stringify(content.awards || [])
  )}, ${sqlString(JSON.stringify(content.texts || {}))})`,
  "  ON DUPLICATE KEY UPDATE id = id;",
  "",
  "-- Galeria realizacji",
  ...items.map(
    (it) =>
      `INSERT INTO portfolio_items (id, type, title, category, youtube_id, bg, thumbnail) VALUES (${sqlString(
        it.id
      )}, ${sqlString(it.type)}, ${sqlString(it.title)}, ${sqlString(it.category)}, ${sqlString(
        it.youtubeId || null
      )}, ${sqlString(it.bg)}, ${sqlString(it.thumbnail || null)}) ON DUPLICATE KEY UPDATE id = id;`
  ),
  "",
].join("\n");

fs.writeFileSync(path.join(out, "sql", "seed.sql"), seed);
console.log(`• zapisano sql/seed.sql (${items.length} pozycji galerii, ${(content.awards || []).length} nagród)`);

// Znacznik wersji — pozwala sprawdzić przez /api/health, co naprawdę działa na serwerze.
fs.writeFileSync(
  path.join(out, "build-info.json"),
  JSON.stringify({ builtAt: new Date().toISOString() }, null, 2) + "\n"
);

// Śmieci macOS — niepotrzebnie lądują na serwerze.
let junk = 0;
for (const entry of fs.readdirSync(out, { recursive: true })) {
  if (path.basename(entry) === ".DS_Store") {
    fs.rmSync(path.join(out, entry), { force: true });
    junk++;
  }
}
if (junk) console.log(`• usunięto ${junk} plików .DS_Store`);

function dirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    total += entry.isDirectory() ? dirSize(full) : fs.statSync(full).size;
  }
  return total;
}

console.log(`\n✓ Paczka gotowa: out/  (${(dirSize(out) / 1024 / 1024).toFixed(1)} MB)`);
console.log("  Uruchomienie na serwerze:  cd out && node server.js");
console.log("  Port ustawia zmienna PORT (domyślnie 3000).");
