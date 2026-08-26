import { cookies } from "next/headers";
import { readSessionToken } from "@/lib/auth/cookies";

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

export async function getCurrentSession(): Promise<NeonSession | null> {
  const cookieStore = await cookies();
  const token = readSessionToken((name) => cookieStore.get(name));
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
