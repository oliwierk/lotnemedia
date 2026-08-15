This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Wdrożenie

Budowa gotowej paczki: `npm run deploy:build` → katalog `out/` (samodzielny serwer Node, uruchamiany przez `node server.js`).

Pełna instrukcja wdrożenia i podpięcia MySQL: **[DEPLOY.md](DEPLOY.md)**.

## Panel admina i baza danych

Panel `/admin` loguje się przez `ADMIN_USERNAME` / `ADMIN_PASSWORD` (plik `.env.local`). Treść strony domyślnie jest trzymana w plikach `data/content.json` i `data/portfolio.json`.

### Zakładka „Teksty”

Pozwala zmienić dowolny tekst widoczny na stronie (nagłówki, opisy usług, kroki procesu, zespół, stopka, dane kontaktowe, tytuł i opis SEO) — osobno po polsku i po angielsku.

- Każde pole jest wypełnione tekstem, który jest aktualnie na stronie — można poprawić pojedynczą literę, nie przepisując całości.
- Teksty domyślne żyją w `src/i18n/translations.ts`. Panel ich nie nadpisuje — przy zapisie porównuje wartości z domyślnymi i zapisuje tylko **różnice**, jako mapę `"<lang>.<ścieżka>"` → tekst (np. `"pl.hero.line1"`), w `data/content.json` (klucz `texts`) lub w kolumnie `site_content.texts`.
- „Przywróć domyślny” (pole) i „Przywróć sekcję” cofają zmiany do tekstu z kodu.
- Pola wspólne dla obu języków (e-mail, telefon, linki social, imiona, SEO) mają w panelu jeden wpis.

#### Automatyczne tłumaczenie na angielski

Po zmianie polskiego tekstu angielski uzupełnia się sam (ok. sekundy po zakończeniu pisania). Ręcznie wpisany angielski nie jest już nadpisywany automatem — do momentu użycia przycisku „Przetłumacz” dla pola lub „Przetłumacz sekcję”. Automat można wyłączyć przełącznikiem w pasku akcji.

Tłumaczy `POST /api/translate` (używa go też sekcja „O mnie” dla bio i nagród):

| Zmienna | Efekt |
| --- | --- |
| *(brak)* | MyMemory — darmowe, bez klucza i rejestracji. Limit ok. 5 tys. znaków dziennie na IP. |
| `MYMEMORY_EMAIL` | Ten sam MyMemory, limit podniesiony do 50 tys. znaków dziennie. |
| `DEEPL_API_KEY` | DeepL — wyraźnie lepsza polszczyzna, darmowy plan 500 tys. znaków miesięcznie. Gdy zawiedzie, automatycznie wraca do MyMemory. |

Darmowe tłumaczenie maszynowe bywa nieprecyzyjne przy krótkich hasłach bez kontekstu i potrafi pomylić rodzaj gramatyczny („she” / „he”) — warto przejrzeć angielskie pola przed zapisem.
- Lista pól generuje się automatycznie z `translations.ts` — po dodaniu tam nowego tekstu pojawi się on w panelu bez zmian w kodzie panelu. Etykiety pól można opisać w `src/i18n/text-fields.ts`.
- Strona renderuje się na żądanie (`dynamic = "force-dynamic"` w `src/app/layout.tsx`), więc zmiany widać od razu po odświeżeniu — bez przebudowy.

Bio i nagrody mają własne zakładki („Bio”, „Nagrody”) i nie dublują się w „Tekstach”.

Po założeniu bazy MySQL na hostingu:

1. Uzupełnij w `.env.local` (lokalnie) i w zmiennych środowiskowych na hostingu: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
2. Uruchom `npm run db:migrate` — utworzy tabele (`sql/schema.sql`) i zaimportuje dane z `data/*.json` (bezpieczne do wielokrotnego odpalenia, nie nadpisze istniejących danych w bazie).
3. Gdy `DB_HOST` jest ustawione, panel automatycznie czyta i zapisuje z bazy zamiast plików JSON — nie trzeba nic zmieniać w kodzie.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# lotnemedia
