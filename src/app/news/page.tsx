"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Newspaper, ExternalLink, Search, SlidersHorizontal } from "lucide-react";

type Article = { title: string; link: string; snippet: string; pubDate: string; source: string };
type Sort = "newest" | "oldest";

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  useEffect(() => {
    fetch("/api/news", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setArticles(data.articles ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sources = Array.from(new Set(articles.map((a) => a.source))).sort();

  const filtered = articles
    .filter((article) => {
      const text = `${article.title} ${article.snippet} ${article.source}`.toLowerCase();
      return text.includes(query.toLowerCase());
    })
    .sort((a, b) => {
      const diff = new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      return sort === "oldest" ? -diff : diff;
    });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-mono text-lg font-bold text-slate-900">
            <span className="text-blue-500">&lt;</span>tech<span className="text-blue-600">_pals</span>
            <span className="text-blue-500"> /&gt;</span>
          </Link>
          <div className="flex gap-3 font-mono text-xs">
            <Link href="/" className="rounded border border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-50">home</Link>
            <Link href="/projects" className="rounded border border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-50">projects</Link>
            <Link href="/member" className="rounded bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700">member area</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10 max-w-2xl">
          <span className="font-mono text-xs font-semibold tracking-widest text-blue-600">[ AI_INTEL ]</span>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">AI news that matters.</h1>
          <p className="mt-4 leading-relaxed text-slate-600">Curated headlines from leading AI and tech publications, updated as stories break.</p>
        </div>

        <section>
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search articles, topics, or sources"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 font-mono text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
              />
            </div>
            <label className="flex items-center gap-2 font-mono text-xs text-slate-500">
              <SlidersHorizontal size={14} />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="rounded border border-slate-200 bg-white px-2 py-1.5 outline-none"
              >
                <option value="newest">newest</option>
                <option value="oldest">oldest</option>
              </select>
            </label>
          </div>

          {loading ? (
            <p className="font-mono text-sm text-slate-500">$ fetching latest AI news...</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <Newspaper className="mx-auto mb-3 text-blue-400" size={32} />
              <h2 className="font-bold text-slate-800">No articles found.</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Try a different search term or check back later.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between font-mono text-[11px] text-slate-400">
                <span>NEWSFEED</span>
                <span>{filtered.length} articles</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((article, index) => (
                  <a
                    key={index}
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue-700">{article.source}</span>
                      <ExternalLink size={13} className="text-slate-300 transition group-hover:text-blue-500" />
                    </div>
                    <h2 className="mt-3 flex-1 font-bold leading-snug text-slate-900 line-clamp-3">{article.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-3">{article.snippet || "No summary available."}</p>
                    <time className="mt-4 block font-mono text-[10px] text-slate-400">
                      {new Date(article.pubDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </time>
                  </a>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
