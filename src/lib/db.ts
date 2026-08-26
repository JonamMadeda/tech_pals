import { neon } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";

export type MemberProfile = {
  id: number;
  email: string;
  username: string | null;
  name: string;
  avatar: string;
  role: "admin" | "leader" | "member";
  title: string;
  bio: string;
  tags: string[] | null;
  github: string;
  linkedin: string;
  website: string;
  commits: number;
  prs: number;
  lang: string;
  created_at: Date;
  last_login_at: Date | null;
};

export type Project = {
  id: number;
  user_id: number;
  title: string;
  summary: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  tags: string[] | null;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
  member_name?: string;
  member_avatar?: string;
  member_title?: string;
};

export type CommunityMeeting = {
  meeting_url: string;
  updated_at: Date;
};

export type DiscussionPost = {
  id: number;
  user_id: number;
  body: string;
  created_at: Date;
  updated_at: Date;
  author_name: string;
  author_username: string | null;
  author_avatar: string;
  author_role: "admin" | "leader" | "member";
  upvote_count: number;
  has_upvoted: boolean;
};

let sqlClient: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (!sqlClient) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    sqlClient = neon(url);
  }
  return sqlClient;
}

async function ensureUserSchema() {
  await getSql().query("ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT", []);
  await getSql().query("CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users (LOWER(username)) WHERE username IS NOT NULL", []);
  await getSql().query("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ", []);
}

export async function getUserByEmail(email: string): Promise<MemberProfile | null> {
  await ensureUserSchema();
  const rows = await getSql().query(
    `SELECT id, email, username, name, avatar, role, title, bio, tags, github, linkedin, website, commits, prs, lang, created_at, last_login_at
     FROM users WHERE email = $1 LIMIT 1`,
    [email.toLowerCase()]
  );
  return (rows[0] as MemberProfile) ?? null;
}

export async function getUserByIdentifier(identifier: string): Promise<MemberProfile | null> {
  await ensureUserSchema();
  const value = identifier.trim().toLowerCase();
  const rows = await getSql().query(
    `SELECT id, email, username, name, avatar, role, title, bio, tags, github, linkedin, website, commits, prs, lang, created_at, last_login_at
     FROM users WHERE email = $1 OR LOWER(username) = $1 LIMIT 1`,
    [value]
  );
  return (rows[0] as MemberProfile) ?? null;
}

export async function findUserByUsername(username: string, excludeId: number): Promise<MemberProfile | null> {
  await ensureUserSchema();
  const rows = await getSql().query(
    `SELECT id, email, username, name, avatar, role, title, bio, tags, github, linkedin, website, commits, prs, lang, created_at, last_login_at
     FROM users WHERE LOWER(username) = $1 AND id != $2 LIMIT 1`,
    [username.toLowerCase(), excludeId]
  );
  return (rows[0] as MemberProfile) ?? null;
}

export async function markLogin(email: string) {
  try {
    await getSql().query(
      "UPDATE users SET last_login_at = now() WHERE email = $1",
      [email.toLowerCase()]
    );
  } catch {
    // best-effort tracking; login flow must not fail because of it
  }
}

export async function getUserById(id: number): Promise<MemberProfile | null> {
  await ensureUserSchema();
  const rows = await getSql().query(
    `SELECT id, email, username, name, avatar, role, title, bio, tags, github, linkedin, website, commits, prs, lang, created_at, last_login_at
     FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as MemberProfile) ?? null;
}

export async function getPublicUsers(): Promise<MemberProfile[]> {
  await ensureUserSchema();
  const rows = await getSql().query(
    `SELECT id, email, username, name, avatar, role, title, bio, tags, github, linkedin, website, commits, prs, lang, created_at, last_login_at
     FROM users WHERE role = 'member' ORDER BY created_at ASC`,
    []
  );
  return rows as MemberProfile[];
}

export async function getLeaders(): Promise<MemberProfile[]> {
  await ensureUserSchema();
  const rows = await getSql().query(
    `SELECT id, email, username, name, avatar, role, title, bio, tags, github, linkedin, website, commits, prs, lang, created_at, last_login_at
     FROM users WHERE role = 'leader' ORDER BY created_at ASC`,
    []
  );
  return rows as MemberProfile[];
}

export async function getAllUsers(): Promise<MemberProfile[]> {
  await ensureUserSchema();
  const rows = await getSql().query(
    `SELECT id, email, username, name, avatar, role, title, bio, tags, github, linkedin, website, commits, prs, lang, created_at, last_login_at
     FROM users ORDER BY created_at ASC`,
    []
  );
  return rows as MemberProfile[];
}

export async function updateUser(id: number, values: Partial<Pick<MemberProfile, "username" | "name" | "avatar" | "role" | "title" | "bio" | "tags" | "github" | "linkedin" | "website" | "lang" | "commits" | "prs">>) {
  await ensureUserSchema();
  const fields = Object.entries(values).filter(([, value]) => value !== undefined);
  if (!fields.length) return getUserById(id);
  const allowed = new Set(["username", "name", "avatar", "role", "title", "bio", "tags", "github", "linkedin", "website", "lang", "commits", "prs"]);
  const valid = fields.filter(([key]) => allowed.has(key));
  const assignments = valid.map(([key], index) => `${key} = $${index + 1}`).join(", ");
  const rows = await getSql().query(
    `UPDATE users SET ${assignments} WHERE id = $${valid.length + 1}
     RETURNING id, email, username, name, avatar, role, title, bio, tags, github, linkedin, website, commits, prs, lang, created_at`,
    [...valid.map(([, value]) => value), id]
  );
  return (rows[0] as MemberProfile) ?? null;
}

export async function deleteUser(id: number) {
  await ensureProjectsTable();
  await getSql().query("DELETE FROM projects WHERE user_id = $1", [id]);
  await getSql().query("DELETE FROM users WHERE id = $1", [id]);
}

async function ensureProjectsTable() {
  await getSql().query(
    `CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      project_url TEXT NOT NULL DEFAULT '',
      github_url TEXT NOT NULL DEFAULT '',
      tags TEXT[] DEFAULT '{}',
      featured BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )`,
    []
  );
}

async function ensureCommunityMeetingTable() {
  await getSql().query(
    `CREATE TABLE IF NOT EXISTS community_meetings (
      id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      meeting_url TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
    []
  );
}

