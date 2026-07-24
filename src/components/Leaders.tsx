"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Key, Shield, User, Terminal } from "lucide-react";

const leaders = [
  {
    name: "Chris J. Madeda",
    role: "Leader & DevOps Engineer",
    avatar: "CJM",
    sshKey: "SHA256:d3v0ps...",
    status: "online",
    bio: "Automating pipelines, writing cloud templates, and managing server clusters.",
  },
  {
    name: "Festus Omuga",
    role: "Co-Leader & Machine Learning",
    avatar: "FO",
    sshKey: "SHA256:pyt0rch...",
    status: "online",
    bio: "Training deep models, fine-tuning LLMs, and building predictive features.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Leaders() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="leaders"
      ref={ref}
      className="border-t border-slate-200 bg-[#f8fafc] px-6 py-24 md:py-32 relative"
    >
      {/* Background elements */}
      <div className="pointer-events-none absolute top-10 right-10 h-80 w-80 rounded-full bg-blue-500/[0.01] blur-[100px]" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="mb-2 block text-xs font-mono font-semibold uppercase tracking-widest text-blue-600">
            [02] LEADERSHIP_SSH
          </span>
          <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl">
            Core Group Maintainers
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Meet the maintainers who keep tech_pals running — managing servers, hosting dev events, and reviewing core repositories.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-8 md:grid-cols-2"
        >
          {leaders.map((leader) => (
            <motion.div
              key={leader.name}
              variants={cardVariants}
              whileHover={{ y: -6, borderColor: "rgba(59, 130, 246, 0.3)" }}
              className="relative group rounded-xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-100/60 backdrop-blur-sm transition-all duration-300 overflow-hidden"
            >
              {/* Top border neon line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* SSH Session style container */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar with status indicator */}
                    <div className="relative">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-base font-mono font-bold text-blue-700">
                        {leader.avatar}
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-cyan-500 animate-pulse" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        {leader.name}
                      </h3>
                      <p className="text-xs font-mono text-blue-600">
                        {leader.role}
                      </p>
                    </div>
                  </div>

                  {/* SSH status indicator badge */}
                  <span className="rounded bg-cyan-50 border border-cyan-200 px-2 py-0.5 text-[10px] font-mono text-cyan-700 uppercase tracking-widest">
                    {leader.status}
                  </span>
                </div>

                {/* Profile credentials */}
                <div className="space-y-3 font-mono text-xs text-slate-500">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 flex items-center gap-1.5"><Key size={12} /> SSH_KEY:</span>
                    <span className="text-slate-700">{leader.sshKey}</span>
                  </div>
                  <div className="flex items-start gap-1.5 border-b border-slate-100 pb-2">
                    <span className="text-slate-400 flex items-center gap-1.5 shrink-0"><Terminal size={12} /> ABOUT:</span>
                    <span className="text-slate-700 font-sans pl-1">{leader.bio}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-slate-400 flex items-center gap-1.5"><Shield size={12} /> AUTH:</span>
                    <span className="text-slate-700 text-[10px] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">root@tech_pals</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
