"use client";

import { motion, useInView } from "framer-motion";
import { Code2, Handshake, Lightbulb, TerminalSquare } from "lucide-react";
import { useRef } from "react";

const features = [
  { icon: Code2, title: "Workshops & hackathons", desc: "Hands-on sessions built around practical stacks, shared challenges, and useful feedback." },
  { icon: Handshake, title: "Real connection", desc: "Meet collaborators who care about thoughtful work and long-term professional relationships." },
  { icon: TerminalSquare, title: "Open-source practice", desc: "Contribute to meaningful projects with clear ownership and room to learn by doing." },
  { icon: Lightbulb, title: "Knowledge sharing", desc: "Peer-led talks and resources that make new ideas more approachable for everyone." },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="border-t border-slate-200 bg-[#fafaf8] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45 }} className="mb-10 max-w-2xl">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">What we do</p>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.025em] text-slate-900 sm:text-4xl">A community designed around doing the work.</h2>
          <p className="mt-4 leading-7 text-slate-600">We bring together curious people across engineering, design, cloud, AI, and security to learn, build, and grow in public.</p>
        </motion.div>
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} className="grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {features.map(({ icon: Icon, title, desc }) => <motion.article key={title} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="p-6 first:pl-0 sm:px-8 sm:py-7 sm:odd:pl-0 sm:even:pr-0">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-50 text-primary-700"><Icon size={19} /></span>
            <h3 className="mt-5 text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
          </motion.article>)}
        </motion.div>
      </div>
    </section>
  );
}
