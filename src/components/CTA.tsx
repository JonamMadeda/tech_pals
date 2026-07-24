"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Lock, ShieldAlert, KeyRound, Terminal, RefreshCw } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "failed">("idle");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || status === "verifying") return;

    setStatus("verifying");
    setTerminalOutput([
      `$ ssh connect@tech_pals -i key.pem`,
      `Verifying credentials against central node...`
    ]);

    await new Promise((r) => setTimeout(r, 1200));

    setStatus("failed");
    setTerminalOutput([
      `$ ssh connect@tech_pals -i key.pem`,
      `Verifying credentials against central node...`,
      `ERROR: RSA key verification failed.`,
      `Permission denied (publickey).`,
      `CRITICAL: Registration gate is currently [LOCKED] by administrator.`
    ]);
  };

  return (
    <section
      id="join"
      ref={ref}
      className="border-t border-slate-200 bg-[#f8fafc] px-6 py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background neon radial */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[350px] w-[350px] rounded-full bg-red-500/[0.01] blur-[120px] z-0" />

      <div className="mx-auto max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-center sm:px-16 sm:py-14 shadow-lg shadow-slate-100 backdrop-blur-sm"
        >
          {/* Top visual dots */}
          <div className="pointer-events-none absolute top-4 left-4 flex gap-1.5 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
          </div>

          <div className="relative">
            {/* Locked Badge Icon */}
            <div className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-300 ${
              status === "failed" 
                ? "bg-red-50 border-red-200 text-red-600" 
                : "bg-amber-50 border-amber-200 text-amber-700"
            }`}>
              {status === "failed" ? <ShieldAlert size={26} className="animate-pulse" /> : <Lock size={26} />}
            </div>

            <h2 className="text-balance text-2xl font-bold font-mono tracking-tight text-slate-900 sm:text-3xl">
              [REGISTRATION_CLOSED]
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-slate-650 leading-relaxed">
              Membership intake is currently suspended. However, peers can request sandbox login keys. Try entering a passcode below to query server.
            </p>

            {/* Interactive Passcode form */}
            <form onSubmit={handleAccessRequest} className="mt-8 mx-auto max-w-sm">
              <div className="flex gap-2 p-1.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center pl-3 text-slate-400">
                  <KeyRound size={14} />
                </div>
                <input
                  type="password"
                  placeholder="enter passcode..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === "verifying"}
                  className="flex-1 bg-transparent py-1.5 text-xs font-mono text-slate-800 placeholder-slate-400 outline-none focus:ring-0 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "verifying" || !password}
                  className="rounded-md bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 px-4 py-1.5 text-xs font-mono text-slate-500 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                >
                  {status === "verifying" ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : (
                    "SUBMIT"
                  )}
                </button>
              </div>
            </form>

            {/* Simulated Shell output for verification */}
            {terminalOutput.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 border border-slate-150 rounded-lg p-4 bg-slate-50/70 text-left font-mono text-[11px] leading-relaxed"
              >
                <div className="flex items-center gap-1.5 text-slate-450 border-b border-slate-100 pb-2 mb-2 select-none">
                  <Terminal size={10} />
                  <span>auth_audit.log</span>
                </div>
                <div className="space-y-1">
                  {terminalOutput.map((line, idx) => {
                    let color = "text-slate-600";
                    if (line.startsWith("$")) {
                      color = "text-blue-600 font-semibold";
                    } else if (line.startsWith("ERROR") || line.startsWith("CRITICAL")) {
                      color = "text-red-600 font-semibold";
                    } else if (line.includes("Verifying")) {
                      color = "text-amber-700";
                    }
                    return (
                      <div key={idx} className={color}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
