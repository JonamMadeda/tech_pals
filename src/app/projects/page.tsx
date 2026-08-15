"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Code2, ExternalLink, FolderKanban, Github, Search, SlidersHorizontal, Star, X } from "lucide-react";

type Project = { id: number; title: string; summary: string; description: string; image_url: string; project_url: string; github_url: string; tags: string[] | null; featured: boolean; created_at: string; member_name: string; member_avatar: string; member_title: string };
type Sort = "newest" | "featured" | "alphabetical";

function ProjectImage({ project, featured = false }: { project: Project; featured?: boolean }) {
  return project.image_url ? <img src={project.image_url} alt="" className={`w-full object-cover ${featured ? "h-52" : "h-40"}`} /> : <div className={`flex w-full items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 ${featured ? "h-52" : "h-40"}`}><FolderKanban size={featured ? 42 : 32} className="text-blue-400" /></div>;
}

function ProjectCard({ project, onReadMore, featured = false }: { project: Project; onReadMore: (p: Project) => void; featured?: boolean }) {
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = summaryRef.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight);
  }, [project.summary, project.description]);

  const text = project.summary || project.description || "Explore this community build.";

  return (
    <article className={`group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md ${featured ? "h-[360px]" : "h-[360px]"}`}>
      <ProjectImage project={project} featured={featured} />
      <div className="flex flex-1 flex-col p-5">
        {featured && <p className="font-mono text-[10px] text-slate-400">{project.member_avatar || project.member_name.slice(0, 2).toUpperCase()} · {project.member_name}</p>}
        {!featured && (
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] text-slate-400">{project.member_avatar || project.member_name.slice(0, 2).toUpperCase()} · {project.member_name}</p>
              <h2 className="mt-2 text-lg font-bold text-slate-900">{project.title}</h2>
            </div>
            <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${project.project_url ? "bg-cyan-50 text-cyan-700" : "bg-slate-100 text-slate-600"}`}>{project.project_url ? "live" : "project"}</span>
          </div>
        )}
        {featured && <h2 className="mt-3 text-xl font-bold text-slate-900">{project.title}</h2>}
        <div className="relative mt-2 flex-1">
          <p ref={summaryRef} className="line-clamp-2 text-sm leading-relaxed text-slate-600">{text}</p>
          {overflows && (
            <button onClick={() => onReadMore(project)} className="mt-1 font-mono text-xs font-bold text-blue-600 hover:text-blue-700">Read More</button>
          )}
        </div>
        <div className={`mt-auto ${featured ? "flex items-center justify-between pt-4" : ""}`}>
          {!featured && <div className="mb-3 flex flex-wrap gap-1.5">{project.tags?.map((tag) => <span key={tag} className="rounded border border-blue-100 bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-700">{tag}</span>)}</div>}
          {featured && <div className="flex flex-wrap gap-1">{project.tags?.slice(0, 3).map((tag) => <span key={tag} className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-700">{tag}</span>)}</div>}
          {featured && project.project_url && <a href={project.project_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700"><ArrowUpRight size={17} /></a>}
          {!featured && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="font-mono text-[10px] text-slate-400">{new Date(project.created_at).toLocaleDateString()}</span>
              <div className="flex gap-3">
                {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-slate-500 hover:text-blue-600"><Github size={14} />code</a>}
                {project.project_url && <a href={project.project_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-slate-500 hover:text-blue-600"><ExternalLink size={14} />demo</a>}
                {!project.github_url && !project.project_url && <Code2 size={14} className="text-slate-300" />}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [sort, setSort] = useState<Sort>("newest");
  const [modalProject, setModalProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setProjects(data.projects ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (modalProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modalProject]);

  const tags = useMemo(() => ["ALL", ...Array.from(new Set(projects.flatMap((project) => project.tags ?? []))).sort()], [projects]);

  const visibleProjects = useMemo(
    () =>
      projects
        .filter((project) => {
          const text = `${project.title} ${project.summary} ${project.description} ${project.member_name}`.toLowerCase();
          return text.includes(query.toLowerCase()) && (selectedTag === "ALL" || project.tags?.includes(selectedTag));
        })
        .sort((left, right) =>
          sort === "alphabetical"
            ? left.title.localeCompare(right.title)
            : sort === "featured"
              ? Number(right.featured) - Number(left.featured) || new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
              : new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
        ),
    [projects, query, selectedTag, sort]
  );

  const featured = projects.filter((project) => project.featured).slice(0, 2);

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
            <Link href="/news" className="rounded border border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-50">news</Link>
            <Link href="/member" className="rounded bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700">member area</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10 max-w-2xl">
          <span className="font-mono text-xs font-semibold tracking-widest text-blue-600">[ COMMUNITY_BUILDS ]</span>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">Projects worth sharing.</h1>
          <p className="mt-4 leading-relaxed text-slate-600">Explore products, experiments, and open-source work from the tech_pals community.</p>
        </div>

        {!loading && featured.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <Star size={15} className="fill-amber-400 text-amber-500" />
              <h2 className="font-mono text-xs font-bold tracking-widest text-slate-600">FEATURED_BUILDS</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((project) => <ProjectCard key={project.id} project={project} onReadMore={setModalProject} featured />)}
            </div>
          </section>
        )}

        <section>
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, people, or tools" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 font-mono text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white" />
            </div>
            <div className="flex flex-wrap gap-2">{tags.map((tag) => <button key={tag} onClick={() => setSelectedTag(tag)} className={`rounded px-2.5 py-1.5 font-mono text-[10px] font-semibold transition ${selectedTag === tag ? "border border-blue-200 bg-blue-50 text-blue-700" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{tag.toLowerCase()}</button>)}</div>
            <label className="flex items-center gap-2 font-mono text-xs text-slate-500">
              <SlidersHorizontal size={14} />
              <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="rounded border border-slate-200 bg-white px-2 py-1.5 outline-none">
                <option value="newest">newest</option>
                <option value="featured">featured first</option>
                <option value="alphabetical">A–Z</option>
              </select>
            </label>
          </div>

          {loading ? (
            <p className="font-mono text-sm text-slate-500">$ loading projects...</p>
          ) : visibleProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <FolderKanban className="mx-auto mb-3 text-blue-400" size={32} />
              <h2 className="font-bold text-slate-800">No projects found.</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Try another search or publish a project from your member workspace.</p>
              <Link href="/member" className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 font-mono text-xs font-bold text-white hover:bg-blue-700">publish a project <ArrowUpRight size={14} /></Link>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between font-mono text-[11px] text-slate-400">
                <span>PROJECT_DIRECTORY</span>
                <span>{visibleProjects.length} results</span>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onReadMore={setModalProject} />)}
              </div>
            </>
          )}
        </section>
      </main>

      <AnimatePresence>
        {modalProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setModalProject(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }} className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setModalProject(null)} className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X size={18} /></button>
              <p className="font-mono text-[10px] text-slate-400">{modalProject.member_avatar || modalProject.member_name.slice(0, 2).toUpperCase()} · {modalProject.member_name}</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{modalProject.title}</h2>
              <div className="mt-4 flex flex-wrap gap-1.5">{modalProject.tags?.map((tag) => <span key={tag} className="rounded border border-blue-100 bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-700">{tag}</span>)}</div>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
                {modalProject.summary && <p>{modalProject.summary}</p>}
                {modalProject.description && modalProject.description !== modalProject.summary && <p>{modalProject.description}</p>}
                {!modalProject.summary && !modalProject.description && <p>Explore this community build.</p>}
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                {modalProject.github_url && <a href={modalProject.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs font-semibold text-slate-600 hover:bg-slate-50"><Github size={14} />view code</a>}
                {modalProject.project_url && <a href={modalProject.project_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 font-mono text-xs font-bold text-white hover:bg-blue-700"><ExternalLink size={14} />live demo</a>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
