# FreelancerDesk

A full-stack freelancer management dashboard built with Next.js and Supabase. Manage clients, projects, tasks, and track your earnings — all in one place.

![FreelancerDesk Dashboard](https://knmvcfrdcooyzffvponx.supabase.co/storage/v1/object/public/assets/dashboard-preview.png)

---

## Features

- **Authentication** — Signup, login, logout, forgot/reset password via Supabase Auth
- **Clients** — Add and manage clients with contact info, notes, and active/inactive status derived from linked projects
- **Projects** — Track projects with start/due dates, status, and priority auto-computed from due date
- **Tasks** — Manage tasks standalone or linked to a project, with kanban-style statuses
- **Earnings** — Log income entries and visualize monthly revenue with an area chart
- **Analytics** — Year/month breakdown, growth tracking vs previous month, best month stats
- **Dashboard overview** — At-a-glance stats, upcoming deadlines, pending tasks, revenue chart
- **Settings** — Update profile name and password
- **Responsive** — Sidebar on desktop, top nav on mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Project Structure

```
freelancers-dashboard-app/
├── supabase/
│   ├── migrations/          # SQL migration files
│   │   ├── 001_init_profiles.sql
│   │   ├── 002_init_clients.sql
│   │   ├── 003_init_projects.sql
│   │   ├── 004_init_tasks.sql
│   │   └── 005_init_earnings.sql
│   └── seed.sql             # Dev seed data
├── middleware.js             # Auth route protection
└── src/
    ├── app/
    │   ├── (auth)/           # Login, signup, forgot/reset password
    │   └── (dashboard)/
    │       └── dashboard/    # Protected routes
    │           ├── page.jsx          # Overview
    │           ├── clients/
    │           ├── projects/
    │           ├── tasks/
    │           ├── analytics/
    │           └── settings/
    ├── components/
    │   ├── layout/           # Sidebar, Topbar, DashboardLayout
    │   ├── ui/               # StatCard, Badge, Drawer, SearchBar, Skeleton...
    │   ├── clients/          # ClientList, ClientGrid, ClientForm
    │   ├── projects/         # ProjectList, ProjectGrid, ProjectForm
    │   └── tasks/            # TaskList, TaskForm
    └── lib/
        ├── supabase/         # Browser and server clients
        ├── queries/          # DB queries per entity
        ├── hooks/            # React hooks wrapping queries
        └── utils/            # formatters, validators
```

---

## Getting Started

### Prerequisites

- Node.js v22+
- A [Supabase](https://supabase.com) account

### 1. Clone the repository

```bash
git clone https://github.com/Ayungcodes/FreelancerDesk.git
cd freelancers-dashboard-app
```
### 2. Install dependencies

```bash
cd src
npm install
```

### 3. Set up Supabase

Create a new Supabase project, then go to **SQL Editor** and run each migration file in order:

```
supabase/migrations/001_init_profiles.sql
supabase/migrations/002_init_clients.sql
supabase/migrations/003_init_projects.sql
supabase/migrations/004_init_tasks.sql
supabase/migrations/005_init_earnings.sql
```

### 4. Configure environment variables

Create a `.env` file inside the `src/` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get both values from **Supabase dashboard → Project Settings → API**.

> ⚠️ Use the **anon/public** key — never the service role key.

### 5. Run the dev server

```bash
cd src
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login`.

---

## Database Schema

```
profiles        — extends auth.users (auto-created on signup via trigger)
clients         — freelancer's clients, linked to user
projects        — linked to a client and user, with status and due date
tasks           — linked to a project (optional) and user
earnings        — income entries linked to user, used for analytics
monthly_earnings — view that groups earnings by month/year per user
```

All tables have **Row Level Security (RLS)** enabled — users can only read and write their own data.

---

## Seed Data

To populate your account with test data:

1. Sign up in the app first
2. Run this in Supabase SQL Editor to get your user ID:
   ```sql
   SELECT id FROM auth.users LIMIT 1;
   ```
3. Replace `00000000-0000-0000-0000-000000000000` in `supabase/seed.sql` with your ID
4. Paste the entire seed file into SQL Editor and run it

---

## Deployment

This app is deployed on Vercel. See the [deployment guide](#deploying-to-vercel) below.

### Deploying to Vercel

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set the **Root Directory** to `src`
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

---

## License

MIT