"use client";

import { LangProvider } from "@/context/LangContext";
import type { TextOverrides } from "@/i18n/text-fields";
import { ReactNode } from "react";

export default function Providers({
  children,
  texts,
}: {
  children: ReactNode;
  texts?: TextOverrides;
}) {
  return <LangProvider texts={texts}>{children}</LangProvider>;
}
