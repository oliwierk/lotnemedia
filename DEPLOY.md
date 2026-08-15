# Wdrożenie na hosting + baza danych

Kompletna instrukcja: od zbudowania paczki, przez uruchomienie na serwerze, po podpięcie MySQL.

---

## 0. Najpierw najważniejsze: to nie jest statyczna strona

Strony **nie da się** wgrać jako zwykłe pliki HTML (klasyczny hosting „FTP + PHP"). Panel admina, zapis tekstów, galeria, wgrywanie zdjęć i tłumaczenia działają przez `/api/*`, a treść jest doczytywana przy każdym żądaniu — to wymaga **działającego procesu Node.js**.

Dlatego paczka `out/` zawiera nie statyczny eksport, tylko samodzielny serwer (`server.js`) razem z potrzebnymi zależnościami.

**Czego potrzebujesz od hostingu:**

| Wymaganie | Szczegóły |
| --- | --- |
| Node.js | wersja **20.9 lub nowsza** (wymóg Next.js 16) |
| Uruchamianie procesu | możliwość trzymania działającej aplikacji Node (panel „Node.js app", SSH, VPS) |
| MySQL | opcjonalnie, ale zalecane — patrz sekcja 6 |
| HTTPS | wymagane, patrz sekcja 8 |

Jeśli hosting oferuje wyłącznie PHP i pliki statyczne — nie uruchomi tej strony. Realne opcje: hosting z obsługą Node.js, VPS, albo platforma typu Vercel (uwagi w sekcji 9).

---

## 1. Hostline — instrukcja krok po kroku

Hostline obsługuje Node.js, ma panel DirectAdmin, MySQL i dostęp SSH we wszystkich pakietach. Poniżej całe wdrożenie, krok po kroku.

### Co trafia do katalogu głównego aplikacji

Najważniejsza rzecz na start: **wgrywasz zawartość katalogu `out/`, a nie sam katalog `out/`**.

Docelowo ma być tak:

```
/home/TWOJE_KONTO/lotnemedia/app.js          ✅ dobrze
/home/TWOJE_KONTO/lotnemedia/out/app.js      ❌ źle — o jeden poziom za głęboko
```

Pełny wykaz — co ma leżeć w katalogu głównym aplikacji:

| Element | Co to jest | Wymagane |
| --- | --- | --- |
| `app.js` | plik startowy — to wskazujesz w panelu | **tak** |
| `server.js` | właściwy serwer aplikacji, uruchamiany przez `app.js` | **tak** |
| `package.json` | metadane aplikacji | **tak** |
| `.next/` | zbudowana aplikacja: kod stron, JS, CSS, fonty | **tak** ⚠️ katalog ukryty |
| `node_modules/` | biblioteki (już przygotowane, 35 MB) | **tak** |
| `public/` | zdjęcia, logo, favicon, `uploads/` | **tak** |
| `data/` | treść strony, gdy nie używasz bazy | **tak** |
| `sql/` | schemat tabel MySQL | tylko do migracji |
| `scripts/` | skrypt migracji do bazy | tylko do migracji |
| `.env.local` | **tworzysz sam** — hasła i konfiguracja | **tak** |
| `.env.example` | wzór do skopiowania | nie |
| `.DS_Store` | śmieć tworzony przez macOS | nie, można pominąć |

> ⚠️ **`.next` i `.env.local` zaczynają się od kropki — to pliki ukryte.** Większość programów FTP domyślnie ich nie pokazuje i **nie wgra**. W FileZilli włącz: menu **Serwer → Wymuś wyświetlanie ukrytych plików**. Brak katalogu `.next` to najczęstsza przyczyna białej strony albo błędu 503 po wdrożeniu.

Katalog `public_html` Twojej domeny zostaw **pusty**. Aplikacja Node serwuje wszystko sama, a panel sam wstawi tam potrzebny plik `.htaccess`. Jeśli jest tam stara strona (np. WordPress) — przenieś ją albo usuń, bo będzie przechwytywać ruch.

---

### Krok 1 · Zbuduj paczkę na swoim komputerze

```bash
npm install
npm run deploy:build
```

Na końcu zobaczysz `✓ Paczka gotowa: out/`. Katalog `out/` to ok. 57 MB i 1382 pliki.

### Krok 2 · Utwórz aplikację w DirectAdmin

Zaloguj się do DirectAdmin → kliknij ikonę **Setup Node.js App** → **Create application**.

| Pole w formularzu | Co wpisać |
| --- | --- |
| **Node.js version** | **20** lub nowsza. Jeśli najwyższa dostępna to 18 — przerwij i napisz do Hostline, Next.js 16 wymaga 20.9+ |
| **Application mode** | `Production` |
| **Application root** | `lotnemedia` — sam katalog, bez `public_html`. Panel utworzy `/home/TWOJE_KONTO/lotnemedia` |
| **Application URL** | Twoja domena, np. `lotnemedia.pl` |
| **Application startup file** | `app.js` |

Kliknij **Create**. Panel utworzy katalog i przygotuje środowisko.

> **Dlaczego `app.js`, a nie `server.js`?** Na hostingu współdzielonym zmienna `HOSTNAME` zawiera nazwę maszyny (np. `s12.hostline.pl`). `server.js` próbuje potraktować ją jak adres IP i kończy błędem `getaddrinfo ENOTFOUND` — aplikacja w ogóle nie wstaje. `app.js` wymusza `127.0.0.1` i dopiero potem uruchamia serwer.

### Krok 3 · Wgraj pliki

Połącz się z serwerem przez FTP/SFTP (FileZilla, WinSCP) albo użyj **File Manager** w DirectAdmin.

1. Wejdź do katalogu `/home/TWOJE_KONTO/lotnemedia`
2. **Włącz pokazywanie plików ukrytych** (patrz ostrzeżenie wyżej)
3. Zaznacz **całą zawartość** katalogu `out/` — łącznie z `.next` — i wgraj

Wgrywanie potrwa kilkanaście minut (1382 pliki). Po zakończeniu sprawdź, czy w katalogu widać `app.js`, `server.js`, `.next`, `node_modules`, `public`, `data`.

Szybka weryfikacja przez SSH:

```bash
ls -a ~/lotnemedia
```

### Krok 4 · Utwórz plik `.env.local`

W tym samym katalogu (obok `app.js`) utwórz plik `.env.local`:

```env
ADMIN_USERNAME=ilonaptak
ADMIN_PASSWORD=tu-wpisz-dlugie-losowe-haslo

DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=
```

Pola `DB_*` zostaw na razie puste — wypełnisz je w kroku 7. Aplikacja czyta ten plik przy każdym starcie.

Jeśli panel Node.js ma własną sekcję na zmienne środowiskowe, możesz wpisać je tam zamiast do pliku — efekt jest ten sam.

### Krok 5 · Uruchom

W panelu **Setup Node.js App** kliknij **Restart** przy swojej aplikacji.

**Nie klikaj „Run NPM install”** — biblioteki są już w paczce, a instalacja zajęłaby miejsce niepotrzebnie. Ten przycisk to plan awaryjny: użyj go tylko, jeśli w logach zobaczysz `Cannot find module`.

### Krok 6 · Sprawdź, czy działa

1. Wejdź na swoją domenę — powinna otworzyć się strona główna z animacjami
2. Wejdź na `twojadomena.pl/admin` — powinien pojawić się ekran logowania
3. Zaloguj się danymi z `.env.local`

Jeśli coś nie działa, zajrzyj do logów: w panelu Node.js jest podgląd, albo przez SSH w katalogu aplikacji.

### Krok 7 · Podepnij bazę MySQL

**7a. Utwórz bazę.** DirectAdmin → **MySQL Management** → **Create new database**. Podaj nazwę bazy i użytkownika, wygeneruj hasło.

> Hostline dopisuje przed nazwą prefiks Twojego konta. Jeśli wpiszesz `lotnemedia`, realna nazwa to np. `konto_lotnemedia` — i **taką pełną nazwę** wpisujesz niżej. To samo dotyczy użytkownika.

**7b. Uzupełnij `.env.local`:**

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=konto_lotnemedia
DB_PASSWORD=haslo_z_panelu
DB_NAME=konto_lotnemedia
```

**7c. Uruchom migrację przez SSH.** W panelu Node.js jest gotowa komenda aktywująca środowisko aplikacji — skopiuj ją i wklej w konsoli SSH, a potem:

```bash
cd ~/lotnemedia
node scripts/migrate-to-db.mjs
```

Powinieneś zobaczyć:

```
✓ Schemat utworzony (portfolio_items, site_content).
✓ Zaimportowano treść (bio, nagrody).
✓ Zaimportowano N pozycji portfolio.
Gotowe.
```

**7d. Restart** aplikacji w panelu.

> **Nie pomijaj migracji.** Samo utworzenie pustej bazy sprawi, że lista nagród na stronie będzie pusta — to migracja przenosi bio i 15 nagród z plików JSON do bazy.

**7e. Sprawdź.** Zmień dowolny tekst w `/admin`, zapisz, a potem w phpMyAdmin zajrzyj do tabeli `site_content`, kolumna `texts`. Jeśli widać tam Twoją zmianę — baza działa.

### Krok 8 · Włącz HTTPS

DirectAdmin → **SSL Certificates** → wybierz **Let's Encrypt** → zaznacz domenę z `www` i bez → zapisz. Następnie włącz przekierowanie z `http` na `https`.

To nie jest opcjonalne: panel admina wysyła hasło w nagłówku żądania, więc bez szyfrowania da się je przechwycić.

---

### Gdy coś nie zadziała

| Objaw | Co sprawdzić |
| --- | --- |
| Biała strona / błąd 503 | Czy wgrał się ukryty katalog `.next`? To najczęstsza przyczyna. |
| `getaddrinfo ENOTFOUND` w logach | W polu „Application startup file” jest `server.js` zamiast `app.js`. |
| `Cannot find module 'next'` | Niekompletny `node_modules`. Wtedy — i tylko wtedy — kliknij „Run NPM install”. |
| Strona bez stylów | Brakuje części `.next/static` albo katalogu `public`. Wgraj je ponownie. |
| Widać starą stronę / listing plików | W `public_html` została poprzednia zawartość. Opróżnij katalog. |
| Panel nie przyjmuje hasła | Brak `.env.local` albo aplikacja nie została zrestartowana po jego utworzeniu. |
| Błąd połączenia z bazą | Sprawdź, czy nazwa bazy i użytkownika zawierają prefiks konta. |

## 2. Zbudowanie paczki

Na swoim komputerze, w katalogu projektu:

```bash
npm install
npm run deploy:build
```

Powstaje katalog **`out/`** (ok. 57 MB, 1382 pliki) — to jest cała paczka do wgrania:

```
out/
├── app.js             # plik startowy dla hostingu współdzielonego (Passenger)
├── server.js          # serwer aplikacji — na VPS uruchamiasz ten plik
├── .next/             # zbudowana aplikacja + pliki statyczne (JS, CSS)
├── public/            # zdjęcia, logo, fonty
│   └── uploads/       # zdjęcia wgrywane z panelu admina
├── data/              # zapasowy magazyn treści (gdy nie ma bazy)
├── sql/schema.sql     # struktura tabel MySQL
├── scripts/           # skrypt migracji do bazy
├── node_modules/      # tylko potrzebne zależności
└── .env.example       # wzór konfiguracji
```

Paczkę buduj ponownie **tylko po zmianach w kodzie**. Zmiany tekstów, galerii czy nagród robisz w panelu i działają od razu, bez przebudowy.

---

## 3. Konfiguracja (zmienne środowiskowe)

W katalogu `out/` utwórz plik **`.env.local`**:

```env
# Logowanie do panelu /admin
ADMIN_USERNAME=ilonaptak
ADMIN_PASSWORD=tu-wpisz-dlugie-losowe-haslo

# Baza MySQL — zostaw puste, jeśli na razie bez bazy
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=

# Tłumaczenie PL→EN (opcjonalne, bez tego działa darmowe MyMemory)
MYMEMORY_EMAIL=
DEEPL_API_KEY=
```

Jeśli hosting ma własne pole na zmienne środowiskowe w panelu — użyj go zamiast pliku. Skutek jest ten sam.

> `.env.local` zawiera hasło do panelu i do bazy. Nie wrzucaj go do gita i ustaw uprawnienia `chmod 600 .env.local`.

---

## 4. Wgranie i uruchomienie

Wgraj całą zawartość `out/` na serwer (FTP/SFTP, `scp`, `rsync`) i uruchom:

```bash
cd /ścieżka/do/aplikacji
node server.js       # VPS — nasłuch na 0.0.0.0
node app.js          # hosting współdzielony / Passenger — nasłuch na 127.0.0.1
```

Serwer domyślnie słucha na porcie 3000. Zmiana portu:

```bash
PORT=8080 node server.js
```

Szybki test — powinno zwrócić `200`:

```bash
curl -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

---

## 5. Utrzymanie procesu przy życiu

Uruchomienie z konsoli kończy się przy zamknięciu sesji SSH. Wybierz jedno:

### A. Panel hostingu („Node.js app" / Passenger)

Najprostsze na hostingu współdzielonym. W panelu wskazujesz:

- **katalog aplikacji** → miejsce, gdzie wgrałeś `out/` (poza `public_html`)
- **plik startowy** → `app.js` — patrz wyjaśnienie w sekcji 1.2
- **wersja Node** → 20 lub nowsza
- **zmienne środowiskowe** → jak w sekcji 3

### B. PM2 (VPS)

```bash
npm install -g pm2
cd /ścieżka/do/aplikacji
pm2 start server.js --name lotnemedia
pm2 save
pm2 startup          # wykonaj komendę, którą wypisze — autostart po restarcie serwera
```

Przydatne: `pm2 logs lotnemedia`, `pm2 restart lotnemedia`, `pm2 status`.

### C. systemd (VPS)

`/etc/systemd/system/lotnemedia.service`:

```ini
[Unit]
Description=Lotne Media
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/lotnemedia
ExecStart=/usr/bin/node server.js
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/var/www/lotnemedia/.env.local
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now lotnemedia
sudo systemctl status lotnemedia
```

---

## 6. Podpięcie bazy danych MySQL

### Bez bazy też działa

Bez `DB_HOST` aplikacja trzyma treść w plikach `data/content.json` i `data/portfolio.json`. Działa poprawnie, ale:

- pliki muszą być **zapisywalne** przez proces Node,
- przy wgrywaniu nowej wersji łatwo je nadpisać i stracić zmiany z panelu,
- nie zadziała na platformach z systemem plików tylko do odczytu (Vercel, serverless).

Baza rozwiązuje wszystkie trzy problemy — dlatego zalecana.

### Krok 1 — utwórz bazę

W panelu hostingu (phpMyAdmin, DirectAdmin, cPanel) załóż bazę i użytkownika. Zapisz: host, port, nazwę bazy, użytkownika, hasło.

Ważne: kodowanie **utf8mb4** (polskie znaki). Zwykle domyślne.

### Krok 2 — uzupełnij `.env.local`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=nazwa_uzytkownika
DB_PASSWORD=haslo_do_bazy
DB_NAME=nazwa_bazy
```

> `DB_HOST=localhost` gdy baza stoi na tym samym serwerze. Hosting może podać inny adres (np. `mysql.twojhosting.pl`) — użyj tego, co widnieje w panelu.

### Krok 3 — utwórz tabele i przenieś dane

W katalogu aplikacji:

```bash
node scripts/migrate-to-db.mjs
```

Skrypt:

1. tworzy tabele `portfolio_items` i `site_content` (z `sql/schema.sql`),
2. dokłada kolumnę `site_content.texts`, jeśli baza powstała wcześniej,
3. przenosi treść z `data/*.json` do bazy.

Jest **bezpieczny do wielokrotnego uruchomienia** — nie nadpisze danych, które już są w bazie (wypisze wtedy „już istnieje — pomijam import").

Oczekiwany wynik:

```
✓ Schemat utworzony (portfolio_items, site_content).
✓ Zaimportowano treść (bio, nagrody).
✓ Zaimportowano N pozycji portfolio.
Gotowe.
```

### Krok 4 — restart i sprawdzenie

```bash
pm2 restart lotnemedia      # albo: sudo systemctl restart lotnemedia
```

Sprawdź, że aplikacja czyta z bazy:

```bash
curl -s http://localhost:3000/api/content | head -c 200
```

Następnie zmień dowolny tekst w `/admin` i sprawdź w phpMyAdmin, czy kolumna `site_content.texts` się zaktualizowała. Jeśli tak — baza jest podpięta.

### Struktura tabel

```sql
portfolio_items          -- galeria realizacji
  id, type, title, category, youtube_id, bg, thumbnail, created_at

site_content             -- jeden wiersz (id = 1)
  bio_short, bio_full    -- zakładka „Bio"
  awards      JSON       -- zakładka „Nagrody"
  texts       JSON       -- zakładka „Teksty" (tylko pola zmienione wobec kodu)
```

Przełączenie jest automatyczne: **jest `DB_HOST` → aplikacja używa bazy; nie ma → używa plików JSON.** W kodzie nic nie zmieniasz.

---

## 7. Aktualizacja strony (nowa wersja kodu)

⚠️ **Najczęstszy błąd przy wdrożeniach: nadpisanie danych.** Katalogi `public/uploads/` (zdjęcia z panelu) i `data/` (treść, gdy nie używasz bazy) powstają na serwerze i **nie ma ich w nowej paczce**.

Bezpieczna kolejność:

```bash
# 1. kopia zapasowa tego, co powstało na serwerze
cp -r /var/www/lotnemedia/public/uploads ~/backup-uploads
cp -r /var/www/lotnemedia/data ~/backup-data
cp /var/www/lotnemedia/.env.local ~/backup-env

# 2. wgraj nową paczkę out/

# 3. przywróć dane
cp -r ~/backup-uploads/. /var/www/lotnemedia/public/uploads/
cp ~/backup-env /var/www/lotnemedia/.env.local
#    data/ przywracaj tylko jeśli NIE używasz bazy

# 4. restart
pm2 restart lotnemedia
```

Przy `rsync` wystarczy wykluczyć te katalogi:

```bash
rsync -av --delete \
  --exclude 'public/uploads' --exclude 'data' --exclude '.env.local' \
  out/ user@serwer:/var/www/lotnemedia/
```

Korzystanie z bazy MySQL usuwa połowę tego problemu — treść jest wtedy poza plikami aplikacji.

---

## 8. Domena, HTTPS i reverse proxy

Aplikacja słucha na porcie lokalnym; ruch z internetu kieruje na nią serwer WWW.

**nginx:**

```nginx
server {
    listen 80;
    server_name lotnemedia.pl www.lotnemedia.pl;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # zdjęcia z panelu mogą być spore
    client_max_body_size 20M;
}
```

Certyfikat HTTPS (darmowy Let's Encrypt):

```bash
sudo certbot --nginx -d lotnemedia.pl -d www.lotnemedia.pl
```

> **HTTPS jest obowiązkowe.** Panel wysyła hasło administratora w nagłówku żądania — bez szyfrowania można je przechwycić w sieci.

---

## 9. Uwaga o Vercel i hostingach serverless

Vercel uruchomi tę stronę (darmowy plan, wdrożenie prosto z gita), ale z dwoma zastrzeżeniami wynikającymi z systemu plików tylko do odczytu:

- **baza MySQL jest obowiązkowa** — zapis do `data/*.json` się nie powiedzie (potrzebna baza dostępna z internetu, np. PlanetScale, Aiven, railway; baza na hostingu współdzielonym zwykle nie przyjmie połączenia z zewnątrz),
- **wgrywanie zdjęć nie zadziała** — `public/uploads` nie jest trwałe; wymagałoby przepięcia na zewnętrzny magazyn (Vercel Blob, S3, Cloudinary), czyli zmiany w `src/app/api/upload/route.ts`.

Na własnym serwerze/VPS obie rzeczy działają bez zmian w kodzie.

---

## 10. Bezpieczeństwo — lista kontrolna

- [ ] `ADMIN_PASSWORD` długie i losowe (nie „admin123")
- [ ] HTTPS włączone i wymuszone (przekierowanie z http)
- [ ] `.env.local` z uprawnieniami `600`, poza repozytorium
- [ ] użytkownik MySQL ma dostęp **tylko** do tej jednej bazy
- [ ] regularna kopia bazy: `mysqldump -u user -p nazwa_bazy > kopia.sql`
- [ ] kopia katalogu `public/uploads`

---

## 11. Typowe problemy

| Objaw | Przyczyna i rozwiązanie |
| --- | --- |
| Strona bez stylów, „goły" tekst | Brak `.next/static` lub `public/`. Wgraj całą zawartość `out/`, nic nie pomijając. |
| `Error: Cannot find module 'next'` | Nie wgrano `out/node_modules/`. Wgraj kompletny katalog. |
| Panel nie przyjmuje hasła | Brak `ADMIN_USERNAME`/`ADMIN_PASSWORD` w środowisku procesu. Ustaw i **zrestartuj** aplikację — zmienne wczytują się przy starcie. |
| `/api/content` zwraca 500 | Baza nieosiągalna: zły `DB_HOST`/hasło albo brak uprawnień. Sprawdź logi (`pm2 logs`). |
| Zmiany z panelu nie zapisują się (bez bazy) | Katalog `data/` niezapisywalny. `chown` na użytkownika procesu Node. |
| Zdjęcia z panelu znikają po aktualizacji | Nadpisany `public/uploads`. Patrz sekcja 7. |
| Angielski nie tłumaczy się automatycznie | Wyczerpany dzienny limit MyMemory. Ustaw `MYMEMORY_EMAIL` lub `DEEPL_API_KEY` (sekcja 3). |
| Zmiana tekstu nie widać na stronie | Odśwież bez cache (Ctrl+Shift+R). Jeśli przed aplikacją stoi CDN/cache hostingu — wyczyść go. |
