import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container">
      <div className="page-header">
        <h1>Daftar Post</h1>
        <Link href="/create" className="btn btn-primary">
          + Buat Post Baru
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="muted-text">Belum ada post. Silakan buat post pertama.</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <h2 className="post-card-title">
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </h2>
              <p className="post-card-content">{post.content}</p>
              <Link href={`/posts/${post.id}`} className="detail-link">
                Lihat Detail / Edit / Hapus →
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}