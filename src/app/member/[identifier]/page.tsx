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
  Hash,
  Linkedin,
  Star,
  Terminal,
  ExternalLink,
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

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[11px] font-bold tracking-widest text-primary-600">
      {children}
    </p>
  );
}

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
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8fafc]">
        <div className="text-center">
          <Terminal size={20} className="mx-auto mb-3 animate-pulse text-primary-400" />
          <p className="font-mono text-xs text-slate-400">
            <span className="text-primary-600">$</span> fetching profile...
          </p>
        </div>
      </div>
    );
  }

  if (state === "notfound" || !member) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8fafc] px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-mono text-xs font-bold tracking-widest text-red-500">[ 404_NOT_FOUND ]</p>
          <h1 className="mt-3 text-xl font-bold text-slate-900">No such member.</h1>
          <p className="mt-2 text-sm text-slate-500">This handle does not exist in the registry.</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-mono text-xs font-bold text-white transition-colors hover:bg-primary-700">
            <ArrowLeft size={14} />back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-mono text-lg font-bold text-slate-900">
            <span className="text-primary-500">&lt;</span>tech<span className="text-primary-600">_pals</span><span className="text-primary-500"> /&gt;</span>
          </Link>
          <Link href="/#members" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs text-slate-600 transition-colors hover:bg-slate-50">
            <ArrowLeft size={13} />members list
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {/* Header row */}
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <Terminal size={15} className="text-primary-600" />
              <span className="font-mono text-xs font-bold text-slate-900">[ PUBLIC_PROFILE ]</span>
            </div>
            <Link href="/#members" className="font-mono text-[11px] font-semibold text-primary-600 transition-colors hover:text-primary-700">
              &lt;- back
            </Link>
          </div>

          {/* Identity */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="shrink-0">
              {member.avatar.startsWith("data:") || member.avatar.startsWith("http") ? (
                <img src={member.avatar} alt={member.name} className="h-20 w-20 rounded-2xl border border-slate-200 object-cover sm:h-24 sm:w-24" />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl border border-primary-100 bg-primary-50 font-mono text-2xl font-bold text-primary-700 sm:h-24 sm:w-24">{member.avatar || member.name.slice(0, 2).toUpperCase()}</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">{member.name}</h1>
                <span className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${member.role === "leader" ? "bg-purple-100 text-purple-700" : "bg-primary-100 text-primary-700"}`}>{member.role}</span>
                {member.username && (
                  <span className="flex shrink-0 items-center gap-0.5 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500">
                    <Hash size={9} />
                    {member.username}
                  </span>
                )}
              </div>
              <p className="mt-1 font-mono text-xs text-slate-500 sm:text-sm">{member.title || "member"}</p>
              <div className="mt-3 flex items-center gap-2">
                {member.github && <a href={member.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"><Github size={16} /></a>}
                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"><Linkedin size={16} /></a>}
                {member.website && <a href={member.website} target="_blank" rel="noreferrer" aria-label="Website" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"><Globe size={16} /></a>}
              </div>
            </div>

            {/* Activity stats */}
            <div className="w-full sm:w-72">
              <SectionLabel>ACTIVITY</SectionLabel>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
                  <GitPullRequest size={14} className="mx-auto text-primary-500" />
                  <p className="mt-1.5 truncate text-sm font-bold text-slate-900 sm:text-base">{member.prs}</p>
                  <p className="font-mono text-[9px] font-semibold tracking-widest text-slate-400 sm:text-[10px]">PRS</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
                  <Code size={14} className="mx-auto text-primary-500" />
                  <p className="mt-1.5 truncate text-sm font-bold text-slate-900 sm:text-base">{member.commits}</p>
                  <p className="font-mono text-[9px] font-semibold tracking-widest text-slate-400 sm:text-[10px]">COMMITS</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
                  <CalendarDays size={14} className="mx-auto text-primary-500" />
                  <p className="mt-1.5 truncate text-sm font-bold text-slate-900 sm:text-base" title={new Date(member.created_at).toLocaleDateString()}>{new Date(member.created_at).toLocaleDateString()}</p>
                  <p className="font-mono text-[9px] font-semibold tracking-widest text-slate-400 sm:text-[10px]">JOINED</p>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          {member.bio && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <SectionLabel>ABOUT</SectionLabel>
              <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                {member.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {(member.lang || member.tags?.length) && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <SectionLabel>SKILLS</SectionLabel>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                {member.lang && (
                  <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-700">
                    <Terminal size={11} className="text-primary-600" />
                    {member.lang}
                  </span>
                )}
                {member.tags?.map((tag) => (
                  <span key={tag} className="rounded-lg border border-primary-100 bg-primary-50 px-2.5 py-1 font-mono text-[10px] font-medium text-primary-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] font-bold tracking-widest text-primary-600">PROJECTS</p>
            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-500">{projects.length}</span>
          </div>
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <FolderKanban className="mx-auto mb-3 text-primary-400" size={32} />
              <p className="font-mono text-xs text-slate-500">No public projects yet.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {projects.map((project) => (
                <article key={project.id} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900 sm:text-base">{project.title}</h3>
                    {project.featured && (
                      <span className="flex shrink-0 items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[8px] font-bold text-amber-700 sm:text-[9px]">
                        <Star size={9} />
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500 sm:text-sm">{project.summary || project.description || "No summary added."}</p>
                  {project.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded bg-primary-50 px-1.5 py-0.5 font-mono text-[9px] text-primary-700 sm:text-[10px]">{tag}</span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                    {project.project_url && (
                      <a href={project.project_url} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-center font-mono text-[11px] text-slate-600 transition-colors hover:bg-slate-50">
                        <ExternalLink size={11} />live
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-center font-mono text-[11px] text-slate-600 transition-colors hover:bg-slate-50">
                        <Github size={11} />code
                      </a>
                    )}
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