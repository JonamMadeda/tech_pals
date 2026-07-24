"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Play, FileCode, Trash2, Terminal, Shield } from "lucide-react";

const infoJson = `{
  "name": "tech_pals",
  "type": "developer_community",
  "status": "ready_to_build",
  "members": 6,
  "stack": [
    "Next.js",
    "TailwindCSS",
    "Framer Motion",
    "TypeScript"
  ],
  "mission": "connect_learn_collaborate"
}`;

const devLogs = [
  "$ npm run dev",
  "ready - started server on 0.0.0.0:3000",
  "info  - compiling client and server...",
  "event - compiled successfully in 280ms",
  "ready - routing paths ready:",
  "        /about   - OK",
  "        /leaders - OK",
  "        /members - OK",
  "info  - ready for client connections..."
];

export default function Hero() {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("bash");

  useEffect(() => {
    // Initial welcome log
    setTerminalLogs([
      "tech_pals kernel v1.0.0-stable initialized.",
      "Type a command below or click a button to run script.",
      ""
    ]);
  }, []);

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const runCommand = async (type: "dev" | "info" | "clear") => {
    if (isTyping) return;
    setIsTyping(true);

    if (type === "clear") {
      setTerminalLogs([]);
      setIsTyping(false);
      return;
    }

    if (type === "dev") {
      setTerminalLogs([]);
      for (let i = 0; i < devLogs.length; i++) {
        await new Promise((r) => setTimeout(r, 150));
        setTerminalLogs((prev) => [...prev, devLogs[i]]);
      }
    } else if (type === "info") {
      setTerminalLogs([]);
      const lines = ["$ cat info.json", ...infoJson.split("\n")];
      for (let i = 0; i < lines.length; i++) {
        await new Promise((r) => setTimeout(r, 60));
        setTerminalLogs((prev) => [...prev, lines[i]]);
      }
    }

    setIsTyping(false);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 md:py-32 bg-[#f8fafc]">
      {/* Background glow spot */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/[0.03] blur-[150px] z-0" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/[0.02] blur-[120px] z-0" />

      <div className="relative z-10 mx-auto max-w-6xl w-full grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-semibold tracking-wider text-blue-600"
          >
            <Shield size={12} className="animate-pulse" />
            <span>v1.0.0-stable</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
          >
            Where developers{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent glow-text-blue">
              connect & build
            </span>{" "}
            together
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-600"
          >
            tech_pals is a community of engineers, designers, and tech enthusiasts. We construct open-source codebases, hold knowledge shares, and levels up collaboratively in a modern, production-driven ecosystem.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <button
              onClick={() => handleScroll("#members")}
              className="group relative inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-sm shadow-blue-100 transition-all hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300 active:scale-[0.98]"
            >
              Explore Members
              <ChevronRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("terminal-drawer-trigger");
                if (el) el.click();
              }}
              className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-700 active:scale-[0.98]"
            >
              <Terminal size={14} />
              Open Shell Console
            </button>
          </motion.div>
        </div>

        {/* Right Column: Interactive Terminal Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 relative w-full rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden"
        >
          {/* Terminal Window Header */}
          <div className="flex h-11 items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors" />
              <div className="h-3 w-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors" />
              <div className="h-3 w-3 rounded-full bg-blue-400 hover:bg-blue-500 transition-colors" />
            </div>
            <div className="flex font-mono text-xs text-slate-400 select-none">
              <span className={`px-3 py-1 cursor-pointer transition-colors border-b ${activeTab === 'bash' ? 'text-slate-800 border-blue-600 bg-white font-semibold' : 'border-transparent hover:text-slate-650'}`} onClick={() => setActiveTab('bash')}>tech_pals.sh</span>
              <span className={`px-3 py-1 cursor-pointer transition-colors border-b ${activeTab === 'info' ? 'text-slate-800 border-blue-600 bg-white font-semibold' : 'border-transparent hover:text-slate-650'}`} onClick={() => { setActiveTab('info'); runCommand('info'); }}>info.json</span>
            </div>
            <div className="w-12" />
          </div>

          {/* Terminal Controls Bar */}
          <div className="flex gap-3 border-b border-slate-100 bg-[#fafbfc] px-4 py-2 text-xs">
            <button
              onClick={() => runCommand("dev")}
              disabled={isTyping}
              className="flex items-center gap-1.5 font-mono text-violet-600 hover:text-violet-750 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <Play size={12} />
              <span>run dev</span>
            </button>
            <button
              onClick={() => runCommand("info")}
              disabled={isTyping}
              className="flex items-center gap-1.5 font-mono text-cyan-600 hover:text-cyan-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <FileCode size={12} />
              <span>cat info</span>
            </button>
            <button
              onClick={() => runCommand("clear")}
              disabled={isTyping}
              className="ml-auto flex items-center gap-1.5 font-mono text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
            >
              <Trash2 size={12} />
              <span>clear</span>
            </button>
          </div>

          {/* Terminal Log Console */}
          <div className="scanlines h-64 overflow-y-auto bg-slate-50/50 p-4 font-mono text-xs leading-relaxed text-slate-700 select-text">
            {terminalLogs.map((log, i) => {
              let colorClass = "text-slate-700";
              if (log.startsWith("$")) {
                colorClass = "text-blue-600 font-semibold";
              } else if (log.includes("[OK]") || log.includes("successfully") || log.includes("ready")) {
                colorClass = "text-cyan-600 font-semibold";
              } else if (log.includes("compiled")) {
                colorClass = "text-blue-650 font-semibold";
              } else if (log.includes("kernel") || log.includes("initialized")) {
                colorClass = "text-purple-600";
              } else if (log.includes('"name"') || log.includes('"type"') || log.includes('"members"')) {
                colorClass = "text-amber-800";
              } else if (log.trim().startsWith('"') || log.trim().startsWith('[')) {
                colorClass = "text-indigo-650";
              }

              return (
                <div key={i} className={`whitespace-pre-wrap ${colorClass}`}>
                  {log}
                </div>
              );
            })}
            
            {/* Blinking prompt line */}
            <div className="flex items-center gap-1 text-blue-600 font-semibold">
              <span>$</span>
              <span className="h-4 w-2 bg-blue-600 animate-[ping_1.5s_infinite] inline-block align-middle" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
