"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ExternalLink, FolderKanban, ImagePlus, KeyRound, Pencil, Plus, Save, Star, Trash2, UserRound, X } from "lucide-react";
import MemberInsights from "@/components/MemberInsights";
import { signOut } from "@/lib/auth/client";
import { isValidUrl, isValidUsername, normalizeTags, toNonNegativeInt } from "@/lib/validation";

type Profile = { id: number; email: string; username: string | null; name: string; avatar: string; title: string; bio: string; tags: string[] | null; github: string; linkedin: string; website: string; commits: number; prs: number; lang: string; created_at: string; last_login_at: string | null };
type Project = { id: number; title: string; summary: string; description: string; image_url: string; project_url: string; github_url: string; tags: string[] | null; featured: boolean };
type ProjectForm = { title: string; summary: string; description: string; image_url: string; project_url: string; github_url: string; tags: string; featured: boolean };
const emptyProject: ProjectForm = { title: "", summary: "", description: "", image_url: "", project_url: "", github_url: "", tags: "", featured: false };

function Avatar({ value, name, className }: { value: string; name: string; className: string }) {
  if (value.startsWith("data:") || value.startsWith("http")) {
    return <img src={value} alt={name} className={`object-cover ${className}`} />;
  }
  return <div className={`place-items-center ${className}`}>{value || name.slice(0, 2).toUpperCase()}</div>;
}

function Modal({ title, children, close }: { title: string; children: React.ReactNode; close: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);
  return <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex items-center justify-center p-4"><button aria-label="Close modal" onClick={close} className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" /><div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"><div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur"><h2 className="font-mono text-sm font-bold text-slate-900">{title}</h2><button onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button></div><div className="p-6">{children}</div></div></div>;
}

const inputStyle = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white";
const Label = ({ children }: { children: React.ReactNode }) => <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500">{children}</label>;

