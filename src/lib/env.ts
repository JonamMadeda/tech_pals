export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  authSecret: process.env.AUTH_SECRET ?? "",
  initialAdminEmail: process.env.INITIAL_ADMIN_EMAIL ?? "admin@techpals.dev",
  initialAdminPassword:
    process.env.INITIAL_ADMIN_PASSWORD ?? "change-me-admin-password",
};