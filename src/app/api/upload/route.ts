import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function checkAuth(request: Request) {
  const key = request.headers.get("x-admin-key");
  return key === (process.env.ADMIN_PASSWORD || "lotnemedia2025");
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".jpg";
  const fileName = `${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.writeFileSync(path.join(uploadDir, fileName), buffer);

  return NextResponse.json({ url: `/uploads/${fileName}` });
}
