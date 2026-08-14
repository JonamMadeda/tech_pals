"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, FolderKanban } from "lucide-react";

type Project = { id: number; user_id: number; title: string; summary: string; tags: string[] | null; member_name: string; member_avatar: string };

function ProjectCard({ project, index, inView }: { project: Project; index: number; inView: boolean }) {
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const element = summaryRef.current;
    if (element) setOverflows(element.scrollHeight > element.clientHeight);
  }, [project.summary]);

  return (
    <motion.article
      key={project.id}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      className="flex h-72 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <p className="font-mono text-[10px] text-slate-400">{project.member_avatar || project.member_name.slice(0, 2).toUpperCase()} · {project.member_name}</p>
      <h3 className="mt-4 font-bold text-slate-900">{project.title}</h3>
      <p ref={summaryRef} className="mt-2 line-clamp-4 text-sm leading-relaxed text-slate-600">{project.summary || "Explore this community project."}</p>
      <div className="mt-4 flex flex-wrap gap-1">{project.tags?.slice(0, 3).map((tag) => <span key={tag} className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-700">{tag}</span>)}</div>
      {overflows && <Link href={`/member/${project.user_id}`} className="mt-auto inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-600 hover:text-blue-700">Read More <ArrowUpRight size={13} /></Link>}
    </motion.article>
  );
}

export default function ProjectsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setProjects((data.projects ?? []).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} className="border-t border-slate-200 bg-white px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-semibold tracking-widest text-blue-600">[04] RECENT_BUILDS</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">What the community is building.</h2>
            <p className="mt-3 text-slate-600">Fresh work from member portfolios, updated automatically as projects are published.</p>
          </div>
          <Link href="/projects" className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-blue-600 hover:text-blue-700">view all projects <ArrowUpRight size={14} /></Link>
        </motion.div>
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <FolderKanban className="mx-auto mb-3 text-blue-400" size={28} />
            <p className="font-mono text-sm text-slate-500">Projects added by members will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} inView={inView} />)}
          </div>
        )}
      </div>
    </section>
  );
}
