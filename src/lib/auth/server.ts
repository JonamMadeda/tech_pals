import { cookies } from "next/headers";

const NEON_AUTH_URL = process.env.NEON_AUTH_BASE_URL!;

export type NeonSession = {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

/** Get current session by reading Neon Auth cookie and calling Neon Auth */
export async function getCurrentSession(): Promise<NeonSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-neon-auth.session_token")?.value;
  if (!token) return null;

  const res = await fetch(`${NEON_AUTH_URL}/get-session`, {
    headers: {
      "Content-Type": "application/json",
      "Origin": "http://localhost:3000",
      "Cookie": `__Secure-neon-auth.session_token=${token}`,
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data as NeonSession;
}
