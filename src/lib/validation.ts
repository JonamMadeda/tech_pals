export function normalizeTags(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
  "metadata.google.internal",
  "metadata",
  "169.254.169.254", // AWS/GCP/Azure metadata
  "instance-data", // Azure metadata
  "metadata.azure.com",
]);

const PRIVATE_IPV4_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^127\./,
  /^169\.254\./,
  /^0\./,
];

const PRIVATE_IPV6_PREFIXES = [
  "::1",
  "fe80:",
  "fc00:",
  "fd00:",
  "::ffff:10.",
  "::ffff:172.1[6-9].",
  "::ffff:172.2[0-9].",
  "::ffff:172.3[0-1].",
  "::ffff:192.168.",
];

function isPrivateIp(hostname: string): boolean {
  // Check IPv4 private ranges
  for (const range of PRIVATE_IPV4_RANGES) {
    if (range.test(hostname)) return true;
  }
  // Check IPv6 private prefixes
  for (const prefix of PRIVATE_IPV6_PREFIXES) {
    if (hostname.startsWith(prefix)) return true;
  }
  return false;
}

export function isValidUrl(value: string, options?: { allowPrivate?: boolean }): boolean {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    const hostname = url.hostname.toLowerCase();

    // Block known internal hostnames
    if (BLOCKED_HOSTNAMES.has(hostname)) return false;

    // Block private IP ranges (SSRF protection)
    if (!options?.allowPrivate && isPrivateIp(hostname)) return false;

    return true;
  } catch {
    return false;
  }
}

export function isValidUsername(value: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(value);
}

export function toNonNegativeInt(value: string): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Password must contain at least one special character");
  return { valid: errors.length === 0, errors };
}
