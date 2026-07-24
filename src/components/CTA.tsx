"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Lock } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="join"
      ref={ref}
      className="border-t border-gray-100 px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-8 py-16 text-center sm:px-16"
        >
          <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-gray-200/40 blur-[100px]" />

          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <Lock className="text-gray-400" size={28} />
            </div>

            <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
              Currently closed
            </h2>
            <p className="mx-auto mt-4 max-w-md text-gray-500 leading-relaxed">
              We&apos;re not accepting new members right now. Check back later
              or reach out to a current member for more info.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
