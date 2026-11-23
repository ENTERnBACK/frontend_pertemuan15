import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) {
      return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil detail" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content } = await request.json();
    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: { title: title.trim(), content: content.trim() },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengubah post (Vercel bersifat read-only untuk SQLite)" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.post.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Post berhasil dihapus" });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus post (Vercel bersifat read-only untuk SQLite)" },
      { status: 500 }
    );
  }
}