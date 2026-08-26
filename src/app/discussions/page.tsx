"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowBigUp, MessageSquareText, Pencil, Plus, Trash2, X } from "lucide-react";

type Role = "admin" | "leader" | "member";
type Post = { id: number; user_id: number; body: string; created_at: string; updated_at: string; author_name: string; author_username: string | null; author_avatar: string; author_role: Role; upvote_count: number; has_upvoted: boolean };
type Viewer = { id: number; role: Role };
type Sort = "new" | "top";
type Notice = { kind: "error" | "success"; text: string };

const PAGE_SIZE = 20;
const MAX_LENGTH = 2000;

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError(0, "Network error — check your connection and try again.");
  }
  if (response.status === 401) {
    window.location.href = "/login";
    throw new ApiError(401, "Your session expired.");
  }
  const data = (await response.json().catch(() => null)) as ({ error?: string } & T) | null;
  if (!response.ok || !data) throw new ApiError(response.status, data?.error ?? "Something went wrong. Please try again.");
  return data as T;
}

function relativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (!Number.isFinite(seconds)) return "";
  if (seconds < 60) return "just now";
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of steps) {
    if (seconds >= size) return formatter.format(-Math.floor(seconds / size), unit);
  }
  return "just now";
}

function Avatar({ post }: { post: Post }) {
  const avatar = post.author_avatar ?? "";
  if (avatar.startsWith("data:") || avatar.startsWith("http")) {
    return <img src={avatar} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full border border-slate-200 object-cover" />;
  }
  return <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 font-mono text-[10px] font-bold text-blue-700">{avatar || post.author_name.slice(0, 2).toUpperCase()}</span>;
}

