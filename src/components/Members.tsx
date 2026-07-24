"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Github, Linkedin } from "lucide-react";

const members = [
  {
    name: "Arthur",
    avatar: "A",
    role: "Cloud Engineer",
    bio: "Building and managing cloud infrastructure for scalable applications.",
    tags: ["AWS", "Terraform", "Docker"],
    github: "#",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Caleb",
    avatar: "C",
    role: "Cyber Security",
    bio: "Identifying vulnerabilities and strengthening defense mechanisms.",
    tags: ["Ethical Hacking", "Forensics", "Linux"],
    github: "#",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Sydney",
    avatar: "S",
    role: "Cloud Engineer",
    bio: "Designing resilient cloud architectures and automating deployments.",
    tags: ["GCP", "Kubernetes", "CI/CD"],
    github: "#",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Prince",
    avatar: "P",
    role: "Game Developer",
    bio: "Creating immersive game experiences with modern engines and tools.",
    tags: ["Unity", "C#", "Blender"],
    github: "#",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Melvin",
    avatar: "M",
    role: "Cyber Security",
    bio: "Protecting systems and data through proactive security practices.",
    tags: ["Pen Testing", "Network Security", "Python"],
    github: "#",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Kelvin",
    avatar: "K",
    role: "Cloud Engineer",
    bio: "Optimizing cloud costs and performance across multi-cloud environments.",
    tags: ["Azure", "DevOps", "Monitoring"],
    github: "#",
    linkedin: "#",
    website: "#",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Members() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="members"
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
            Community
          </span>
          <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
            Members showcase
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            A glimpse at the talented folks who make tech_pals what it is.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {members.map((member) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-sm font-bold text-white">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {member.role}
                  </p>
                  <div className="mt-2 flex items-center gap-2.5">
                    <a
                      href={member.github}
                      className="text-gray-400 transition-colors hover:text-gray-700"
                      aria-label={`${member.name} GitHub`}
                    >
                      <Github size={14} />
                    </a>
                    <a
                      href={member.linkedin}
                      className="text-gray-400 transition-colors hover:text-gray-700"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin size={14} />
                    </a>
                    <a
                      href={member.website}
                      className="text-gray-400 transition-colors hover:text-gray-700"
                      aria-label={`${member.name} Website`}
                    >
                      <Globe size={14} />
                    </a>
                  </div>
                </div>
              </div>

              <p className="mb-3 text-sm leading-relaxed text-gray-500">
                {member.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {member.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
