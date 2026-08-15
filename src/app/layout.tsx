import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import PageOverlay from "@/components/PageOverlay";
import Providers from "@/components/Providers";
import { readContent } from "@/lib/content-store";
import { applyTextOverrides, type TextOverrides } from "@/i18n/text-fields";

// Teksty strony pochodzą z panelu admina, więc renderujemy je na żądanie —
// inaczej zmiany byłyby widoczne dopiero po przebudowaniu strony.
export const dynamic = "force-dynamic";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Treść pobieramy z magazynu (Vercel Blob na produkcji, plik lokalnie).
// Awaria magazynu nie może wywalić strony — wracamy wtedy do tekstów domyślnych.
async function loadTexts(): Promise<TextOverrides> {
  try {
    return (await readContent()).texts || {};
  } catch (err) {
    console.error("Nie udało się wczytać tekstów:", err);
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = applyTextOverrides("pl", await loadTexts());
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const texts = await loadTexts();

  return (
    <html
      lang="pl"
      className={`${dmSans.variable} ${cormorant.variable}`}
    >
      <body style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
        <Providers texts={texts}>
          <PageOverlay />
          <ConditionalNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
