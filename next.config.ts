import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Samodzielna paczka dla własnego hostingu. Na Vercelu zbędna — platforma
  // buduje po swojemu, a "standalone" tylko wydłużyłoby build.
  output: process.env.VERCEL ? undefined : "standalone",
  // Pliki z treścią czytamy przez ścieżkę budowaną w kodzie, więc Next nie wykryje
  // ich automatycznie i nie dołączy do funkcji. Bez tego na Vercelu strona
  // wystartowałaby z pustą treścią, zanim cokolwiek zapiszesz w panelu.
  outputFileTracingIncludes: {
    "/*": ["data/**"],
    "/api/*": ["data/**"],
  },
  experimental: {
    // Hosting współdzielony ma twarde limity pamięci (CloudLinux PMEM).
    // Domyślnie Next przy starcie wczytuje do pamięci moduły wszystkich stron —
    // szybsze pierwsze żądanie kosztem większego zużycia pamięci na starcie.
    // Przy niskim limicie to właśnie ten skok potrafi zabić proces.
    preloadEntriesOnStart: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
