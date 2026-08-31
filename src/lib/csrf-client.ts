"use client";

let csrfToken: string | null = null;

export async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  try {
    const res = await fetch("/api/csrf", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      csrfToken = String(data.csrfToken);
      return csrfToken;
    }
  } catch {
    // Fallback: try to read from cookie (won't work for httpOnly)
  }
  return "";
}

export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getCsrfToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("x-csrf-token", token);
  }
  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}

export function clearCsrfToken() {
  csrfToken = null;
}