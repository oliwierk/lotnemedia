/**
 * Awaryjna, statyczna wersja strony — do wgrania wprost do `public_html`.
 *
 * Po co: gdy hosting nie pozwala uruchomić procesu Node (limity CloudLinux/LVE),
 * strona i tak musi być widoczna dla klienta. Ta wersja to czyste pliki:
 * HTML + JS + CSS + zdjęcia, serwowane przez Apache/nginx bez żadnego backendu.
 *
 * Czego NIE ma w tej wersji: panelu admina i zapisu treści (wymagają serwera).
 * Treść jest zamrożona w takim stanie, w jakim była przy budowaniu.
 *
 * Uruchomienie: npm run build:static   (po `npm run deploy:build`)
 */
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const root = process.cwd();
const bundle = path.join(root, "out");
const target = path.join(root, "static-site");
const PORT = 3099;

if (!fs.existsSync(path.join(bundle, "server.js"))) {
  console.error("Brak katalogu out/ — uruchom najpierw `npm run deploy:build`.");
  process.exit(1);
}

/** Pobiera adres z lokalnie uruchomionego serwera. */
async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

async function waitForServer(url, timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error("Serwer nie wystartował na czas");
}

const server = spawn("node", ["server.js"], {
  cwd: bundle,
  env: { ...process.env, PORT: String(PORT), HOSTNAME: "127.0.0.1", NODE_ENV: "production" },
  stdio: "ignore",
});

try {
  const base = `http://127.0.0.1:${PORT}`;
  await waitForServer(base);

  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });

  // 1. Strona główna i panel. W obu wstrzykujemy znacznik trybu PHP —
  //    dzięki niemu komponenty kierują żądania do skryptów .php.
  const phpFlag = '<script>window.__API_PHP__=true</script>';
  const withFlag = (html) =>
    html.includes("__API_PHP__") ? html : html.replace("</head>", `${phpFlag}</head>`);

  fs.writeFileSync(path.join(target, "index.html"), withFlag(await fetchText(`${base}/`)));

  // Panel admina to komponent kliencki — działa jako zwykła strona statyczna,
  // a dane pobiera z backendu PHP. Katalog musi nazywać się tak samo jak trasa
  // w aplikacji (/admin), inaczej React zgłasza niezgodność przy hydratacji.
  fs.mkdirSync(path.join(target, "admin"), { recursive: true });
  fs.writeFileSync(
    path.join(target, "admin", "index.html"),
    withFlag(await fetchText(`${base}/admin`))
  );

  // 2. Dane, po które komponenty sięgają w przeglądarce (galeria, bio, nagrody).
  //    Zapisujemy je pod tymi samymi adresami, więc fetch() w przeglądarce zadziała.
  fs.mkdirSync(path.join(target, "api"), { recursive: true });
  for (const name of ["content", "portfolio"]) {
    fs.writeFileSync(path.join(target, "api", name), await fetchText(`${base}/api/${name}`));
  }

  // 3. Zasoby statyczne pod tymi samymi ścieżkami, których używa HTML.
  fs.mkdirSync(path.join(target, "_next"), { recursive: true });
  fs.cpSync(path.join(bundle, ".next", "static"), path.join(target, "_next", "static"), {
    recursive: true,
  });

  // 4. Zdjęcia, logo, favicon.
  for (const entry of fs.readdirSync(path.join(bundle, "public"))) {
    fs.cpSync(path.join(bundle, "public", entry), path.join(target, entry), { recursive: true });
  }

  // 5. Backend PHP — zastępuje trasy /api/* z wersji Node.
  for (const file of fs.readdirSync(path.join(root, "php", "api"))) {
    fs.copyFileSync(path.join(root, "php", "api", file), path.join(target, "api", file));
  }
  // Katalog na zdjęcia wgrywane z panelu.
  fs.mkdirSync(path.join(target, "uploads"), { recursive: true });

  // Dane i konfiguracja nie mogą być czytane wprost z przeglądarki — wszystko
  // idzie przez skrypty PHP. Dyrektywy osłonięte <IfModule>, bo nieobsługiwana
  // dyrektywa w .htaccess kończy się błędem 500 dla całego katalogu.
  fs.writeFileSync(
    path.join(target, "api", ".htaccess"),
    `# Ukrywamy konfigurację z hasłem i bibliotekę pomocniczą.
# Pliki "content" i "portfolio" MUSZĄ pozostać czytelne — strona wczytuje z nich
# treść bezpośrednio, dzięki czemu działa nawet gdy PHP na serwerze nie odpowiada.
<IfModule mod_authz_core.c>
  <FilesMatch "^(config\\.php|config\\.example\\.php|_lib\\.php|.*\\.(tmp|bak))$">
    Require all denied
  </FilesMatch>
</IfModule>
<IfModule !mod_authz_core.c>
  <FilesMatch "^(config\\.php|config\\.example\\.php|_lib\\.php|.*\\.(tmp|bak))$">
    Order allow,deny
    Deny from all
  </FilesMatch>
</IfModule>
`
  );

  // 6. Favicon — HTML wskazuje na /favicon.ico z parametrem, statyczny serwer
  //    zignoruje parametr, więc wystarczy plik pod tą nazwą.
  const favicon = path.join(root, "src", "app", "favicon.ico");
  if (fs.existsSync(favicon)) fs.copyFileSync(favicon, path.join(target, "favicon.ico"));

  // 7. Apache: pliki w katalogu api/ nie mają rozszerzenia — podajemy typ wprost,
  //    a przy okazji włączamy kompresję i cache dla zasobów Next.
  fs.writeFileSync(
    path.join(target, ".htaccess"),
    `# Statyczna wersja strony Lotne Media.
# Panel i zapis treści obsługują skrypty PHP w katalogu api/.
# Wracając do aplikacji Node, usuń ten plik i przywróć konfigurację z panelu.

# Odcina Passengera od tego katalogu. Bez tego zarejestrowana (nawet niedziałająca)
# aplikacja Node przechwytuje żądania do plików .php i zwraca 503.
<IfModule mod_passenger.c>
  PassengerEnabled off
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>
`
  );

  function countFiles(dir) {
    let n = 0;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      n += e.isDirectory() ? countFiles(path.join(dir, e.name)) : 1;
    }
    return n;
  }

  console.log(`\n✓ Statyczna wersja gotowa: static-site/  (${countFiles(target)} plików)`);
  console.log("  Wgraj CAŁĄ zawartość tego katalogu do public_html.");
  console.log("  Panel: twojadomena.pl/admin  (backend w PHP, bez procesu Node)");
  console.log("  Pamiętaj: skopiuj api/config.example.php jako api/config.php i ustaw hasło.");
} finally {
  server.kill();
}
