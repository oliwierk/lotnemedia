import { T, type Lang, type Translations } from "./translations";

/**
 * Nadpisania tekstów z panelu admina.
 * Klucz to "<lang>.<ścieżka>", np. "pl.hero.line1" albo "en.services.items.0.title".
 * Trzymamy tylko te pola, które admin faktycznie zmienił — reszta bierze się z translations.ts.
 */
export type TextOverrides = Record<string, string>;

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/* ─── ścieżki ─── */

/** Spłaszcza obiekt tłumaczeń do mapy "hero.line1" → "Tworzymy". */
export function flattenTexts(value: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};

  if (typeof value === "string") {
    out[prefix] = value;
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => Object.assign(out, flattenTexts(v, prefix ? `${prefix}.${i}` : String(i))));
    return out;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      Object.assign(out, flattenTexts(v, prefix ? `${prefix}.${k}` : k));
    }
  }
  return out;
}

/** Ustawia wartość pod ścieżką "services.items.0.title" (tylko jeśli taka ścieżka już istnieje). */
function setPath(target: Json, path: string, value: string): void {
  const parts = path.split(".");
  let node: Json = target;

  for (let i = 0; i < parts.length - 1; i++) {
    if (node === null || typeof node !== "object") return;
    const next: Json | undefined = Array.isArray(node)
      ? node[Number(parts[i])]
      : (node as { [k: string]: Json })[parts[i]];
    if (next === undefined) return;
    node = next;
  }

  const last = parts[parts.length - 1];
  if (node === null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    const idx = Number(last);
    if (Number.isInteger(idx) && idx >= 0 && idx < node.length) node[idx] = value;
    return;
  }
  // Nie tworzymy nowych kluczy — chroni przed śmieciami po zmianach w translations.ts.
  if (last in node) (node as { [k: string]: Json })[last] = value;
}

/** Domyślne teksty + nadpisania admina dla danego języka. */
export function applyTextOverrides(lang: Lang, overrides?: TextOverrides | null): Translations {
  const base = structuredClone(T[lang]) as unknown as Json;
  if (!overrides) return base as unknown as Translations;

  const prefix = `${lang}.`;
  for (const [key, value] of Object.entries(overrides)) {
    if (!key.startsWith(prefix) || typeof value !== "string") continue;
    setPath(base, key.slice(prefix.length), value);
  }
  return base as unknown as Translations;
}

/* ─── opis pól dla panelu admina ─── */

/** Sekcje w kolejności, w jakiej występują na stronie. */
export const SECTIONS: { key: keyof Translations; label: string; hint?: string }[] = [
  { key: "nav", label: "Nawigacja" },
  { key: "hero", label: "Hero" },
  { key: "services", label: "Usługi" },
  { key: "portfolio", label: "Realizacje" },
  { key: "process", label: "Proces" },
  { key: "drony", label: "Drony" },
  { key: "about", label: "O mnie", hint: "Bio edytujesz w zakładce „Bio”, nagrody w „Nagrody”." },
  { key: "team", label: "Zespół" },
  { key: "trustedBy", label: "Zaufali nam" },
  {
    key: "seo",
    label: "SEO / zakładka przeglądarki",
    hint: "Tytuł i opis widoczne w Google oraz przy udostępnianiu linku. Wspólne dla obu języków.",
  },
  { key: "contact", label: "Kontakt / stopka" },
];

/** Pola takie same w obu językach (dane, nie tłumaczenia) — admin widzi jedno pole. */
const SHARED = [
  /^contact\.(email|phone|facebook|youtube)$/,
  /^seo\./,
  /^about\.name$/,
  /^team\.members\.\d+\.name$/,
  /^drony\.stats\.\d+\.value$/,
  /^process\.steps\.\d+\.num$/,
];

/** Pola zarządzane gdzie indziej w panelu — nie pokazujemy ich w edytorze tekstów. */
const HIDDEN = [/^about\.bio(Short|Full)$/];

