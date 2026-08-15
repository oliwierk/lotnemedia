import { NextResponse } from "next/server";
import { updateItem, deleteItem } from "@/lib/portfolio-store";

function checkAuth(request: Request) {
  const key = request.headers.get("x-admin-key");
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && key === pw;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const item = await updateItem(id, await request.json());
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteItem(id);
  return NextResponse.json({ ok: true });
}
