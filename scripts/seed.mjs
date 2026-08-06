import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function main() {
  await sql`DROP TABLE IF EXISTS users`;
  await sql`CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'member',
    title TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    github TEXT DEFAULT '',
    linkedin TEXT DEFAULT '',
    website TEXT DEFAULT '',
    commits INTEGER DEFAULT 0,
    prs INTEGER DEFAULT 0,
    lang TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
  )`;
  await sql.query(
    `INSERT INTO users (email, name, avatar, role, title, bio, tags, github, linkedin, website, commits, prs, lang)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    ["jonammadeda.dev@gmail.com", "Jonnan", "J", "admin", "Site Administrator",
     "Managing and growing the tech_pals community.", ["Leadership", "DevOps", "Community"],
     "", "", "", 0, 0, "TypeScript"]
  );
  console.log("Admin profile seeded.");
}
main();