const LEAF_LABELS: Record<string, string> = {
  description: "Opis (meta description)",
  ogTitle: "Tytuł przy udostępnianiu linku",
  ogDescription: "Opis przy udostępnianiu linku",
  heading: "Nagłówek",
  headingItalic: "Nagłówek — kursywa",
  label: "Etykieta sekcji",
  title: "Tytuł",
  desc: "Opis",
  name: "Imię i nazwisko",
  nameTitle: "Podpis pod nazwiskiem",
  role: "Rola",
  bio: "Bio",
  num: "Numer",
  value: "Wartość",
  subtitle: "Podtytuł",
  empty: "Komunikat „brak wyników”",
  readMore: "Przycisk „czytaj więcej”",
  collapse: "Przycisk „zwiń”",
  awardsLabel: "Nagłówek nagród",
  scrollHint: "Podpowiedź przewijania",
  sectionVideo: "Podtytuł — wideo",
  sectionPhoto: "Podtytuł — foto",
  emailLabel: "Etykieta e-maila",
  phoneLabel: "Etykieta telefonu",
  phoneScan: "Tekst przy kodzie QR",
  socialLabel: "Etykieta social media",
  email: "Adres e-mail",
  phone: "Numer telefonu (w kodzie QR)",
  facebook: "Link do Facebooka",
  youtube: "Link do YouTube",
  line1: "Wiersz 1",
  line2: "Wiersz 2",
  line3: "Wiersz 3",
  img1: "Podpis zdjęcia 1",
  img2: "Podpis zdjęcia 2",
  img3: "Podpis zdjęcia 3",
  text1: "Akapit 1",
  text2: "Akapit 2",
  realizacje: "Realizacje",
  uslugi: "Usługi",
  drony: "Drony",
  onas: "O mnie",
  kontakt: "Kontakt",
};

const GROUP_LABELS: Record<string, string> = {
  items: "Usługa",
  steps: "Krok",
  stats: "Statystyka",
  members: "Osoba",
  filters: "Filtr",
};

export type TextField = {
  /** Ścieżka bez języka, np. "services.items.0.title". */
  path: string;
  /** Nagłówek grupy, np. "Usługa 2" — null dla pól bezpośrednio w sekcji. */
  group: string | null;
  label: string;
  /** Ta sama wartość w obu językach — panel pokazuje jedno pole. */
  shared: boolean;
  multiline: boolean;
  defaults: Record<Lang, string>;
};

/** Klucz w mapie nadpisań, np. ("pl", "hero.line1") → "pl.hero.line1". */
export function textKey(lang: Lang, path: string): string {
  return `${lang}.${path}`;
}

/** Wszystkie edytowalne pola ze wszystkich sekcji. */
export function allFields(): TextField[] {
  return SECTIONS.flatMap((s) => sectionFields(s.key));
}

/**
 * Domyślne teksty jako płaska mapa "pl.hero.line1" → "Tworzymy".
 * Panel pokazuje je jako wartości pól, a przy zapisie odsiewa to, co się nie zmieniło.
 */
export function defaultValues(): TextOverrides {
  const out: TextOverrides = {};
  for (const f of allFields()) {
    out[textKey("pl", f.path)] = f.defaults.pl;
    out[textKey("en", f.path)] = f.defaults.en;
  }
  return out;
}

/** Buduje listę edytowalnych pól sekcji na podstawie domyślnych tekstów. */
export function sectionFields(section: keyof Translations): TextField[] {
  const plFlat = flattenTexts(T.pl[section]);
  const enFlat = flattenTexts(T.en[section]);

  return Object.entries(plFlat)
    .map(([subPath, plValue]) => {
      const path = `${section}.${subPath}`;
      const parts = subPath.split(".");
      const leaf = parts[parts.length - 1];

      // np. ["items", "0", "title"] → grupa "Usługa 1".
      // Dla tablic samych stringów (["filters", "0"]) grupy nie ma — indeks jest w etykiecie.
      const idxPos = parts.findIndex((p) => /^\d+$/.test(p));
      const group =
        idxPos > 0 && idxPos < parts.length - 1
          ? `${GROUP_LABELS[parts[idxPos - 1]] || parts[idxPos - 1]} ${Number(parts[idxPos]) + 1}`
          : null;

      const isIndexLeaf = /^\d+$/.test(leaf);
      const label = isIndexLeaf
        ? `${GROUP_LABELS[parts[parts.length - 2]] || "Pozycja"} ${Number(leaf) + 1}`
        : LEAF_LABELS[leaf] || leaf;

      const enValue = enFlat[subPath] ?? "";

      return {
        path,
        group,
        label,
        shared: SHARED.some((re) => re.test(path)),
        multiline: plValue.length > 70 || plValue.includes("\n"),
        defaults: { pl: plValue, en: enValue },
      };
    })
    .filter((f) => !HIDDEN.some((re) => re.test(f.path)));
}
