import { NextResponse } from "next/server";
import { getContent, updateContent } from "@/lib/content-store";

function checkAuth(request: Request) {
  const key = request.headers.get("x-admin-key");
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && key === pw;
}

export async function GET() {
  const data = await getContent();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const updated = await updateContent(body);
  return NextResponse.json(updated);
}