export async function getCommunityMeeting(): Promise<CommunityMeeting> {
  await ensureCommunityMeetingTable();
  const rows = await getSql().query(
    "SELECT meeting_url, updated_at FROM community_meetings WHERE id = 1 LIMIT 1",
    []
  );
  return (rows[0] as CommunityMeeting) ?? { meeting_url: "", updated_at: new Date(0) };
}

export async function updateCommunityMeeting(meetingUrl: string): Promise<CommunityMeeting> {
  await ensureCommunityMeetingTable();
  const rows = await getSql().query(
    `INSERT INTO community_meetings (id, meeting_url, updated_at)
     VALUES (1, $1, now())
     ON CONFLICT (id) DO UPDATE SET meeting_url = EXCLUDED.meeting_url, updated_at = now()
     RETURNING meeting_url, updated_at`,
    [meetingUrl]
  );
  return rows[0] as CommunityMeeting;
}

async function ensureDiscussionTables() {
  await getSql().query(
    `CREATE TABLE IF NOT EXISTS discussion_posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
    []
  );
  await getSql().query(
    `CREATE TABLE IF NOT EXISTS discussion_upvotes (
      post_id INTEGER NOT NULL REFERENCES discussion_posts(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (post_id, user_id)
    )`,
    []
  );
}

export async function getDiscussionPosts(
  viewerId: number,
  options?: { limit?: number; offset?: number; sort?: "new" | "top" }
): Promise<DiscussionPost[]> {
  await ensureDiscussionTables();
  const limit = Math.min(Math.max(Math.trunc(options?.limit ?? 20), 1), 100);
  const offset = Math.max(Math.trunc(options?.offset ?? 0), 0);
  const orderBy = options?.sort === "top"
    ? "upvote_count DESC, p.created_at DESC, p.id DESC"
    : "p.created_at DESC, p.id DESC";
  const rows = await getSql().query(
    `SELECT p.id, p.user_id, p.body, p.created_at, p.updated_at,
      u.name AS author_name, u.username AS author_username, u.avatar AS author_avatar, u.role AS author_role,
      COUNT(v.post_id)::int AS upvote_count,
      COALESCE(BOOL_OR(v.user_id = $1), false) AS has_upvoted
     FROM discussion_posts p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN discussion_upvotes v ON v.post_id = p.id
     GROUP BY p.id, u.id
     ORDER BY ${orderBy}
     LIMIT $2 OFFSET $3`,
    [viewerId, limit, offset]
  );
  return rows as DiscussionPost[];
}

export async function createDiscussionPost(userId: number, body: string): Promise<DiscussionPost> {
  await ensureDiscussionTables();
  const rows = await getSql().query(
    `WITH inserted AS (
       INSERT INTO discussion_posts (user_id, body) VALUES ($1, $2) RETURNING *
     )
     SELECT inserted.id, inserted.user_id, inserted.body, inserted.created_at, inserted.updated_at,
       u.name AS author_name, u.username AS author_username, u.avatar AS author_avatar, u.role AS author_role,
       0::int AS upvote_count, false AS has_upvoted
     FROM inserted JOIN users u ON u.id = inserted.user_id`,
    [userId, body]
  );
  return rows[0] as DiscussionPost;
}

export async function updateDiscussionPost(postId: number, body: string): Promise<DiscussionPost | null> {
  await ensureDiscussionTables();
  const rows = await getSql().query(
    `UPDATE discussion_posts SET body = $1, updated_at = now() WHERE id = $2
     RETURNING id, user_id, body, created_at, updated_at`,
    [body, postId]
  );
  return (rows[0] as DiscussionPost) ?? null;
}

export async function deleteDiscussionPost(postId: number) {
  await ensureDiscussionTables();
  await getSql().query("DELETE FROM discussion_posts WHERE id = $1", [postId]);
}

export async function getDiscussionPostOwner(postId: number): Promise<number | null> {
  await ensureDiscussionTables();
  const rows = await getSql().query("SELECT user_id FROM discussion_posts WHERE id = $1 LIMIT 1", [postId]);
  return rows[0] ? Number((rows[0] as { user_id: number }).user_id) : null;
}

export async function toggleDiscussionUpvote(postId: number, userId: number): Promise<{ upvoted: boolean; count: number }> {
  await ensureDiscussionTables();
  const existing = await getSql().query("SELECT 1 FROM discussion_upvotes WHERE post_id = $1 AND user_id = $2", [postId, userId]);
  const upvoted = existing.length === 0;
  await getSql().query(upvoted ? "INSERT INTO discussion_upvotes (post_id, user_id) VALUES ($1, $2)" : "DELETE FROM discussion_upvotes WHERE post_id = $1 AND user_id = $2", [postId, userId]);
  const countRows = await getSql().query("SELECT COUNT(*)::int AS count FROM discussion_upvotes WHERE post_id = $1", [postId]);
  return { upvoted, count: Number((countRows[0] as { count: number }).count) };
}

export async function getProjects(userId?: number): Promise<Project[]> {
  await ensureProjectsTable();
  const condition = userId ? "WHERE p.user_id = $1" : "";
  const rows = await getSql().query(
    `SELECT p.*, u.name AS member_name, u.avatar AS member_avatar, u.title AS member_title
     FROM projects p JOIN users u ON u.id = p.user_id ${condition}
     ORDER BY p.created_at DESC`,
    userId ? [userId] : []
  );
  return rows as Project[];
}

export async function createProject(userId: number, values: Omit<Project, "id" | "user_id" | "created_at" | "updated_at" | "member_name" | "member_avatar" | "member_title">) {
  await ensureProjectsTable();
  const rows = await getSql().query(
    `INSERT INTO projects (user_id, title, summary, description, image_url, project_url, github_url, tags, featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [userId, values.title, values.summary, values.description, values.image_url, values.project_url, values.github_url, values.tags ?? [], values.featured]
  );
  return rows[0] as Project;
}

export async function updateProject(id: number, userId: number, values: Partial<Omit<Project, "id" | "user_id" | "created_at" | "updated_at">>) {
  const fields = Object.entries(values).filter(([, value]) => value !== undefined);
  if (!fields.length) return null;
  const allowed = new Set(["title", "summary", "description", "image_url", "project_url", "github_url", "tags", "featured"]);
  const valid = fields.filter(([key]) => allowed.has(key));
  const assignments = valid.map(([key], index) => `${key} = $${index + 1}`).join(", ");
  const rows = await getSql().query(
    `UPDATE projects SET ${assignments}, updated_at = now() WHERE id = $${valid.length + 1} AND user_id = $${valid.length + 2} RETURNING *`,
    [...valid.map(([, value]) => value), id, userId]
  );
  return (rows[0] as Project) ?? null;
}

export async function deleteProject(id: number, userId?: number) {
  await ensureProjectsTable();
  await getSql().query(userId ? "DELETE FROM projects WHERE id = $1 AND user_id = $2" : "DELETE FROM projects WHERE id = $1", userId ? [id, userId] : [id]);
}

export async function createUser(values: {
  email: string;
  username?: string;
  name: string;
  avatar: string;
  role?: "admin" | "leader" | "member";
  title: string;
  bio: string;
  tags: string[];
  github: string;
  linkedin: string;
  website: string;
}): Promise<MemberProfile> {
  await ensureUserSchema();
  const role = values.role ?? "member";
  const rows = await getSql().query(
    `INSERT INTO users (email, username, name, avatar, role, title, bio, tags, github, linkedin, website)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id, email, username, name, avatar, role, title, bio, tags, github, linkedin, website, created_at`,
    [
      values.email,
      values.username?.toLowerCase() ?? null,
      values.name,
      values.avatar,
      role,
      values.title,
      values.bio,
      values.tags,
      values.github,
      values.linkedin,
      values.website,
    ]
  );
  return rows[0] as MemberProfile;
}
