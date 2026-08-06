# tech_pals Website Documentation

## Overview

`tech_pals` is a Next.js community website for showcasing members, leaders, and member-built projects. It has three primary experiences:

- **Public site** — home page, leadership showcase, members showcase, and project directory.
- **Member workspace** — authenticated members update their profile, manage their links, change their password, and publish projects.
- **Admin console** — administrators create and manage member accounts, review profile completeness, moderate projects, export the roster, and reset member passwords.

The visual language uses a light developer-console style built with Tailwind CSS, Framer Motion, and Lucide icons.

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| UI | React, Tailwind CSS, Framer Motion, Lucide React |
| Database | Neon Postgres via `@neondatabase/serverless` |
| Authentication | Neon Auth email/password session cookies |
| Deployment target | Any Node.js-compatible Next.js host |

## Local Setup

### Requirements

- Node.js 18.17 or newer
- npm
- A Neon Postgres database
- A configured Neon Auth project

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```dotenv
DATABASE_URL=postgresql://...
NEON_AUTH_BASE_URL=https://...
NEON_AUTH_COOKIE_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`NEXT_PUBLIC_APP_URL` is used when creating password-reset links. Use the deployed HTTPS URL in production.

### Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

If a development server becomes unstable because multiple `next dev` processes share `.next`, stop all dev instances and start one process. For a production-style local run:

```bash
npm run build
npm run start
```

### Validate

```bash
npm run build
```

The build performs TypeScript validation and creates the production bundle.

## Application Structure

```text
src/
├── app/
│   ├── page.tsx                 # Public home page
│   ├── projects/page.tsx        # Public project directory
│   ├── member/page.tsx          # Authenticated member workspace
│   ├── dashboard/page.tsx       # Administrator console
│   ├── login/page.tsx           # Email/password sign-in
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── api/                     # Route handlers
├── components/                  # Public and workspace UI components
└── lib/
    ├── db.ts                    # Neon database access and schema helpers
    └── auth/                    # Neon Auth client/server helpers
