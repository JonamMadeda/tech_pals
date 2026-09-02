"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Globe, Key, Linkedin, Shield, Terminal } from "lucide-react";

type Leader = { id: number; name: string; avatar: string; title: string; bio: string; tags: string[] | null; github: string; linkedin: string; website: string };

export default function Leaders() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members?role=leader")
      .then((response) => response.json())
      .then((data) => setLeaders(data.members ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="leaders" ref={ref} className="relative border-t border-slate-200 bg-[#fafaf8] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="mb-10 max-w-2xl"
        >
          <span className="mb-3 block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Community leadership</span>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.025em] text-slate-900 sm:text-4xl">Core group maintainers</h2>
          <p className="mt-4 leading-7 text-slate-600">The members currently trusted to guide the community, review core work, and help others build.</p>
        </motion.div>

        {loading ? (
          <p className="font-mono text-sm text-slate-500">Loading leadership roster…</p>
        ) : leaders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <Shield className="mx-auto mb-3 text-primary-500" size={28} />
            <p className="font-mono text-sm text-slate-500">Leadership profiles will appear here once an admin assigns the leader role.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid gap-5 md:grid-cols-2"
          >
            {leaders.map((leader) => (
              <motion.article
                key={leader.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white p-6 transition hover:border-primary-200"
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-primary-200 bg-primary-50 font-mono text-sm font-bold text-primary-700">
                      {leader.avatar || leader.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">{leader.name}</h3>
                      <p className="truncate font-mono text-xs text-primary-700">{leader.title || "Community leader"}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded border border-primary-200 bg-primary-50 px-2 py-1 font-mono text-[9px] font-bold tracking-widest text-primary-700">LEADER</span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 font-mono text-xs">
                    <span className="flex shrink-0 items-center gap-1.5 text-slate-400"><Key size={12} /> ROLE</span>
                    <span className="min-w-0 truncate rounded bg-primary-50 px-1.5 py-0.5 text-[10px] text-primary-700">maintainer@tech_pals</span>
                  </div>

                  <div className="flex gap-2 text-sm leading-relaxed text-slate-600">
                    <Terminal size={13} className="mt-1 shrink-0 text-slate-400" />
                    <p className="min-w-0 break-words">{leader.bio || "Helping guide community projects and collaborations."}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {leader.github && leader.github !== "#" && (
                      <a href={leader.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-slate-600">
                        <Github size={14} />
                      </a>
                    )}
                    {leader.linkedin && leader.linkedin !== "#" && (
                      <a href={leader.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-slate-600">
                        <Linkedin size={14} />
                      </a>
                    )}
                    {leader.website && leader.website !== "#" && (
                      <a href={leader.website} target="_blank" rel="noreferrer" aria-label="Website" className="text-slate-400 hover:text-slate-600">
                        <Globe size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
