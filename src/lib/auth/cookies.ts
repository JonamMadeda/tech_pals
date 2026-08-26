const SECURE_PREFIX = "__Secure-";
const BARE_NAME = "neon-auth.session_token";

/** Best-effort read: try the prefixed name first, fall back to bare. */
export function readSessionToken(
  get: (name: string) => { value?: string } | undefined
): string | undefined {
  return get(`${SECURE_PREFIX}${BARE_NAME}`)?.value ?? get(BARE_NAME)?.value;
}

export const ALL_SESSION_COOKIES = [
  `${SECURE_PREFIX}${BARE_NAME}`,
  BARE_NAME,
  `${SECURE_PREFIX}neon-auth.session_data`,
  "neon-auth.session_data",
  `${SECURE_PREFIX}neon-auth.dont_remember`,
  "neon-auth.dont_remember",
  `${SECURE_PREFIX}neon-auth.account_data`,
  "neon-auth.account_data",
];

export const COOKIE_CLEAR_ATTRIBUTES = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  expires: new Date(0),
  maxAge: 0,
};
