"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "pl" | "en";

const LangContext = createContext<{ lang: Lang; toggle: () => void }>({
  lang: "pl",
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pl");
  return (
    <LangContext.Provider value={{ lang, toggle: () => setLang((l) => (l === "pl" ? "en" : "pl")) }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
