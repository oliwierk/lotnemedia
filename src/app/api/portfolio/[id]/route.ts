import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");

function checkAuth(request: Request) {
  const key = request.headers.get("x-admin-key");
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && key === pw;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown>[] = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const idx = data.findIndex((it) => it.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  data[idx] = { ...data[idx], ...body, id };
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  return NextResponse.json(data[idx]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data: Record<string, unknown>[] = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const filtered = data.filter((it) => it.id !== id);
  fs.writeFileSync(DATA_PATH, JSON.stringify(filtered, null, 2));
  return NextResponse.json({ ok: true });
}
