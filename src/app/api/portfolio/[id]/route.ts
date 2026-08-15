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
  try {
    const item = await updateItem(id, await request.json());
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    console.error("Nie udało się zapisać pozycji:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Zapis nie powiódł się" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await deleteItem(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Nie udało się usunąć pozycji:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Usunięcie nie powiodło się" },
      { status: 500 }
    );
  }
}