function resizeAvatar(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas unavailable")); return; }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.onerror = () => reject(new Error("Invalid image"));
      image.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

export default function MemberPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"profile" | "password" | "project" | "delete" | null>(null);
  const [profileForm, setProfileForm] = useState<Record<string, string>>({});
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProject);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [saving, setSaving] = useState<"profile" | "project" | "password" | "delete" | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);

  async function load() {
    try {
      const [profileResponse, projectResponse] = await Promise.all([fetch("/api/profile"), fetch("/api/projects")]);
      if (profileResponse.status === 401) { window.location.href = "/login"; return; }
      if (!profileResponse.ok || !projectResponse.ok) { setNotice("Could not load your workspace."); setLoading(false); return; }
      const profileData = await profileResponse.json();
      const projectData = await projectResponse.json();
      setProfile(profileData.member);
      setProfileForm({ ...profileData.member, tags: profileData.member.tags?.join(", ") ?? "", commits: String(profileData.member.commits ?? 0), prs: String(profileData.member.prs ?? 0) });
      setProjects((projectData.projects ?? []).filter((item: { user_id: number }) => item.user_id === profileData.member.id));
      setLoading(false);
    } catch {
      setNotice("Network error while loading.");
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);
  function updateProfileField(field: string, value: string) { setProfileForm((form) => ({ ...form, [field]: value })); }
  function updateProjectField(field: keyof ProjectForm, value: string | boolean) { setProjectForm((form) => ({ ...form, [field]: value })); }
  function closeModal() { setModal(null); setEditingProject(null); setProjectForm(emptyProject); }
  async function handleAvatarFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setNotice("Please choose an image file."); return; }
    if (file.size > 4 * 1024 * 1024) { setNotice("Image must be smaller than 4 MB."); return; }
    setAvatarBusy(true);
    try {
      const dataUrl = await resizeAvatar(file);
      updateProfileField("avatar", dataUrl);
      setNotice("Avatar ready — save your profile.");
    } catch {
      setNotice("Could not process that image.");
    } finally {
      setAvatarBusy(false);
    }
  }
  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    const username = profileForm.username?.trim().toLowerCase() ?? "";
    if (username && !isValidUsername(username)) { setNotice("Username must be 3–30 letters, numbers, or underscores."); return; }
    for (const field of ["github", "linkedin", "website"] as const) {
      if (!isValidUrl(profileForm[field] ?? "")) { setNotice(`Invalid ${field} URL — use http(s)://`); return; }
    }
    const tags = normalizeTags(profileForm.tags ?? "");
    const commits = toNonNegativeInt(profileForm.commits ?? "");
    const prs = toNonNegativeInt(profileForm.prs ?? "");
    setSaving("profile");
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profileForm, username: username || undefined, tags, commits, prs }),
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(data.member);
        setProfileForm({ ...data.member, tags: data.member.tags?.join(", ") ?? "", commits: String(data.member.commits ?? 0), prs: String(data.member.prs ?? 0) });
        setNotice("Profile saved successfully.");
        setModal(null);
      } else {
        setNotice(data.error ?? "Could not save profile.");
      }
    } catch {
      setNotice("Network error while saving.");
    } finally {
      setSaving(null);
    }
  }
  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get("newPassword") ?? "");
    if (newPassword !== String(data.get("confirmPassword") ?? "")) { setNotice("New passwords do not match."); return; }
    setSaving("password");
    try {
      const response = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: data.get("currentPassword"), newPassword }) });
      const body = await response.json();
      setNotice(response.ok ? "Password updated successfully." : body.error ?? "Could not update password.");
      if (response.ok) setModal(null);
    } catch {
      setNotice("Network error while changing password.");
    } finally {
      setSaving(null);
    }
  }
  async function saveProject(event: FormEvent) {
    event.preventDefault();
    for (const field of ["project_url", "github_url", "image_url"] as const) {
      if (!isValidUrl(projectForm[field])) { setNotice(`Invalid ${field} — use http(s)://`); return; }
    }
    const tags = normalizeTags(projectForm.tags);
    setSaving("project");
    try {
      const response = await fetch(editingProject ? `/api/projects/${editingProject}` : "/api/projects", { method: editingProject ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...projectForm, tags, featured: projectForm.featured }) });
      const data = await response.json();
      if (!response.ok) { setNotice(data.error ?? "Could not save project."); return; }
      setNotice(editingProject ? "Project updated." : "Project published.");
      closeModal();
      load();
    } catch {
      setNotice("Network error while saving.");
    } finally {
      setSaving(null);
    }
  }
  async function removeProject(id: number) {
    if (removingId) return;
    if (!window.confirm("Remove this project from the public showcase?")) return;
    setRemovingId(id);
    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) { setNotice("Could not remove project."); return; }
      setProjects((items) => items.filter((item) => item.id !== id));
      setNotice("Project removed.");
    } catch {
      setNotice("Network error while removing.");
    } finally {
      setRemovingId(null);
    }
  }
  function editProject(project: Project) { setEditingProject(project.id); setProjectForm({ ...project, tags: project.tags?.join(", ") ?? "" }); setModal("project"); }
  async function deleteAccount() {
    setSaving("delete");
    try {
      const response = await fetch("/api/profile", { method: "DELETE" });
      if (!response.ok) { const data = await response.json().catch(() => null); setNotice(data?.error ?? "Could not delete account."); setSaving(null); return; }
      await signOut();
      window.location.href = "/login";
    } catch {
      setNotice("Network error while deleting account.");
      setSaving(null);
    }
  }

  if (!profile) {
    return <div className="grid min-h-screen place-items-center bg-[#f8fafc] px-6"><div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">{loading ? <p className="font-mono text-sm text-slate-500">$ loading workspace...</p> : <><p className="font-mono text-xs font-bold tracking-widest text-red-500">[ CONNECTION_ERROR ]</p><h1 className="mt-3 text-xl font-bold text-slate-900">Could not load your workspace.</h1><p className="mt-2 text-sm text-slate-500">{notice || "Please try again."}</p><button onClick={() => { setLoading(true); setNotice(""); load(); }} className="mt-6 rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-blue-700">retry</button></>}</div></div>;
  }

  return <div className="min-h-screen bg-[#f8fafc]"><header className="border-b border-slate-200 bg-white/85 backdrop-blur"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"><Link href="/" className="font-mono text-lg font-bold text-slate-900"><span className="text-blue-500">&lt;</span>tech<span className="text-blue-600">_pals</span><span className="text-blue-500"> /&gt;</span></Link><div className="flex gap-3"><Link href="/projects" className="rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs text-slate-600 hover:bg-slate-50">public projects</Link></div></div></header>
    <main className="mx-auto max-w-6xl px-6 py-10"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="font-mono text-xs font-bold tracking-widest text-blue-600">[ MEMBER_WORKSPACE ]</span><h1 className="mt-2 text-3xl font-bold text-slate-900">Your corner of tech_pals.</h1><p className="mt-2 text-slate-600">Keep your profile fresh and publish the work you want the community to see.</p></div><button onClick={() => setModal("project")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-mono text-xs font-bold text-white shadow-sm hover:bg-blue-700"><Plus size={15} />new project</button></div>
    {notice && <div className="mb-6 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 font-mono text-xs text-blue-700"><span>{notice}</span><button onClick={() => setNotice("")}><X size={14} /></button></div>}
    <MemberInsights profile={profile} projectCount={projects.length} />
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]"><aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><Avatar value={profile.avatar} name={profile.name} className="grid h-12 w-12 shrink-0 rounded-full border border-blue-100 bg-blue-50 font-mono font-bold text-blue-700" /><div className="min-w-0"><p className="truncate font-bold text-slate-900">{profile.name}</p><p className="truncate font-mono text-xs text-slate-500">{profile.username ? `@${profile.username}` : profile.title || "Member"}</p></div></div><div className="my-5 border-t border-slate-100" /><dl className="space-y-3 font-mono text-xs"><div className="flex justify-between gap-3"><dt className="text-slate-400">PROJECTS</dt><dd className="font-bold text-slate-700">{projects.length}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-400">LAST SIGN IN</dt><dd className="font-semibold text-slate-700">{profile.last_login_at ? new Date(profile.last_login_at).toLocaleDateString() : "never"}</dd></div><div><dt className="mb-1 text-slate-400">EMAIL</dt><dd className="break-all text-slate-600">{profile.email}</dd></div></dl><div className="mt-5 grid gap-2"><Link href={`/member/${profile.username || profile.id}`} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-xs font-semibold text-slate-700 hover:bg-slate-50"><ExternalLink size={14} />view public profile</Link><button onClick={() => setModal("profile")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-xs font-semibold text-slate-700 hover:bg-slate-50"><UserRound size={14} />edit profile</button><button onClick={() => setModal("password")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-xs font-semibold text-slate-700 hover:bg-slate-50"><KeyRound size={14} />change password</button><button onClick={() => setModal("delete")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2.5 font-mono text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 size={14} />delete account</button></div></aside>
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="font-bold text-slate-900">Published projects</h2><p className="mt-1 text-sm text-slate-500">Projects shown on the public community page.</p></div><span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500">{projects.length}</span></div>{projects.length === 0 ? <div className="p-12 text-center"><FolderKanban className="mx-auto mb-3 text-blue-400" size={32} /><p className="font-mono text-sm text-slate-500">No projects yet.</p><button onClick={() => setModal("project")} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-blue-700"><Plus size={14} />add your first project</button></div> : <div className="divide-y divide-slate-100">{projects.map((project) => <article key={project.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-slate-900">{project.title}</h3>{project.featured && <span className="flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-700"><Star size={10} />FEATURED</span>}</div><p className="mt-1 truncate text-sm text-slate-500">{project.summary || project.description || "No summary added."}</p><div className="mt-2 flex flex-wrap gap-1">{project.tags?.map((tag) => <span key={tag} className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-700">{tag}</span>)}</div></div><div className="flex shrink-0 gap-2"><button onClick={() => editProject(project)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-blue-600" aria-label="Edit project"><Pencil size={15} /></button><button onClick={() => removeProject(project.id)} disabled={removingId === project.id} className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50 disabled:opacity-50" aria-label="Remove project">{removingId === project.id ? <span className="block h-[15px] w-[15px] animate-spin rounded-full border-2 border-red-200 border-t-red-500" /> : <Trash2 size={15} />}</button></div></article>)}</div>}</section></div></main>
    {modal === "profile" && <Modal title="Edit profile" close={closeModal}><form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Label>Avatar</Label><div className="flex items-center gap-3"><Avatar value={profileForm.avatar ?? ""} name={profileForm.name ?? ""} className="grid h-14 w-14 shrink-0 rounded-full border border-blue-100 bg-blue-50 font-mono font-bold text-blue-700" /><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs font-semibold text-slate-700 hover:bg-slate-50"><ImagePlus size={14} />{avatarBusy ? "processing..." : "upload image"}<input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} /></label><span className="font-mono text-[10px] text-slate-400">or type initials below</span></div></div><div className="sm:col-span-2"><Label>Username (public handle)</Label><input value={profileForm.username ?? ""} onChange={(e) => updateProfileField("username", e.target.value)} placeholder="3–30 letters, numbers, or underscores" className={inputStyle} /></div><div><Label>Name</Label><input required value={profileForm.name ?? ""} onChange={(e) => updateProfileField("name", e.target.value)} className={inputStyle} /></div><div><Label>Initials / avatar</Label><input value={profileForm.avatar ?? ""} onChange={(e) => updateProfileField("avatar", e.target.value)} className={inputStyle} /></div><div><Label>Role title</Label><input value={profileForm.title ?? ""} onChange={(e) => updateProfileField("title", e.target.value)} className={inputStyle} /></div><div><Label>Primary language</Label><input value={profileForm.lang ?? ""} onChange={(e) => updateProfileField("lang", e.target.value)} className={inputStyle} /></div><div><Label>Commits</Label><input type="number" min={0} value={profileForm.commits ?? "0"} onChange={(e) => updateProfileField("commits", e.target.value)} className={inputStyle} /></div><div><Label>Pull requests</Label><input type="number" min={0} value={profileForm.prs ?? "0"} onChange={(e) => updateProfileField("prs", e.target.value)} className={inputStyle} /></div><div className="sm:col-span-2"><Label>Bio</Label><textarea rows={3} value={profileForm.bio ?? ""} onChange={(e) => updateProfileField("bio", e.target.value)} className={inputStyle} /></div><div className="sm:col-span-2"><Label>Skills (comma separated)</Label><input value={profileForm.tags ?? ""} onChange={(e) => updateProfileField("tags", e.target.value)} className={inputStyle} /></div><div><Label>GitHub URL</Label><input value={profileForm.github ?? ""} onChange={(e) => updateProfileField("github", e.target.value)} className={inputStyle} /></div><div><Label>LinkedIn URL</Label><input value={profileForm.linkedin ?? ""} onChange={(e) => updateProfileField("linkedin", e.target.value)} className={inputStyle} /></div><div className="sm:col-span-2"><Label>Website URL</Label><input value={profileForm.website ?? ""} onChange={(e) => updateProfileField("website", e.target.value)} className={inputStyle} /></div><div className="sm:col-span-2 flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={closeModal} className="rounded-lg px-4 py-2 font-mono text-xs text-slate-600 hover:bg-slate-50">cancel</button><button disabled={saving === "profile"} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"><Save size={14} />{saving === "profile" ? "saving..." : "save profile"}</button></div></form></Modal>}
    {modal === "password" && <Modal title="Change password" close={closeModal}><form onSubmit={changePassword} className="space-y-4"><div><Label>Current password</Label><input name="currentPassword" required type="password" className={inputStyle} /></div><div><Label>New password</Label><input name="newPassword" required minLength={8} type="password" className={inputStyle} /><p className="mt-2 text-xs text-slate-500">Use at least eight characters.</p></div><div><Label>Confirm new password</Label><input name="confirmPassword" required minLength={8} type="password" className={inputStyle} /></div><div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={closeModal} className="rounded-lg px-4 py-2 font-mono text-xs text-slate-600">cancel</button><button disabled={saving === "password"} className="rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60">{saving === "password" ? "updating..." : "update password"}</button></div></form></Modal>}
    {modal === "project" && <Modal title={editingProject ? "Edit project" : "Add project"} close={closeModal}><form onSubmit={saveProject} className="grid gap-4 sm:grid-cols-2"><div><Label>Project title *</Label><input required value={projectForm.title} onChange={(e) => updateProjectField("title", e.target.value)} className={inputStyle} /></div><div><Label>Short summary</Label><input value={projectForm.summary} onChange={(e) => updateProjectField("summary", e.target.value)} className={inputStyle} /></div><div><Label>Live project URL</Label><input value={projectForm.project_url} onChange={(e) => updateProjectField("project_url", e.target.value)} className={inputStyle} /></div><div><Label>GitHub URL</Label><input value={projectForm.github_url} onChange={(e) => updateProjectField("github_url", e.target.value)} className={inputStyle} /></div><div className="sm:col-span-2"><Label>Project image URL</Label><input value={projectForm.image_url} onChange={(e) => updateProjectField("image_url", e.target.value)} className={inputStyle} /></div><div className="sm:col-span-2"><Label>Tags (comma separated)</Label><input value={projectForm.tags} onChange={(e) => updateProjectField("tags", e.target.value)} className={inputStyle} /></div><div className="sm:col-span-2"><Label>Description</Label><textarea rows={4} value={projectForm.description} onChange={(e) => updateProjectField("description", e.target.value)} className={inputStyle} /></div><div className="sm:col-span-2"><label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"><input type="checkbox" checked={projectForm.featured} onChange={(e) => updateProjectField("featured", e.target.checked)} className="h-4 w-4 accent-blue-600" /><span className="font-mono text-xs font-semibold text-slate-700">featured on community page</span></label></div><div className="sm:col-span-2 flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={closeModal} className="rounded-lg px-4 py-2 font-mono text-xs text-slate-600">cancel</button><button disabled={saving === "project"} className="rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60">{saving === "project" ? "saving..." : editingProject ? "save project" : "publish project"}</button></div></form></Modal>}
    {modal === "delete" && <Modal title="Delete account" close={closeModal}><div className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500"><AlertTriangle size={18} /></div><div><p className="text-sm leading-relaxed text-slate-600">This permanently removes your profile and all your published projects from the community. This action cannot be undone.</p><p className="mt-3 font-mono text-xs font-bold text-red-600">Type your email to confirm: {profile.email}</p><input value={profileForm.deleteConfirm ?? ""} onChange={(e) => updateProfileField("deleteConfirm", e.target.value)} placeholder={profile.email} className={`mt-2 ${inputStyle}`} /></div></div><div className="mt-6 flex justify-end gap-3"><button onClick={closeModal} className="rounded-lg px-4 py-2 font-mono text-xs text-slate-600">cancel</button><button disabled={saving === "delete" || (profileForm.deleteConfirm ?? "") !== profile.email} onClick={deleteAccount} className="rounded-lg bg-red-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50">{saving === "delete" ? "deleting..." : "delete my account"}</button></div></Modal>}
  </div>;
}
