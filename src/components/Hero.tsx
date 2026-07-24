"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <motion.h1
          variants={childVariants}
          className="text-balance text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
        >
          Where developers{" "}
          <span className="text-blue-500">connect & build</span> together
        </motion.h1>

        <motion.p
          variants={childVariants}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500"
        >
          tech_pals is a thriving community of engineers, designers, and
          tech enthusiasts sharing knowledge, collaborating on real projects,
          and leveling up together.
        </motion.p>

        <motion.div variants={childVariants} className="mt-10">
          <button
            onClick={() => handleScroll("#members")}
            className="group relative inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-md active:scale-[0.97]"
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 transition-all group-hover:from-blue-50 group-hover:via-blue-50/50 group-hover:to-blue-50" />
            <span className="relative z-10 flex items-center gap-2">
              Explore Members
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
