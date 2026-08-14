import { NextResponse } from "next/server";
import { listItems, createItem } from "@/lib/portfolio-store";

function checkAuth(request: Request) {
  const key = request.headers.get("x-admin-key");
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && key === pw;
}

export async function GET() {
  const data = await listItems();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const newItem = await createItem(body);
  return NextResponse.json(newItem, { status: 201 });
}
