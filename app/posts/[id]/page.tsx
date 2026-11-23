"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setPost(data);
          setTitle(data.title);
          setContent(data.content);
        }
      });
  }, [id]);

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const updated = await res.json();
      setPost(updated);
      setIsEditing(false);
      setMessage("Post berhasil diperbarui!");
    } else {
      const err = await res.json();
      setMessage(err.error || "Gagal memperbarui post.");
    }
  }

  async function handleDelete() {
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const err = await res.json();
      setMessage(err.error || "Gagal menghapus post.");
    }
  }

  if (!post) {
    return (
      <main className="container">
        <p className="muted-text">Memuat post...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← Kembali ke Daftar Post
      </Link>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="post-form">
          <h1>Edit Post</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="form-textarea"
          />
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <article className="post-detail">
          <h1 className="post-detail-title">{post.title}</h1>
          <p className="post-detail-content">{post.content}</p>
          <div className="btn-group">
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-warning"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Hapus
            </button>
          </div>
        </article>
      )}

      {message && <p className="msg-info">{message}</p>}
    </main>
  );
}