docs/
└── README.md                    # This documentation
scripts/
└── seed.mjs                     # Optional initial database seed
```

## Roles and Visibility

| Role | Can sign in | Public placement | Management access |
| --- | --- | --- | --- |
| `member` | Yes | Members showcase | Own profile and own projects |
| `leader` | Yes | Leadership showcase | Own profile and own projects |
| `admin` | Yes | Not shown publicly | Full admin console plus member workspace |

Only administrators can create member accounts. Public member and leader sections intentionally use separate role-based API queries, so leaders and admins are never duplicated in the members showcase.

## Authentication Flow

1. An administrator creates a member from the admin console.
2. The server creates the account in Neon Auth and stores the public profile in the application `users` table.
3. A member signs in using **email and password** at `/login`.
4. The login route checks that a matching local profile exists before forwarding the email/password request to Neon Auth.
5. Neon Auth issues the secure session cookie, `__Secure-neon-auth.session_token`.
6. The session route returns basic account information to client pages.

### Protected Routes

`middleware.ts` redirects unauthenticated visitors from:

- `/member/*`
- `/dashboard/*`

The API routes also perform their own server-side authorization checks. The dashboard additionally checks the local user role before showing admin data.

## Database Model

### `users`

The application expects a `users` table with profile and community fields:

| Field | Purpose |
| --- | --- |
| `id` | Numeric primary key |
| `email` | Unique account email |
| `name`, `avatar` | Public identity and initials/avatar text |
| `role` | `admin`, `leader`, or `member` |
| `title`, `bio`, `tags`, `lang` | Public profile information |
| `github`, `linkedin`, `website` | Optional public links |
| `commits`, `prs` | Optional legacy profile metrics |
| `created_at` | Account creation timestamp |

The data layer also ensures an optional `username` column exists for compatibility with earlier versions. The current sign-in and account-creation flows use email only.

### `projects`

The project table is created automatically by the data layer when project APIs are first used.

| Field | Purpose |
| --- | --- |
| `id` | Numeric primary key |
| `user_id` | Project owner; references `users.id` |
| `title`, `summary`, `description` | Project content |
| `image_url` | Optional remote project image |
| `project_url`, `github_url` | Demo and source links |
| `tags` | Technology/category tags |
| `featured` | Allows a project to appear in featured areas |
| `created_at`, `updated_at` | Audit timestamps |

### Initial Seed

`scripts/seed.mjs` can initialize an early development database. Review it before use because it drops and recreates the `users` table.

## Public Pages

### Home (`/`)

The home page is composed from reusable components:

- `Hero` — introduction and primary calls to action.
- `HomeStats` — live member, leader, and project counts.
- `About` — community context.
- `Leaders` — live profiles with the `leader` role.
- `ProjectsPreview` — newest member projects.
- `Members` — live profiles with the `member` role only.
- `CommunityFlow` — invite → profile → publish workflow.
- `CTA` — explains invite-only membership.

### Project Directory (`/projects`)

The project directory fetches current data from `/api/projects` and supports:

- featured builds;
- full-text search across project and contributor information;
- tag filters;
- sorting by newest, featured, or alphabetical order;
- project image fallbacks;
- source-code and live-demo links;
- a member-workspace call to action when the directory is empty.

## Member Workspace

The member workspace at `/member` provides:

- profile editor modal;
- password-change modal;
- project creation and editing modal;
- project removal;
- profile-readiness score;
- join date and published-project activity;
- social-link readiness and quick links.

Members can only update their own profile and projects. Project ownership is enforced by the project route handlers.

## Admin Console

The admin console at `/dashboard` is divided into four tabs:

### Overview

- member, recent-member, incomplete-profile, and project KPIs;
- members who need profile attention;
- recent project uploads.

### Members

- searchable roster;
- role and profile-completeness filters;
- member detail modal;
- create and edit member modal;
- password reset emails;
- multi-select bulk role changes;
- multi-select password-reset action;
- CSV export;
- styled confirmation before account removal.

### Projects

- project moderation list;
- contributor and tag context;
- direct external-link opening;
- administrator project removal with confirmation.

### Activity

- a derived recent feed of member joins and project publications.

Administrators cannot remove administrator accounts through the management endpoint. They also cannot remove their own account.

## API Reference

All JSON responses use the route handler’s normal HTTP status codes. Authentication-required endpoints return `401`; insufficient role permissions return `403`.

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Sign in with email and password |
| `POST` | `/api/auth/logout` | End current session |
| `GET` | `/api/auth/session` | Return current Neon Auth account or `null` |
| `POST` | `/api/auth/change-password` | Change current authenticated account password |
| `POST` | `/api/auth/forgot-password` | Request reset email |
| `POST` | `/api/auth/reset-password` | Complete password reset with token |
| `POST` | `/api/auth/register` | Admin-only: create Neon Auth account and local profile |

### Profiles and Members

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/profile` | Return current member profile |
| `PATCH` | `/api/profile` | Update current member profile |
| `GET` | `/api/members` | Public member-role profiles only |
| `GET` | `/api/members?role=leader` | Public leader-role profiles only |
| `GET` | `/api/members?scope=all` | Full roster; only returned to an authenticated admin |
| `PATCH` | `/api/members/:id` | Admin-only member edit |
| `DELETE` | `/api/members/:id` | Admin-only member deletion with admin safeguards |
| `POST` | `/api/members/:id/password-reset` | Admin-only password-reset email |

### Projects

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/projects` | Current public project list |
| `POST` | `/api/projects` | Authenticated member creates own project |
| `PATCH` | `/api/projects/:id` | Owner updates own project |
| `DELETE` | `/api/projects/:id` | Owner deletes own project; admin may moderate any project |

The project list endpoint is configured as dynamic (`force-dynamic`) with no revalidation cache so new publications are available immediately.

## Operational Notes

### Adding a Leader

1. Open `/dashboard` as an administrator.
2. Open the Members tab.
3. Edit the member.
4. Set role to `leader` and save.

That profile will disappear from the public Members section and appear in the public Leaders section.

### Publishing a Project

1. Sign in as a member.
2. Open `/member`.
3. Select **new project**.
4. Add a title, summary, tags, optional image URL, source URL, and/or demo URL.
5. Publish.

The project appears in the public `/projects` directory and can appear in featured/home previews when marked featured in stored data.

### Changing the Main Admin

The current UI prevents ordinary admin-account deletion to avoid accidental lockout. Use a controlled database migration or an explicit, reviewed administration process for changes to administrator accounts.

## Security Checklist

- Keep `.env.local` out of source control.
- Use HTTPS in production so secure session cookies work correctly.
- Set `NEXT_PUBLIC_APP_URL` to the real deployed URL for reset links.
- Use strong admin passwords and rotate credentials when administrators change.
- Keep Neon Auth and database access credentials separate from client-side code.
- Review external project and social URLs before publishing them.
- Consider adding rate limits and an audit-log table before opening the site to a large community.

## Future Enhancements

- Uploaded image storage instead of external image URLs.
- Persistent administrator audit log.
- Project drafts, ordering, and analytics.
- Public member profile detail pages.
- Email templates and administrator notifications.
- Automated tests for API authorization and role visibility.
