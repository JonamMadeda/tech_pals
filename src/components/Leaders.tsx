"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const leaders = [
  {
    name: "Chris J. Madeda",
    role: "DevOps Engineer",
    bio: "Automating infrastructure and streamlining deployments to keep pipelines flowing.",
    avatar: "CJM",
    github: "#",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Festus Omuga",
    role: "Machine Learning",
    bio: "Building intelligent models and exploring data-driven solutions to real-world problems.",
    avatar: "FO",
    github: "#",
    linkedin: "#",
    twitter: "#",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Leaders() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="leaders"
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
            Leadership
          </span>
          <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
            Group leaders
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Meet the people who keep tech_pals running — organizing events,
            leading workshops, and fostering a welcoming space for everyone.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {leaders.map((leader) => (
            <motion.div
              key={leader.name}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              {/* Avatar placeholder */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">
                {leader.avatar}
              </div>

              <h3 className="text-base font-semibold text-gray-900">
                {leader.name}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-blue-600">
                {leader.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {leader.bio}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href={leader.github}
                  className="text-gray-400 transition-colors hover:text-gray-700"
                  aria-label={`${leader.name} GitHub`}
                >
                  <Github size={16} />
                </a>
                <a
                  href={leader.linkedin}
                  className="text-gray-400 transition-colors hover:text-gray-700"
                  aria-label={`${leader.name} LinkedIn`}
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href={leader.twitter}
                  className="text-gray-400 transition-colors hover:text-gray-700"
                  aria-label={`${leader.name} Twitter`}
                >
                  <Twitter size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
