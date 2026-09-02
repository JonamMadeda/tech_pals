"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Github,
  Linkedin,
  Globe,
  CalendarDays,
  Code,
  GitPullRequest,
  Star,
  ExternalLink,
  ArrowUpRight,
  Terminal,
  Hash,
} from "lucide-react";

type MemberDetail = {
  id: number;
  username: string | null;
  name: string;
  avatar: string;
  role: string;
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

type Project = {
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

type MemberModalProps = {
  identifier: string;
  onClose: () => void;
};

function Avatar({ member }: { member: MemberDetail }) {
  if (member.avatar.startsWith("data:") || member.avatar.startsWith("http")) {
    return (
      <img
        src={member.avatar}
        alt={member.name}
        className="h-14 w-14 rounded-xl border border-slate-200 object-cover sm:h-16 sm:w-16"
      />
    );
  }
  return (
    <div className="grid h-14 w-14 place-items-center rounded-xl border border-primary-100 bg-primary-50 font-mono text-lg font-bold text-primary-700 sm:h-16 sm:w-16 sm:text-xl">
      {member.avatar || member.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  title,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  title?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
      <Icon size={14} className="mx-auto text-primary-500" />
      <p
        className="mt-1.5 truncate text-sm font-bold text-slate-900 sm:text-base"
        title={title ?? String(value)}
      >
        {value}
      </p>
      <p className="font-mono text-[9px] font-semibold tracking-widest text-slate-400 sm:text-[10px]">
        {label}
      </p>
    </div>
  );
}

export default function MemberModal({ identifier, onClose }: MemberModalProps) {
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/members/by-handle/${encodeURIComponent(identifier)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("not found"))))
      .then((data) => {
        setMember(data.member);
        setProjects(data.projects ?? []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [identifier]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6"
      >
        <button
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          aria-label="Close"
        />
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-3.5 backdrop-blur sm:px-6">
            <div className="flex items-center gap-2">
              <Terminal size={15} className="text-primary-600" />
              <span className="font-mono text-xs font-bold text-slate-900">
                [ MEMBER_PROFILE ]
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X size={17} />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            {loading && (
              <div className="grid place-items-center py-16">
                <div className="text-center">
                  <Terminal size={20} className="mx-auto mb-3 text-primary-400 animate-pulse" />
                  <p className="font-mono text-xs text-slate-400">
                    <span className="text-primary-600">$</span> fetching profile...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="grid place-items-center py-16">
                <div className="text-center">
                  <p className="font-mono text-xs font-bold tracking-widest text-red-500">
                    [ CONNECTION_ERROR ]
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Could not load member profile.</p>
                  <button
                    onClick={onClose}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 font-mono text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                  >
                    close
                  </button>
                </div>
              </div>
            )}

            {member && (
              <div className="space-y-6">
                {/* Identity */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <Avatar member={member} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h3 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                        {member.name}
                      </h3>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          member.role === "leader"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-primary-100 text-primary-700"
                        }`}
                      >
                        {member.role}
                      </span>
                      {member.username && (
                        <span className="flex shrink-0 items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                          <Hash size={9} />
                          {member.username}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-xs text-slate-500 sm:text-sm">
                      {member.title || "member"}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2.5">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="GitHub"
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        >
                          <Github size={15} />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="LinkedIn"
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        >
                          <Linkedin size={15} />
                        </a>
                      )}
                      {member.website && (
                        <a
                          href={member.website}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Website"
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        >
                          <Globe size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Activity stats */}
                <div>
                  <p className="mb-2 font-mono text-[11px] font-bold tracking-widest text-primary-600">
                    ACTIVITY
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    <StatCard
                      icon={GitPullRequest}
                      value={member.prs}
                      label="PRS"
                    />
                    <StatCard
                      icon={Code}
                      value={member.commits}
                      label="COMMITS"
                    />
                    <StatCard
                      icon={CalendarDays}
                      value={new Date(member.created_at).toLocaleDateString()}
                      label="JOINED"
                      title={new Date(member.created_at).toLocaleDateString()}
                    />
                  </div>
                </div>

                {/* Bio */}
                {member.bio && (
                  <div>
                    <p className="mb-2 font-mono text-[11px] font-bold tracking-widest text-primary-600">
                      ABOUT
                    </p>
                    <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {member.bio}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {(member.lang || member.tags?.length) && (
                  <div>
                    <p className="mb-2 font-mono text-[11px] font-bold tracking-widest text-primary-600">
                      SKILLS
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {member.lang && (
                        <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-700">
                          <Terminal size={11} className="text-primary-600" />
                          {member.lang}
                        </span>
                      )}
                      {member.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-primary-100 bg-primary-50 px-2.5 py-1 font-mono text-[10px] font-medium text-primary-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                  <div className="border-t border-slate-100 pt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-mono text-[11px] font-bold tracking-widest text-primary-600">
                        PROJECTS
                      </p>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
                        {projects.length}
                      </span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="group flex flex-col rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-primary-200 hover:shadow-sm sm:p-4"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">
                              {project.title}
                            </h5>
                            <div className="flex shrink-0 items-center gap-1">
                              {project.featured && (
                                <span className="flex items-center gap-0.5 rounded bg-amber-50 px-1 py-0.5 font-mono text-[8px] font-bold text-amber-700">
                                  <Star size={8} />
                                  FEATURED
                                </span>
                              )}
                              {project.project_url && (
                                <a
                                  href={project.project_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded p-1 text-slate-400 transition-colors hover:text-primary-600"
                                  aria-label="Open project"
                                >
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          </div>
                          <p className="mt-1.5 flex-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2 sm:text-xs">
                            {project.summary || project.description || "No description."}
                          </p>
                          {project.tags && project.tags.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {project.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded bg-primary-50 px-1.5 py-0.5 font-mono text-[8px] font-medium text-primary-700 sm:text-[9px]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-mono text-[10px] text-slate-400">
                    ID: {member.name.toLowerCase().replace(/\s+/g, ".")}.o
                  </span>
                  <a
                    href={`/member/${member.username || member.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 font-mono text-[11px] font-bold text-white transition-colors hover:bg-primary-700"
                  >
                    View Full Profile
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
