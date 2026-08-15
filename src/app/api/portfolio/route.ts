import { NextResponse } from "next/server";
import { readItems, createItem } from "@/lib/portfolio-store";

function checkAuth(request: Request) {
  const key = request.headers.get("x-admin-key");
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && key === pw;
}

export async function GET() {
  return NextResponse.json(await readItems());
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const item = await createItem(await request.json());
  return NextResponse.json(item, { status: 201 });
}
