import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Comment = {
  id: number;
  author?: string | null;
  text: string;
  photo?: string | null;
  createdAt: string;
};

const fmt = (iso: string) => new Date(iso).toLocaleString();

/**
 * Read-only comments list.
 * Photos:
 *   Put images in: public/reviews/photos/
 *   e.g. user-1.jpg → /reviews/photos/user-1.jpg
 */
export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await apiFetch("/api/comments");
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        setComments(data);
        setErr(null);
      } catch (e: any) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <section id="comments" className="max-w-4xl mx-auto my-12 px-4">
      <h2 className="text-2xl font-bold mb-4">What our users say</h2>

      {loading && <p>Loading...</p>}
      {err && <p className="text-red-600">Error: {err}</p>}

      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="p-4 border rounded-lg flex gap-4">
            {c.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/reviews/photos/${c.photo}`}
                alt={c.author || "user"}
                className="w-14 h-14 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-800">
                  {c.author || "Anonymous"}
                </span>
                <span>•</span>
                <time>{fmt(c.createdAt)}</time>
              </div>
              <p className="mt-1">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-500 mt-6">
        To add avatars, place image files into{" "}
        <code>public/reviews/photos/</code> and set the &#34;photo&#34; field in
        the database later.
      </p>
    </section>
  );
}
