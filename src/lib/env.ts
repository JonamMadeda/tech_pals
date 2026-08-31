export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  authSecret: process.env.AUTH_SECRET ?? "",
  initialAdminEmail: process.env.INITIAL_ADMIN_EMAIL!,
  initialAdminPassword: process.env.INITIAL_ADMIN_PASSWORD!,
};