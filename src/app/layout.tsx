import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PageOverlay from "@/components/PageOverlay";
import Providers from "@/components/Providers";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lotne Media — Obraz i Dźwięk",
  description: "Profesjonalna produkcja wideo i foto. Reportaże TVP, podcasty, eventy medialne, fotografia.",
  openGraph: {
    title: "Lotne Media",
    description: "Tworzymy Obraz i Dźwięk",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${dmSans.variable} ${cormorant.variable}`}
    >
      <body style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
        <Providers>
          <PageOverlay />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
