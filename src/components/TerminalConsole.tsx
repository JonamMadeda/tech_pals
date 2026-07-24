"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, ChevronRight } from "lucide-react";

export default function TerminalConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "tech_pals Shell Console v1.0.0",
    "Type 'help' to see list of available commands.",
    ""
  ]);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle console using Keyboard Shortcut: Ctrl + ` or Ctrl + \
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "`") || (e.ctrlKey && e.key === "\\")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll to bottom when logs update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLogs = [...logs, `$ ${cmd}`];

    if (!trimmed) {
      setLogs([...newLogs, ""]);
      return;
    }

    switch (trimmed) {
      case "help":
        setLogs([
          ...newLogs,
          "Available Commands:",
          "  help     - Display this menu",
          "  about    - Print mission statement",
          "  leaders  - Show leadership directory",
          "  members  - List community members",
          "  clear    - Clear console output",
          "  matrix   - Spawn matrix digital rain",
          ""
        ]);
        break;
      case "about":
        setLogs([
          ...newLogs,
          "Mission: Building technology together.",
          "We bring developers, engineers, and designers together",
          "to construct open-source code and level up.",
          ""
        ]);
        break;
      case "leaders":
        setLogs([
          ...newLogs,
          "Leadership Directory:",
          "-------------------------------------------",
          "• Chris J. Madeda  [Leader & DevOps]",
          "• Festus Omuga     [Co-Leader & Machine Learning]",
          "-------------------------------------------",
          ""
        ]);
        break;
      case "members":
        setLogs([
          ...newLogs,
          "Active Member Directory:",
          "  - Arthur (Cloud Engineer) [AWS, Terraform, Docker]",
          "  - Caleb (Cyber Security) [Ethical Hacking, Forensics, Linux]",
          "  - Sydney (Cloud Engineer) [GCP, Kubernetes, CI/CD]",
          "  - Prince (Game Developer) [Unity, C#, Blender]",
          "  - Melvin (Cyber Security) [Pen Testing, Network Security, Python]",
          "  - Kelvin (Cloud Engineer) [Azure, DevOps, Monitoring]",
          ""
        ]);
        break;
      case "clear":
        setLogs([]);
        break;
      case "matrix":
        setLogs([
          ...newLogs,
          "010101010101010101010101010101010101010101010101",
          "100101100101001011001010010110010100101100101001",
          "011010010110100101101001011010010110100101101001",
          "110011001100110011001100110011001100110011001100",
          "000000000000000000000000000000000000000000000000",
          "SYSTEM INTRUSION DETECTED... JUST KIDDING. WELCOME.",
          ""
        ]);
        break;
      default:
        setLogs([
          ...newLogs,
          `sh: command not found: ${trimmed}`,
          "Type 'help' to view valid commands.",
          ""
        ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputVal);
    setInputVal("");
  };

  return (
    <>
      {/* Floating activation button */}
      <button
        id="terminal-drawer-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-blue-250 bg-white text-blue-600 shadow-lg shadow-slate-200 backdrop-blur transition-all hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 active:scale-95"
        title="Open terminal console (Ctrl + `)"
      >
        <Terminal size={20} className="animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 inset-x-0 h-80 z-50 border-t border-slate-300 bg-white shadow-2xl flex flex-col font-mono text-xs text-slate-700"
          >
            {/* Console Tab header */}
            <div className="flex h-11 items-center justify-between border-b border-slate-200 bg-slate-100 px-6 select-none">
              <div className="flex items-center gap-2.5">
                <Terminal size={14} className="text-blue-600" />
                <span className="font-semibold text-slate-800">dev_console (bash)</span>
                <span className="text-slate-350">|</span>
                <span className="text-slate-500 text-[10px]">Press Ctrl + ` to toggle</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Logs Area */}
            <div className="scanlines flex-1 overflow-y-auto p-6 space-y-1.5 leading-relaxed bg-white/70">
              {logs.map((log, index) => {
                let color = "text-slate-700";
                if (log.startsWith("$")) {
                  color = "text-blue-600 font-bold";
                } else if (log.includes("help") || log.includes("-")) {
                  color = "text-slate-500";
                } else if (log.includes("Mission") || log.includes("Active Member")) {
                  color = "text-amber-700";
                } else if (log.includes("not found")) {
                  color = "text-red-600";
                } else if (log.includes("0101") || log.includes("SYSTEM INTRUSION")) {
                  color = "text-cyan-650 font-semibold";
                }
                return (
                  <div key={index} className={`whitespace-pre-wrap ${color}`}>
                    {log}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input CLI line */}
            <form
              onSubmit={handleSubmit}
              className="h-12 border-t border-slate-200 bg-slate-50 px-6 flex items-center gap-2"
            >
              <ChevronRight size={14} className="text-blue-600 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="type a command... (try 'help')"
                className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
