import { Github, Linkedin, Twitter } from "lucide-react";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Leaders", href: "#leaders" },
  { label: "Members", href: "#members" },

];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="text-center md:text-left">
          <a
            href="#"
            className="font-mono text-lg font-bold tracking-tight text-gray-900"
          >
            tech<span className="text-blue-500">_pals</span>
          </a>
          <p className="mt-1 text-xs text-gray-400">
            Where developers connect & build together.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-gray-400 transition-colors hover:text-gray-700"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="#"
            className="text-gray-400 transition-colors hover:text-gray-700"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="#"
            className="text-gray-400 transition-colors hover:text-gray-700"
            aria-label="Twitter"
          >
            <Twitter size={16} />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-gray-100 pt-6 text-center">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} tech_pals. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
