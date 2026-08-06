"use client";

import { useEffect, useState } from "react";
import { FolderKanban, Shield, Users } from "lucide-react";

type Counts = { members: number; leaders: number; projects: number };

export default function HomeStats() {
  const [counts, setCounts] = useState<Counts>({ members: 0, leaders: 0, projects: 0 });
  useEffect(() => { Promise.all([fetch("/api/members"), fetch("/api/members?role=leader"), fetch("/api/projects", { cache: "no-store" })]).then(async ([memberResponse, leaderResponse, projectResponse]) => { const [members, leaders, projects] = await Promise.all([memberResponse.json(), leaderResponse.json(), projectResponse.json()]); setCounts({ members: members.members?.length ?? 0, leaders: leaders.members?.length ?? 0, projects: projects.projects?.length ?? 0 }); }).catch(() => {}); }, []);
  const stats = [{ label: "MEMBERS", value: counts.members, icon: Users, color: "text-blue-600 bg-blue-50" }, { label: "LEADERS", value: counts.leaders, icon: Shield, color: "text-violet-600 bg-violet-50" }, { label: "PROJECTS", value: counts.projects, icon: FolderKanban, color: "text-cyan-600 bg-cyan-50" }];
  return <section className="border-y border-slate-200 bg-white px-6"><div className="mx-auto grid max-w-6xl divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">{stats.map(({ label, value, icon: Icon, color }) => <div key={label} className="flex items-center gap-4 px-4 py-5 sm:px-8"><div className={`grid h-10 w-10 place-items-center rounded-lg ${color}`}><Icon size={18} /></div><div><p className="text-2xl font-bold text-slate-900">{value}</p><p className="font-mono text-[10px] font-bold tracking-widest text-slate-400">{label}</p></div></div>)}</div></section>;
}
