"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { Globe, Github, Linkedin, Search, Code } from "lucide-react";
import Link from "next/link";

type Member = {
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
};

function collectTags(members: Member[]): string[] {
  const set = new Set<string>();
  members.forEach((m) => m.tags?.forEach((t) => set.add(t)));
  return ["ALL", ...Array.from(set).sort()];
}

export default function Members() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((data) => {
        if (data.members?.length) {
          setMembers(
            data.members.map((m: Member) => ({
              ...m,
              tags: m.tags ?? [],
              commits: m.commits ?? 0,
              prs: m.prs ?? 0,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allTags = collectTags(members);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === "ALL" || member.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <section
      id="members"
      ref={ref}
      className="border-t border-slate-200 bg-white px-6 py-24 md:py-32 relative"
    >
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="mb-2 block text-xs font-mono font-semibold uppercase tracking-widest text-blue-600">
            [03] MEMBERS_LIST
          </span>
          <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl">
            Members Showcase
          </h2>
          <p className="mt-4 text-slate-650 leading-relaxed">
            Our collective directory of developers, engineers, and creators. Use the tags or CLI search to filter.
          </p>
        </motion.div>

        {/* Filter Controls Panel */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border border-slate-200 bg-slate-50/50 p-4 rounded-xl backdrop-blur-sm">
          {/* CLI Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-blue-600 font-mono text-xs pointer-events-none select-none">
              $ grep -i
            </span>
            <input
              type="text"
              placeholder="query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-24 pr-4 py-2.5 font-mono text-xs text-slate-800 placeholder-slate-450 focus:border-blue-500/50 focus:outline-none transition-colors"
            />
            <Search className="absolute right-3.5 top-3 text-slate-400" size={14} />
          </div>

          {/* Tags list */}
          <div className="flex flex-wrap gap-2 max-w-xl">
            {allTags.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`rounded px-2.5 py-1 text-[11px] font-mono border transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-350 hover:text-slate-700"
                  }`}
                >
                  {isActive && <span className="mr-1 text-blue-600">✓</span>}
                  {tag.toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Members Grid Container */}
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={member.id}
                whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.3)" }}
                className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:shadow-slate-100 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 select-none">
                    <span className="font-mono text-[10px] text-slate-400">ID: {member.name.toLowerCase()}.o</span>
                    <div className="flex gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Link href={`/member/${member.username || member.id}`} className="shrink-0" aria-label={`${member.name} profile`}>
                      {member.avatar.startsWith("data:") || member.avatar.startsWith("http") ? (
                        <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-full border border-slate-200 object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-sm font-bold text-slate-500 group-hover:text-blue-600 group-hover:border-blue-200 transition-all select-none">
                          {member.avatar}
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/member/${member.username || member.id}`} className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 truncate hover:text-blue-600 transition-colors">
                            {member.name}
                          </h3>
                        </Link>
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                            member.role === "admin"
                              ? "bg-amber-100 text-amber-700"
                              : member.role === "leader"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-500 truncate mt-0.5">
                        {member.title}
                      </p>

                      <div className="mt-2.5 flex items-center gap-3">
                        {member.github && member.github !== "#" && (
                          <a
                            href={member.github}
                            className="text-slate-400 transition-colors hover:text-slate-650"
                            aria-label={`${member.name} GitHub`}
                          >
                            <Github size={13} />
                          </a>
                        )}
                        {member.linkedin && member.linkedin !== "#" && (
                          <a
                            href={member.linkedin}
                            className="text-slate-400 transition-colors hover:text-slate-650"
                            aria-label={`${member.name} LinkedIn`}
                          >
                            <Linkedin size={13} />
                          </a>
                        )}
                        {member.website && member.website !== "#" && (
                          <a
                            href={member.website}
                            className="text-slate-400 transition-colors hover:text-slate-650"
                            aria-label={`${member.name} Website`}
                          >
                            <Globe size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-sans text-slate-600 leading-relaxed min-h-[36px]">
                    {member.bio}
                  </p>
                </div>

                <div>
                  {member.tags && member.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {member.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded px-2 py-0.5 text-[9px] font-mono font-semibold bg-blue-50 border border-blue-100 text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] font-mono text-slate-450">
                    <span className="flex items-center gap-1"><Code size={10} /> {member.lang}</span>
                    <span className="text-slate-500">Commits: <strong className="text-blue-600 font-medium">{member.commits}</strong></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search Result */}
        {filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 border border-dashed border-slate-200 rounded-xl"
          >
            {loading ? (
              <p className="font-mono text-sm text-slate-400">
                <span className="text-blue-600">$</span> loading members...
              </p>
            ) : members.length === 0 ? (
              <div>
                <p className="font-mono text-sm text-slate-400 mb-2">
                  No members found in database.
                </p>
                <p className="font-mono text-xs text-slate-400">
                  Admins can add members from the{" "}
                  <a href="/dashboard" className="text-blue-600 hover:underline">
                    dashboard
                  </a>.
                </p>
              </div>
            ) : (
              <p className="font-mono text-sm text-slate-400">
                No matching profiles found. Run another grep search.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
