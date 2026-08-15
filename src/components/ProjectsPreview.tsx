"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, ExternalLink, FolderKanban, Github, X } from "lucide-react";

type Project = { id: number; user_id: number; title: string; summary: string; tags: string[] | null; member_name: string; member_avatar: string };

function ProjectCard({ project, index, inView, onReadMore }: { project: Project; index: number; inView: boolean; onReadMore: (p: Project) => void }) {
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = summaryRef.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight);
  }, [project.summary]);

  const text = project.summary || "Explore this community project.";

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      className="flex h-72 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-blue-50 font-mono text-[10px] font-bold text-blue-600">{project.member_avatar || project.member_name.slice(0, 2).toUpperCase()}</span>
        <span className="truncate font-mono text-[10px] text-slate-500">{project.member_name}</span>
      </div>

      <h3 className="mt-3 line-clamp-1 font-bold leading-snug text-slate-900">{project.title}</h3>

      <p ref={summaryRef} className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{text}</p>

      <div className="mt-auto pt-3">
        <div className="flex flex-wrap gap-1">{project.tags?.slice(0, 3).map((tag) => <span key={tag} className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-700">{tag}</span>)}</div>
        {overflows && (
          <button onClick={() => onReadMore(project)} className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] font-bold text-blue-600 hover:text-blue-700">
            Read More <ArrowUpRight size={12} />
          </button>
        )}
      </div>
    </motion.article>
  );
}

export default function ProjectsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalProject, setModalProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setProjects((data.projects ?? []).slice(0, 3)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (modalProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modalProject]);

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
            {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} inView={inView} onReadMore={setModalProject} />)}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setModalProject(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }} className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setModalProject(null)} className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X size={18} /></button>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-blue-50 font-mono text-[11px] font-bold text-blue-600">{modalProject.member_avatar || modalProject.member_name.slice(0, 2).toUpperCase()}</span>
                <span className="font-mono text-xs text-slate-500">{modalProject.member_name}</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">{modalProject.title}</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">{modalProject.tags?.map((tag) => <span key={tag} className="rounded border border-blue-100 bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-700">{tag}</span>)}</div>
              <p className="mt-5 text-sm leading-relaxed text-slate-600">{modalProject.summary || "Explore this community project."}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
