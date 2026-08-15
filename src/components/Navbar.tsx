"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, Shield, UserRound, ChevronDown } from "lucide-react";
import { signOut } from "@/lib/auth/client";

const communityLinks = [
  { href: "#about", label: "about" },
  { href: "#leaders", label: "leaders" },
  { href: "#members", label: "members" },
];

const pageLinks = [
  { href: "/projects", label: "projects" },
  { href: "/news", label: "news" },
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
  const [communityOpen, setCommunityOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const communityRef = useRef<HTMLDivElement>(null);

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
      for (const link of communityLinks) {
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (communityRef.current && !communityRef.current.contains(e.target as Node)) {
        setCommunityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setOpen(false);
    setCommunityOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  async function handleLogout() {
    try { await signOut(); } catch {}
    setUser(null);
    setProfile(null);
    window.location.href = "/";
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm shadow-slate-200/50" : "bg-transparent border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="group flex items-center font-mono text-xl font-bold tracking-tight text-slate-900">
          <span className="text-blue-500 transition-transform group-hover:translate-x-[-2px]">&lt;</span>
          <span>tech</span>
          <span className="text-blue-600">_pals</span>
          <span className="text-blue-500 transition-transform group-hover:translate-x-[2px]">&nbsp;/&gt;</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Community dropdown */}
          <div ref={communityRef} className="relative">
            <button
              onClick={() => setCommunityOpen(!communityOpen)}
              className={`flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors duration-200 ${communityLinks.some((l) => activeSection === l.href) ? "text-blue-600 bg-blue-50 border border-blue-200" : "text-slate-500 border border-transparent hover:text-slate-800 hover:bg-slate-100"}`}
            >
              community
              <ChevronDown size={12} className={`transition-transform ${communityOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {communityOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 top-full mt-1 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
                >
                  {communityLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className={`block px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${activeSection === link.href ? "text-blue-600 bg-blue-50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
                    >
                      {link.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Page links */}
          {pageLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 py-1.5 rounded-md border border-transparent transition-colors duration-200 hover:text-slate-800 hover:bg-slate-100"
            >
              {link.label}
            </a>
          ))}

          <span className="h-4 w-px bg-slate-200 mx-1" />

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              {profile?.role === "admin" && (
                <a href="/dashboard" className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 font-mono text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100">
                  <Shield size={12} />dashboard
                </a>
              )}
              <a href="/member" className="flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 font-mono text-xs font-semibold text-blue-700 hover:bg-blue-100">
                <UserRound size={12} />my area
              </a>
              <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
                <LogOut size={12} />
              </button>
            </div>
          ) : (
            <a href="/login" className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700">
              <LogIn size={12} />login
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
            <nav className="flex flex-col gap-1 px-6 pb-8 pt-20">
              <p className="mb-1 font-mono text-[10px] font-bold tracking-widest text-slate-400">COMMUNITY</p>
              {communityLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className={`rounded-md px-3 py-2 font-mono text-sm font-semibold transition-colors ${activeSection === link.href ? "text-blue-600 bg-blue-50 border-l-2 border-blue-600" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                >
                  {link.label}
                </a>
              ))}

              <p className="mb-1 mt-3 font-mono text-[10px] font-bold tracking-widest text-slate-400">PAGES</p>
              {pageLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 font-mono text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 hover:bg-slate-50"
                >
                  {link.label}
                </a>
              ))}

              <span className="my-3 h-px bg-slate-200" />
              {user ? (
                <>
                  {profile?.role === "admin" && (
                    <a href="/dashboard" className="flex items-center gap-2 rounded-md px-3 py-2 font-mono text-sm font-semibold text-amber-700 hover:bg-amber-50">
                      <Shield size={14} />admin dashboard
                    </a>
                  )}
                  <a href="/member" className="flex items-center gap-2 rounded-md px-3 py-2 font-mono text-sm font-semibold text-blue-700 hover:bg-blue-50">
                    <UserRound size={14} />member area
                  </a>
                  <button onClick={handleLogout} className="flex items-center gap-2 rounded-md px-3 py-2 text-left font-mono text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                    <LogOut size={14} />logout
                  </button>
                </>
              ) : (
                <a href="/login" className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2.5 font-mono text-sm font-bold uppercase text-white hover:bg-blue-700">
                  <LogIn size={14} />login
                </a>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
