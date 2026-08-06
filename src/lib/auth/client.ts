"use client";

export async function signIn(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function signUp(email: string, password: string, name: string) {
  const res = await fetch("/api/auth/signup-neon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  return res.json();
}

export async function signOut() {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  return res.json();
}

export async function getSession() {
  const res = await fetch("/api/auth/session");
  return res.json();
}
