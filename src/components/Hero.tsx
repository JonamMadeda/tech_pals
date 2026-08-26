"use client";

import { motion } from "framer-motion";
import { ArrowRight, Braces, FolderKanban, Users } from "lucide-react";

const highlights = [
  { icon: FolderKanban, label: "Build together", detail: "Member-led projects" },
  { icon: Braces, label: "Learn in public", detail: "Practical knowledge shares" },
  { icon: Users, label: "Find your people", detail: "A focused local network" },
];

export default function Hero() {
  const scrollToMembers = () => document.querySelector("#members")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="border-b border-slate-200 bg-[#fafaf8] px-6 pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">A community for people who make things</p>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-slate-900 sm:text-5xl md:text-6xl">
            Better work starts with a better circle.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
            tech_pals is a focused community for developers, designers, and builders who want to learn together and ship work that matters.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="/projects" className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Explore projects <ArrowRight size={16} />
            </a>
            <button onClick={scrollToMembers} className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Meet the community
            </button>
          </div>
        </motion.div>

        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="border-l border-slate-200 pl-6 lg:pl-10">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">What happens here</p>
          <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {highlights.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-center gap-4 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-blue-50 text-blue-700"><Icon size={17} /></span>
                <div><h2 className="text-sm font-semibold text-slate-900">{label}</h2><p className="mt-0.5 text-sm text-slate-500">{detail}</p></div>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
