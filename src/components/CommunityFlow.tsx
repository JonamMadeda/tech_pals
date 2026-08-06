import { ArrowRight, FolderPlus, UserPlus, UserRoundPen } from "lucide-react";

const steps = [
  { icon: UserPlus, label: "01", title: "Admin invites", body: "Admins create secure member accounts." },
  { icon: UserRoundPen, label: "02", title: "Members personalise", body: "Members maintain a profile and links." },
  { icon: FolderPlus, label: "03", title: "Work gets shared", body: "Top projects reach the public showcase." },
];

export default function CommunityFlow() {
  return <section className="border-t border-slate-200 bg-[#f8fafc] px-6 py-20"><div className="mx-auto max-w-6xl"><div className="mb-10 max-w-xl"><span className="font-mono text-xs font-semibold tracking-widest text-blue-600">[ HOW_IT_WORKS ]</span><h2 className="mt-2 text-3xl font-bold text-slate-900">A small system for sharing good work.</h2></div><div className="grid gap-4 md:grid-cols-3">{steps.map((step, index) => <div key={step.label} className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600"><step.icon size={18} /></div><span className="font-mono text-xs text-slate-400">{step.label}</span></div><h3 className="font-bold text-slate-900">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>{index < steps.length - 1 && <ArrowRight className="absolute -right-7 top-1/2 hidden -translate-y-1/2 text-slate-300 md:block" size={20} />}</div>)}</div></div></section>;
}
