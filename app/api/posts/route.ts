import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Judul dan isi wajib diisi" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: { title: title.trim(), content: content.trim() },
    });
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat post (Vercel bersifat read-only untuk SQLite)" },
      { status: 500 }
    );
  }
}