"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Code, Handshake, Terminal, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Code,
    filename: "workshops.ts",
    language: "typescript",
    title: "Workshops & Hackathons",
    desc: "Regular hands-on sessions covering the latest tech stacks, best practices, and collaborative coding challenges.",
    code: `// Workshops & Hackathons
const workshop = {
  topics: ["Next.js", "AI", "DevOps"],
  schedule: "Bi-weekly",
  collaborative: true,
  action: () => "build_cool_stuff()"
};`
  },
  {
    icon: Handshake,
    filename: "networking.go",
    language: "go",
    title: "Networking Events",
    desc: "Connect with like-minded developers, share experiences, and build lasting professional relationships.",
    code: `/* Networking & Connection */
package community

func SyncUp() {
    devs := GetCuriousMinds()
    for _, peer := range devs {
        Connect(peer.Talents)
        ShareExperiences()
    }
}`
  },
  {
    icon: Terminal,
    filename: "open_source.py",
    language: "python",
    title: "Open Source Projects",
    desc: "Contribute to real-world open source initiatives with mentorship from experienced maintainers.",
    code: `# Open Source Projects
def contribute(project_name):
    mentor = get_maintainer()
    while not code_built:
        write_code()
        pr = submit_pull_request()
        mentor.review(pr)
    print("Shipped to production!")`
  },
  {
    icon: Lightbulb,
    filename: "learning.rs",
    language: "rust",
    title: "Knowledge Sharing",
    desc: "Learn from peer-led talks, blog posts, and curated resources tailored for every skill level.",
    code: `// Knowledge sharing
pub fn share_insights() {
    let talks = peer_led_talks();
    for topic in talks {
        let digest = topic.synthesize();
        publish_knowledge(digest);
        println!("Level up!");
    }
}`
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section
      id="about"
      ref={ref}
      className="border-t border-slate-200 bg-[#f8fafc] px-6 py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background radial elements */}
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/[0.02] blur-[120px]" />
      
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="mb-2 block text-xs font-mono font-semibold uppercase tracking-widest text-blue-600">
            [01] OUR_MISSION
          </span>
          <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl">
            Building coding ecosystems, together
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We believe the best technology is built together. tech_pals brings
            together curious minds from every corner of the industry —
            frontend, backend, cloud, AI, and security — to learn, build, and
            grow as a community.
          </p>
        </motion.div>

        {/* Dynamic IDE mockup section */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* File Explorer sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="font-mono text-xs text-slate-400 px-2 uppercase tracking-widest mb-1 select-none">
              Workspace Files
            </div>
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isActive = activeTab === i;
              return (
                <button
                  key={feature.title}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-3 w-full text-left rounded-lg p-3.5 border transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50/60 border-blue-200 text-blue-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50/50"
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-md ${isActive ? 'bg-blue-100/60 text-blue-600' : 'bg-slate-100 text-slate-450'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <span>src/</span>
                      <span className={isActive ? "text-blue-600" : "text-slate-500"}>{feature.filename}</span>
                    </div>
                    <h3 className="text-sm font-semibold mt-0.5">{feature.title}</h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* IDE Editor View */}
          <div className="lg:col-span-8 flex flex-col rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-100/50 overflow-hidden backdrop-blur-sm">
            {/* Editor tab header */}
            <div className="flex h-11 items-center border-b border-slate-150 bg-slate-50/80 px-4 justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-mono text-xs text-slate-600 font-medium">
                  {features[activeTab].filename}
                </span>
                <span className="font-mono text-[10px] text-slate-500 bg-slate-150/60 px-1.5 py-0.5 rounded">
                  {features[activeTab].language}
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">UTF-8</span>
            </div>

            {/* Editor Content split */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-150 min-h-[300px]">
              {/* Description Panel */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-blue-600 uppercase tracking-widest font-semibold block mb-2">
                    // module description
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mb-3">
                    {features[activeTab].title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {features[activeTab].desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Mentors: OK</span>
                  <span>Stack: Ready</span>
                </div>
              </div>

              {/* Code Panel */}
              <div className="bg-[#fafbfc] p-6 font-mono text-xs overflow-x-auto relative flex flex-col justify-center border-l border-slate-100">
                <div className="absolute top-2 right-3 text-[10px] text-slate-400 pointer-events-none">
                  READONLY
                </div>
                {/* Syntax Highlighted Lines */}
                <pre className="text-slate-800">
                  {features[activeTab].code.split("\n").map((line, idx) => {
                    let lineClass = "text-slate-700";
                    if (line.startsWith("//") || line.startsWith("/*") || line.startsWith("#") || line.endsWith("*/")) {
                      lineClass = "text-slate-400 italic";
                    } else if (line.includes("const ") || line.includes("package ") || line.includes("def ") || line.includes("pub fn ")) {
                      lineClass = "text-purple-600 font-semibold";
                    } else if (line.includes("topics:") || line.includes("schedule:") || line.includes("collaborative:")) {
                      lineClass = "text-blue-600";
                    } else if (line.includes("func ") || line.includes("println!") || line.includes("print(")) {
                      lineClass = "text-blue-500";
                    } else if (line.includes("struct") || line.includes("interface")) {
                      lineClass = "text-amber-600 font-semibold";
                    }
                    return (
                      <div key={idx} className="flex gap-4">
                        <span className="text-slate-300 w-4 text-right select-none">{idx + 1}</span>
                        <span className={lineClass}>{line}</span>
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
