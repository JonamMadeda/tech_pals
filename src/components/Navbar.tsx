"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, Shield, UserRound } from "lucide-react";
import { signOut } from "@/lib/auth/client";

const links = [
  { href: "#about", label: "about" },
  { href: "#leaders", label: "leaders" },
  { href: "#members", label: "members" },
  { href: "/projects", label: "projects" },
];

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type UserProfile = {
  role: "admin" | "member";
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(async (d) => {
        if (d.user) {
          setUser(d.user);
          const res = await fetch("/api/members?scope=all");
          const data = await res.json();
          const me = data.members?.find(
            (m: { email: string }) => m.email === d.user.email
          );
          if (me) setProfile({ role: me.role });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPos = window.scrollY + 200;
      for (const link of links) {
        if (!link.href.startsWith("#")) continue;
        const el = document.querySelector(link.href) as HTMLElement;
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(link.href);
            return;
          }
        }
      }
      if (window.scrollY < 100) setActiveSection("");
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  async function handleLogout() {
    await signOut();
    setUser(null);
    setProfile(null);
    window.location.href = "/";
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm shadow-slate-200/50"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#"
          className="group flex items-center font-mono text-xl font-bold tracking-tight text-slate-900"
        >
          <span className="text-blue-500 transition-transform group-hover:translate-x-[-2px]">&lt;</span>
          <span>tech</span>
          <span className="text-blue-600">_pals</span>
          <span className="text-blue-500 transition-transform group-hover:translate-x-[2px]">&nbsp;/&gt;</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`relative font-mono text-xs font-semibold uppercase tracking-wider transition-colors duration-200 px-3 py-1.5 rounded-md ${
                  isActive
                    ? "text-blue-600 bg-blue-50 border border-blue-200"
                    : "text-slate-500 border border-transparent hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <span className="mr-1 text-blue-500/60 opacity-0 transition-opacity duration-200 hover:opacity-100">$</span>
                {link.label}
              </a>
            );
          })}

          {/* Auth buttons */}
          <span className="h-4 w-px bg-slate-200" />
          {user ? (
            <div className="flex items-center gap-3">
              {profile?.role === "admin" && (
                <a
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 font-mono text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                >
                  <Shield size={12} />
                  dashboard
                </a>
              )}
              <a href="/member" className="flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 font-mono text-xs font-semibold text-blue-700 hover:bg-blue-100"><UserRound size={12} />my area</a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 font-mono text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <LogOut size={12} />
                logout
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700"
            >
              <LogIn size={12} />
              login
            </a>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="relative z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-500 transition-all hover:border-blue-300 hover:text-slate-850 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-0 border-b border-slate-200 bg-white/95 backdrop-blur-lg md:hidden"
          >
            <nav className="flex flex-col gap-4 px-6 pb-8 pt-20">
              {links.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className={`font-mono text-sm font-semibold uppercase tracking-wider transition-colors py-2 px-3 rounded-md ${
                      isActive
                        ? "text-blue-600 bg-blue-50 border-l-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span className="mr-2 text-blue-600">$</span>
                    {link.label}
                  </a>
                );
              })}

              {/* Mobile auth */}
              <span className="h-px bg-slate-200" />
              {user ? (
                <>
                  {profile?.role === "admin" && (
                    <a
                      href="/dashboard"
                      className="flex items-center gap-2 font-mono text-sm font-semibold text-amber-700 hover:text-amber-800 py-2 px-3"
                    >
                      <Shield size={14} />
                      admin dashboard
                    </a>
                  )}
                  <a href="/member" className="flex items-center gap-2 px-3 py-2 font-mono text-sm font-semibold text-blue-700"><UserRound size={14} />member area</a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-500 hover:text-slate-900 py-2 px-3 text-left"
                  >
                    <LogOut size={14} />
                    logout
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-center font-mono text-sm font-bold uppercase text-white hover:bg-blue-700"
                >
                  <LogIn size={14} />
                  login
                </a>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
