"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Gagal menambahkan post");
    }
  }

  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← Kembali ke Beranda
      </Link>
      <h1 className="page-title">Buat Post Baru</h1>

      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="Judul post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input"
        />
        <textarea
          rows={5}
          placeholder="Isi post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="form-textarea"
        />
        <button type="submit" className="btn btn-primary">
          Simpan Post
        </button>
      </form>
      {error && <p className="msg-error">{error}</p>}
    </main>
  );
}