"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code, Handshake, Lightbulb, Terminal } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Workshops & Hackathons",
    desc: "Regular hands-on sessions covering the latest tech stacks, best practices, and collaborative coding challenges.",
  },
  {
    icon: Handshake,
    title: "Networking Events",
    desc: "Connect with like-minded developers, share experiences, and build lasting professional relationships.",
  },
  {
    icon: Terminal,
    title: "Open Source Projects",
    desc: "Contribute to real-world open source initiatives with mentorship from experienced maintainers.",
  },
  {
    icon: Lightbulb,
    title: "Knowledge Sharing",
    desc: "Learn from peer-led talks, blog posts, and curated resources tailored for every skill level.",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      className="border-t border-gray-100 px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-blue-600">
            About
          </span>
          <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
            Our mission
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            We believe the best technology is built together. tech_pals brings
            together curious minds from every corner of the industry —
            frontend, backend, cloud, AI, and beyond — to learn, build, and
            grow as a community.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
