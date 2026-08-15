"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Translations } from "@/i18n/translations";
import { applyTextOverrides, type TextOverrides } from "@/i18n/text-fields";
import { dataUrl, isPhpBackend } from "@/lib/api-base";

export type Lang = "pl" | "en";

type LangValue = {
  lang: Lang;
  toggle: () => void;
  /** Teksty dla aktualnego języka: domyślne z translations.ts + nadpisania z panelu admina. */
  t: Translations;
};

const LangContext = createContext<LangValue>({
  lang: "pl",
  toggle: () => {},
  t: applyTextOverrides("pl"),
});

export function LangProvider({
  children,
  texts,
}: {
  children: ReactNode;
  texts?: TextOverrides;
}) {
  const [lang, setLang] = useState<Lang>("pl");
  const [liveTexts, setLiveTexts] = useState<TextOverrides | undefined>(texts);

  // W wersji statycznej HTML powstaje raz, przy budowaniu, więc zmiany tekstów
  // z panelu nie byłyby widoczne. Dociągamy je więc w przeglądarce — już po
  // hydratacji, żeby nie różnić się od HTML-a wygenerowanego na serwerze.
  // Sekcje pojawiają się z animacją, więc podmiana jest niezauważalna.
  useEffect(() => {
    if (!isPhpBackend()) return;
    let active = true;
    fetch(dataUrl("content"))
      .then((r) => r.json())
      .then((data: { texts?: TextOverrides }) => {
        if (active && data && typeof data.texts === "object") setLiveTexts(data.texts);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<LangValue>(
    () => ({
      lang,
      toggle: () => setLang((l) => (l === "pl" ? "en" : "pl")),
      t: applyTextOverrides(lang, liveTexts),
    }),
    [lang, liveTexts]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Teksty strony dla aktualnego języka (z uwzględnieniem zmian z panelu admina). */
export function useT(): Translations {
  return useContext(LangContext).t;
}