export default function DiscussionsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [sort, setSort] = useState<Sort>("new");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [votingIds, setVotingIds] = useState<number[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);
  const composeTextareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  function showError(error: unknown, fallback: string) {
    if (error instanceof ApiError && error.status === 401) return;
    setNotice({ kind: "error", text: error instanceof Error && error.message ? error.message : fallback });
  }

  useEffect(() => {
    if (notice?.kind !== "success") return;
    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  async function fetchPage(targetSort: Sort, targetPage: number) {
    return api<{ posts: Post[]; hasMore: boolean; viewer: Viewer }>(`/api/discussions?page=${targetPage}&sort=${targetSort}`, { cache: "no-store" });
  }

  async function load(targetSort: Sort) {
    setLoading(true);
    setLoadFailed(false);
    try {
      const data = await fetchPage(targetSort, 0);
      setPosts(data.posts ?? []);
      setViewer(data.viewer);
      setHasMore(Boolean(data.hasMore));
      setPage(0);
      setConfirmingDeleteId(null);
    } catch (error) {
      setLoadFailed(true);
      showError(error, "Could not load discussions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load("new");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function changeSort(next: Sort) {
    if (next === sort || loading) return;
    setSort(next);
    await load(next);
  }

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const data = await fetchPage(sort, nextPage);
      setPosts((items) => [...items, ...(data.posts ?? [])]);
      setHasMore(Boolean(data.hasMore));
      setPage(nextPage);
    } catch (error) {
      showError(error, "Could not load more discussions.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function publish(event: FormEvent) {
    event.preventDefault();
    if (!body.trim() || saving) return;
    setSaving(true);
    try {
      const data = await api<{ post: Post }>("/api/discussions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body }) });
      setPosts((items) => [data.post, ...items]);
      setBody("");
      setComposing(false);
      setNotice({ kind: "success", text: "Your thought was posted." });
    } catch (error) {
      showError(error, "Could not publish your thought.");
    } finally {
      setSaving(false);
    }
  }

  async function vote(post: Post) {
    if (votingIds.includes(post.id)) return;
    setVotingIds((ids) => [...ids, post.id]);
    const snapshot = posts;
    const nextVoted = !post.has_upvoted;
    setPosts((items) => items.map((item) => item.id === post.id ? { ...item, has_upvoted: nextVoted, upvote_count: Math.max(0, item.upvote_count + (nextVoted ? 1 : -1)) } : item));
    try {
      const data = await api<{ upvoted: boolean; count: number }>(`/api/discussions/${post.id}/upvote`, { method: "POST" });
      setPosts((items) => items.map((item) => item.id === post.id ? { ...item, has_upvoted: data.upvoted, upvote_count: data.count } : item));
    } catch (error) {
      setPosts(snapshot);
      showError(error, "Could not update your upvote.");
    } finally {
      setVotingIds((ids) => ids.filter((id) => id !== post.id));
    }
  }

  async function saveEdit(event: FormEvent) {
    event.preventDefault();
    if (!editing || saving) return;
    setSaving(true);
    try {
      const data = await api<{ post: Post }>(`/api/discussions/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: editing.body }) });
      setPosts((items) => items.map((item) => item.id === editing.id ? { ...item, body: data.post.body, updated_at: data.post.updated_at } : item));
      setEditing(null);
      setNotice({ kind: "success", text: "Your changes were saved." });
    } catch (error) {
      showError(error, "Could not update post.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(post: Post) {
    if (deletingId !== null) return;
    setDeletingId(post.id);
    try {
      await api<{ success: boolean }>(`/api/discussions/${post.id}`, { method: "DELETE" });
      setPosts((items) => items.filter((item) => item.id !== post.id));
      setConfirmingDeleteId(null);
      setNotice({ kind: "success", text: "Post removed." });
    } catch (error) {
      showError(error, "Could not remove post.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    if (!editing) return;
    editTextareaRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEditing(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [editing]);

  useEffect(() => {
    if (!composing) return;
    composeTextareaRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) setComposing(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [composing, saving]);

  const canModerateAll = viewer?.role === "admin" || viewer?.role === "leader";

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="font-mono text-lg font-bold text-slate-900"><span className="text-blue-500">&lt;</span>tech<span className="text-blue-700">_pals</span><span className="text-blue-500"> /&gt;</span></Link>
          <Link href="/member" className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Member area</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="border-b border-slate-200 pb-7">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Community conversations</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900">What are you thinking about?</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Share an idea, a question, a useful link, or a lesson from your work.</p>
        </div>
        {notice && (
          <div className={`mt-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${notice.kind === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
            <span>{notice.text}</span>
            <button onClick={() => setNotice(null)} aria-label="Dismiss"><X size={16} /></button>
          </div>
        )}
        <div className="mt-5 flex items-center justify-end">
          <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5" role="group" aria-label="Sort discussions">
            {(["new", "top"] as Sort[]).map((option) => (
              <button key={option} onClick={() => changeSort(option)} aria-pressed={sort === option} className={`rounded px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${sort === option ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:text-slate-700"}`}>
                {option === "new" ? "Newest" : "Top"}
              </button>
            ))}
          </div>
        </div>
        <section className="divide-y divide-slate-200">
          {loading ? (
            <p className="py-12 text-center font-mono text-sm text-slate-500">Loading discussions…</p>
          ) : loadFailed ? (
            <div className="py-16 text-center">
              <MessageSquareText className="mx-auto mb-4 text-slate-300" size={32} />
              <h2 className="font-semibold text-slate-900">Could not load discussions.</h2>
              <p className="mt-2 text-sm text-slate-500">Check your connection and try again.</p>
              <button onClick={() => load(sort)} className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">Try again</button>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquareText className="mx-auto mb-4 text-blue-400" size={32} />
              <h2 className="font-semibold text-slate-900">Start the conversation.</h2>
              <p className="mt-2 text-sm text-slate-500">Be the first to share a thought with the community.</p>
            </div>
          ) : posts.map((post) => {
            const canManage = canModerateAll || viewer?.id === post.user_id;
            const voting = votingIds.includes(post.id);
            const removing = deletingId === post.id;
            return (
              <article key={post.id} className="flex gap-4 py-6">
                <button onClick={() => vote(post)} disabled={voting} aria-label={post.has_upvoted ? "Remove upvote" : "Upvote post"} className={`flex h-12 w-11 shrink-0 flex-col items-center justify-center rounded-md border text-xs font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${post.has_upvoted ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-700"}`}>
                  <ArrowBigUp size={18} fill={post.has_upvoted ? "currentColor" : "none"} />
                  <span>{post.upvote_count}</span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Avatar post={post} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {post.author_name}
                        {post.author_role !== "member" && <span className="ml-1 font-mono text-[10px] font-semibold uppercase text-blue-700">{post.author_role === "admin" ? "Admin" : "Leader"}</span>}
                      </p>
                      <p className="text-xs text-slate-500">
                        {post.author_username ? `@${post.author_username} · ` : ""}
                        <time dateTime={post.created_at} title={new Date(post.created_at).toLocaleString()}>{relativeTime(post.created_at)}</time>
                      </p>
                    </div>
                    {canManage && (
                      <div className="ml-auto flex items-center gap-1">
                        {confirmingDeleteId === post.id ? (
                          <>
                            <span className="mr-1 text-xs font-medium text-slate-500">Remove post?</span>
                            <button onClick={() => remove(post)} disabled={removing} className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-60">{removing ? "Removing…" : "Yes, remove"}</button>
                            <button onClick={() => setConfirmingDeleteId(null)} disabled={removing} className="rounded px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setEditing({ ...post })} className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Edit post"><Pencil size={14} /></button>
                            <button onClick={() => setConfirmingDeleteId(post.id)} className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove post"><Trash2 size={14} /></button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{post.body}</p>
                  {post.updated_at !== post.created_at && <p className="mt-2 text-xs text-slate-400">Edited</p>}
                </div>
              </article>
            );
          })}
        </section>
        {hasMore && !loading && !loadFailed && (
          <div className="py-8 text-center">
            <button onClick={loadMore} disabled={loadingMore} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      </main>
      {viewer && !composing && !editing && (
        <button onClick={() => setComposing(true)} aria-label="New thought" className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:bottom-8 sm:right-8">
          <Plus size={22} />
        </button>
      )}
      {composing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button onClick={() => !saving && setComposing(false)} className="absolute inset-0 bg-slate-950/30" aria-label="Close" tabIndex={-1} />
          <form onSubmit={publish} role="dialog" aria-modal="true" aria-labelledby="compose-post-title" className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="compose-post-title" className="text-lg font-semibold text-slate-900">New thought</h2>
              <button type="button" onClick={() => !saving && setComposing(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Close"><X size={18} /></button>
            </div>
            <label className="sr-only" htmlFor="new-post">Share a thought</label>
            <textarea ref={composeTextareaRef} id="new-post" value={body} onChange={(event) => setBody(event.target.value)} maxLength={MAX_LENGTH} rows={7} placeholder="Start a discussion…" className="mt-4 w-full resize-y rounded-md border border-slate-300 p-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">{body.length}/{MAX_LENGTH}</span>
              <div className="flex gap-3">
                <button type="button" onClick={() => !saving && setComposing(false)} className="rounded-md px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button disabled={saving || !body.trim()} className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
                  <Plus size={16} />{saving ? "Posting…" : "Post thought"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button onClick={() => setEditing(null)} className="absolute inset-0 bg-slate-950/30" aria-label="Close edit dialog" tabIndex={-1} />
          <form onSubmit={saveEdit} role="dialog" aria-modal="true" aria-labelledby="edit-post-title" className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="edit-post-title" className="text-lg font-semibold text-slate-900">Edit post</h2>
              <button type="button" onClick={() => setEditing(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Close"><X size={18} /></button>
            </div>
            <textarea ref={editTextareaRef} value={editing.body} onChange={(event) => setEditing({ ...editing, body: event.target.value })} maxLength={MAX_LENGTH} rows={7} className="mt-4 w-full resize-y rounded-md border border-slate-300 p-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="rounded-md px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button disabled={saving || !editing.body.trim()} className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
