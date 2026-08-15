import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { isBlobConfigured } from "@/lib/blob-store";

/**
 * Wgrywanie zdjęć z panelu.
 *
 * Na Vercelu pliki trafiają do Vercel Blob (system plików jest tam tylko do odczytu),
 * lokalnie — do `public/uploads`, żeby `npm run dev` działał bez konfiguracji.
 */

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/gif", ".gif"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);

function checkAuth(request: Request) {
  const key = request.headers.get("x-admin-key");
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && key === pw;
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nie przesłano pliku" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Plik jest za duży (maks. ${MAX_BYTES / 1024 / 1024} MB).` },
      { status: 400 }
    );
  }

  const ext = ALLOWED.get(file.type);
  if (!ext) {
    return NextResponse.json(
      { error: "Dozwolone formaty: JPG, PNG, GIF, WEBP, AVIF." },
      { status: 400 }
    );
  }

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  if (isBlobConfigured()) {
    // Losowy sufiks w nazwie mamy własny, więc wyłączamy dodatkowy od SDK.
    const blob = await put(`uploads/${name}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.writeFileSync(path.join(uploadDir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
