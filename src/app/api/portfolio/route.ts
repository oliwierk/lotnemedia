import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");

function checkAuth(request: Request) {
  const key = request.headers.get("x-admin-key");
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && key === pw;
}

export async function GET() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const data: object[] = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const newItem = { ...body, id: `item_${Date.now()}` };
  data.push(newItem);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  return NextResponse.json(newItem, { status: 201 });
}
