import { Github, Linkedin, Twitter, Activity, Wifi, Terminal } from "lucide-react";

const quickLinks = [
  { label: "about", href: "#about" },
  { label: "leaders", href: "#leaders" },
  { label: "members", href: "#members" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#f8fafc] px-6 py-12 relative overflow-hidden">
      {/* Visual background line */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row relative z-10">
        
        {/* Brand */}
        <div className="text-center md:text-left">
          <a
            href="#"
            className="group flex items-center justify-center md:justify-start font-mono text-lg font-bold tracking-tight text-slate-900"
          >
            <span className="text-blue-500 transition-transform group-hover:translate-x-[-1px]">&lt;</span>
            <span>tech</span>
            <span className="text-blue-600">_pals</span>
            <span className="text-blue-500 transition-transform group-hover:translate-x-[1px]">&nbsp;/&gt;</span>
          </a>
          <p className="mt-1.5 text-xs text-slate-500 font-mono">
            Where developers connect & build together.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-blue-600"
            >
              /{link.label}
            </a>
          ))}
        </nav>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-slate-350 hover:text-slate-700 shadow-sm"
            aria-label="GitHub"
          >
            <Github size={15} />
          </a>
          <a
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-slate-350 hover:text-slate-700 shadow-sm"
            aria-label="LinkedIn"
          >
            <Linkedin size={15} />
          </a>
          <a
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-slate-350 hover:text-slate-700 shadow-sm"
            aria-label="Twitter"
          >
            <Twitter size={15} />
          </a>
        </div>
      </div>

      {/* Developer Metrics Bar */}
      <div className="mx-auto mt-10 max-w-6xl border-t border-slate-200/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-500">
        <p className="text-center md:text-left select-none">
          &copy; {new Date().getFullYear()} tech_pals. All rights reserved.
        </p>

        {/* Live system status dashboard bar */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 select-none">
          <span className="flex items-center gap-1 border border-slate-200 bg-slate-100/60 px-2 py-0.5 rounded text-slate-600 shadow-sm">
            <Activity size={10} className="text-cyan-600 animate-pulse" />
            <span>STATUS: NOMINAL</span>
          </span>
          <span className="flex items-center gap-1 border border-slate-200 bg-slate-100/60 px-2 py-0.5 rounded text-slate-600 shadow-sm">
            <Wifi size={10} className="text-blue-600" />
            <span>PING: 14MS</span>
          </span>
          <span className="flex items-center gap-1 border border-slate-200 bg-slate-100/60 px-2 py-0.5 rounded text-slate-600 shadow-sm">
            <Terminal size={10} className="text-cyan-600" />
            <span>ENV: PRODUCTION</span>
          </span>
          <span className="border border-slate-200 bg-slate-100/60 px-2 py-0.5 rounded text-slate-600 shadow-sm">
            BUILD: v1.0.3-STABLE
          </span>
        </div>
      </div>
    </footer>
  );
}
