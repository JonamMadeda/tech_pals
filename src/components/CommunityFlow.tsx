import { ArrowRight, FolderPlus, UserPlus, UserRoundPen } from "lucide-react";

const steps = [
  { icon: UserPlus, label: "01", title: "Admin invites", body: "Admins create secure member accounts." },
  { icon: UserRoundPen, label: "02", title: "Members personalise", body: "Members maintain a profile and links." },
  { icon: FolderPlus, label: "03", title: "Work gets shared", body: "Top projects reach the public showcase." },
];

export default function CommunityFlow() {
  return <section className="border-t border-slate-200 bg-[#fafaf8] px-6 py-16 md:py-20"><div className="mx-auto max-w-6xl"><div className="mb-10 max-w-xl"><span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">How it works</span><h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-slate-900">A simple way to share good work.</h2></div><div className="grid divide-y divide-slate-200 border-y border-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">{steps.map((step, index) => <div key={step.label} className="relative py-6 md:px-7 md:first:pl-0 md:last:pr-0"><div className="mb-5 flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-blue-700"><step.icon size={18} /></div><span className="font-mono text-xs text-slate-400">{step.label}</span></div><h3 className="font-semibold text-slate-900">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>{index < steps.length - 1 && <ArrowRight className="absolute -right-2 top-10 z-10 hidden bg-[#fafaf8] text-slate-400 md:block" size={16} />}</div>)}</div></div></section>;
}
