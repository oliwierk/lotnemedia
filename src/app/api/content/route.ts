import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

function checkAuth(request: Request) {
  const key = request.headers.get("x-admin-key");
  return key === (process.env.ADMIN_PASSWORD || "lotnemedia2025");
}

export async function GET() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const current = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const updated = { ...current, ...body };
  fs.writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}
