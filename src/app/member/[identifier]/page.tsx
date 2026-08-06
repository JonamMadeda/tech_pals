"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Code,
  FolderKanban,
  GitPullRequest,
  Github,
  Globe,
  Linkedin,
  Star,
} from "lucide-react";

type PublicMember = {
  id: number;
  username: string | null;
  name: string;
  avatar: string;
  role: "admin" | "leader" | "member";
  title: string;
  bio: string;
  tags: string[] | null;
  github: string;
  linkedin: string;
  website: string;
  commits: number;
  prs: number;
  lang: string;
  created_at: string;
};

type PublicProject = {
  id: number;
  title: string;
  summary: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  tags: string[] | null;
  featured: boolean;
  created_at: string;
};

export default function PublicMemberPage({ params }: { params: { identifier: string } }) {
  const [member, setMember] = useState<PublicMember | null>(null);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "notfound">("loading");

  useEffect(() => {
    fetch(`/api/members/by-handle/${encodeURIComponent(params.identifier)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("not found"))))
      .then((data) => {
        setMember(data.member);
        setProjects(data.projects ?? []);
        setState("ready");
      })
      .catch(() => setState("notfound"));
  }, [params.identifier]);

  if (state === "loading") {
    return <div className="grid min-h-screen place-items-center bg-[#f8fafc] font-mono text-sm text-slate-500">$ fetching profile...</div>;
  }

  if (state === "notfound" || !member) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8fafc] px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-mono text-xs font-bold tracking-widest text-red-500">[ 404_NOT_FOUND ]</p>
          <h1 className="mt-3 text-xl font-bold text-slate-900">No such member.</h1>
          <p className="mt-2 text-sm text-slate-500">This handle does not exist in the registry.</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-blue-700">
            <ArrowLeft size={14} />back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-mono text-lg font-bold text-slate-900">
            <span className="text-blue-500">&lt;</span>tech<span className="text-blue-600">_pals</span><span className="text-blue-500"> /&gt;</span>
          </Link>
          <Link href="/#members" className="rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs text-slate-600 hover:bg-slate-50">members list</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="shrink-0">
              {member.avatar.startsWith("data:") || member.avatar.startsWith("http") ? (
                <img src={member.avatar} alt={member.name} className="h-20 w-20 rounded-2xl border border-blue-100 object-cover" />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl border border-blue-100 bg-blue-50 font-mono text-2xl font-bold text-blue-700">{member.avatar || member.name.slice(0, 2).toUpperCase()}</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{member.name}</h1>
                <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${member.role === "leader" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{member.role}</span>
                {member.username && <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500">@{member.username}</span>}
              </div>
              <p className="mt-1 font-mono text-sm text-slate-500">{member.title || "member"}</p>
              <div className="mt-3 flex items-center gap-3">
                {member.github && <a href={member.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-blue-600"><Github size={16} /></a>}
                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-blue-600"><Linkedin size={16} /></a>}
                {member.website && <a href={member.website} target="_blank" rel="noreferrer" aria-label="Website" className="text-slate-400 hover:text-blue-600"><Globe size={16} /></a>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:w-72">
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <GitPullRequest size={16} className="mx-auto text-blue-500" />
                <p className="mt-2 text-lg font-bold text-slate-900">{member.prs}</p>
                <p className="font-mono text-[10px] text-slate-400">PRS</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <Code size={16} className="mx-auto text-blue-500" />
                <p className="mt-2 text-lg font-bold text-slate-900">{member.commits}</p>
                <p className="font-mono text-[10px] text-slate-400">COMMITS</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <CalendarDays size={16} className="mx-auto text-blue-500" />
                <p className="mt-2 text-lg font-bold text-slate-900">{new Date(member.created_at).toLocaleDateString()}</p>
                <p className="font-mono text-[10px] text-slate-400">JOINED</p>
              </div>
            </div>
          </div>
          {member.bio && <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-600">{member.bio}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-500"><Code size={10} />{member.lang || "n/a"}</span>
            {member.tags?.map((tag) => <span key={tag} className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-700">{tag}</span>)}
          </div>
        </div>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Published projects</h2>
            <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500">{projects.length}</span>
          </div>
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <FolderKanban className="mx-auto mb-3 text-blue-400" size={32} />
              <p className="font-mono text-sm text-slate-500">No public projects yet.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article key={project.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900">{project.title}</h3>
                    {project.featured && <span className="flex shrink-0 items-center gap-1 rounded bg-amber-50 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-700"><Star size={10} />FEATURED</span>}
                  </div>
                  <p className="mt-2 flex-1 text-sm text-slate-500">{project.summary || project.description || "No summary added."}</p>
                  {project.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-1">{project.tags.map((tag) => <span key={tag} className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-700">{tag}</span>)}</div>
                  ) : null}
                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                    {project.project_url && <a href={project.project_url} target="_blank" rel="noreferrer" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center font-mono text-xs text-slate-600 hover:bg-slate-50">live</a>}
                    {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center font-mono text-xs text-slate-600 hover:bg-slate-50">code</a>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
