# TaskFlow — Modern Task Manager

A full-stack, production-ready task management application built with **Next.js 16**, **TypeScript**, **Supabase**, **Tailwind CSS**, **shadcn/ui**, and **Framer Motion**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Supabase](https://img.shields.io/badge/Supabase-backend-green)

---

## Features

### Core Functionality
- **Authentication** — Secure sign-up, login, and protected routes via Supabase Auth
- **Task Management** — Create, edit, delete, complete, duplicate, and archive tasks
- **Project Management** — Organise tasks into projects with colour coding
- **Multiple Views**:
  - **Kanban Board** — Drag-and-drop tasks between status columns
  - **List View** — Sortable, filterable table of all tasks
  - **Calendar View** — See tasks by due date with a pending/overdue sidebar
- **Advanced Filtering** — Filter by priority, status, project, due date, and archived state
- **Sorting** — Sort by due date, priority, last updated, or alphabetically
- **Search** — Instant full-text search across title, description, and tags
- **Analytics Dashboard** — Charts and statistics showing productivity metrics
- **Bulk Actions** — Select multiple tasks to delete, complete, or change priority

### UI/UX
- **Dark Mode** — System-aware theme with manual toggle, no flash on load
- **Responsive** — Optimised for mobile, tablet, and desktop
- **Animations** — Smooth Framer Motion transitions throughout
- **Glassmorphism** — Modern glass-effect cards with gradient accents
- **Keyboard Shortcuts**:
  | Key | Action |
  |-----|--------|
  | `N` | New task |
  | `/` | Focus search |
  | `Ctrl/Cmd + K` | Open command palette |
  | `D` | Toggle dark mode |
  | `B` | Toggle sidebar |
  | `1` / `2` / `3` | Switch views |

### Technical
- **Full-stack** — Supabase PostgreSQL database with Row Level Security
- **Real-time ready** — Supabase client configured for real-time subscriptions
- **Type-safe** — Strict TypeScript throughout, including database query mappings
- **Form validation** — Zod schemas + React Hook Form
- **State management** — Zustand with localStorage persistence for UI preferences

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Animations | Framer Motion 12 |
| State | Zustand 5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |
| Date handling | date-fns |

---

## Project Structure

```
task-manager/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (fonts, theme, auth providers)
│   │   ├── globals.css             # Global styles and CSS tokens
│   │   ├── page.tsx                # Home page (Kanban view)
│   │   ├── tasks/                  # List view page
│   │   ├── calendar/               # Calendar view page
│   │   ├── analytics/              # Analytics dashboard
│   │   ├── projects/               # Projects management page
│   │   ├── settings/               # User settings page
│   │   ├── profile/                # User profile page
│   │   ├── login/                  # Login page
│   │   └── signup/                 # Sign-up page
│   ├── components/                 # Shared components
│   │   ├── ui/                     # shadcn/ui primitives
│   │   ├── layout.tsx              # Main app shell
│   │   ├── sidebar.tsx             # Navigation sidebar
│   │   ├── header.tsx              # Top bar (search, theme, user menu)
│   │   ├── project-modal.tsx       # Create/edit project modal
│   │   ├── protected-route.tsx     # Auth guard wrapper
│   │   ├── skeleton-loading.tsx    # Loading skeleton states
│   │   ├── command-palette.tsx     # Ctrl+K command palette
│   │   └── theme-provider.tsx      # Dark/light theme context
│   ├── contexts/
│   │   └── auth-context.tsx        # Supabase auth state + signIn/signOut
│   ├── features/                   # Feature-scoped components
│   │   ├── tasks/
│   │   │   ├── kanban-view.tsx     # Drag-and-drop Kanban board
│   │   │   ├── list-view.tsx       # Sortable list/table view
│   │   │   ├── calendar-view.tsx   # Calendar + pending tasks view
│   │   │   ├── task-modal.tsx      # Create/edit task form
│   │   │   └── task-filters.tsx    # Filter toolbar
│   │   └── analytics/
│   │       └── analytics-dashboard.tsx
│   ├── hooks/
│   │   └── use-keyboard-shortcuts.ts
│   ├── lib/
│   │   ├── store.ts                # Zustand store (all actions + Supabase calls)
│   │   ├── supabase.ts             # Supabase client initialisation
│   │   └── utils.ts                # Shared utility functions
│   └── types/
│       └── index.ts                # Global TypeScript types
├── supabase-schema.sql             # Full database schema
├── supabase-enable-rls.sql         # Row Level Security policies
├── supabase-migration-task-shares.sql
├── supabase-auto-create-profile.sql
├── .env.example                    # Environment variable template
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js 18+**
- **npm**, **yarn**, or **pnpm**
- A **Supabase** project ([create one free at supabase.com](https://supabase.com))

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd task-manager
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In your Supabase dashboard, open **SQL Editor** and run the contents of:
   - `supabase-schema.sql` — creates all tables
   - `supabase-enable-rls.sql` — enables Row Level Security policies
   - `supabase-auto-create-profile.sql` — sets up auto-profile trigger on signup

### 3. Configure Environment Variables

Copy the template and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Open `.env` and update:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here   # optional, for admin scripts
```

Find these values in your Supabase project under **Settings → API**.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login` if not authenticated.

---

## Building for Production

```bash
npm run build
npm start
```

Or deploy directly to **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

> Add your environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

---

## Database Schema

The application uses four primary tables:

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (auto-created on signup) |
| `projects` | Project groups with name and colour |
| `tasks` | Tasks with full metadata (status, priority, tags, assignee, etc.) |
| `task_shares` | Task sharing between users |

All tables have Row Level Security enabled — users can only access their own data.

---

## Architecture

### Authentication Flow
1. User signs up/in via Supabase Auth
2. `AuthContext` listens to `onAuthStateChange` and exposes `user`, `session`, and `loading`
3. `ProtectedRoute` wraps all pages — redirects to `/login` when unauthenticated

### State Management
- **Zustand** handles all client state (tasks, projects, filters, view mode, UI preferences)
- **Async actions** in the store call Supabase directly and update local state optimistically
- **Persisted to localStorage**: filter state, sort state, view mode, dark mode, sidebar open state (not task data — that lives in Supabase)

### Data Flow
```
User Action → Zustand Action → Supabase API call → Update local state → React re-render
```

---

## Key Features Deep Dive

### Kanban Board
- Four columns: **Todo**, **In Progress**, **Review**, **Completed**
- HTML5 drag-and-drop with visual column highlight on hover
- Automatic status update when a task is dropped into a new column

### Task Modal
- Full Zod-validated form with React Hook Form
- Supports: title, description, priority, status, due date, project, tags, assignee
- Inline error display and loading state on submit

### Calendar View
- Click any date to see tasks due on that day
- Underlined dates indicate tasks are scheduled
- Sidebar shows all overdue/pending tasks

### Analytics Dashboard
- Priority distribution (pie chart)
- Status overview (bar chart)
- Weekly activity (line chart)
- Live statistics cards (total, completed, overdue, etc.)

### Command Palette (`Ctrl/Cmd + K`)
- Navigate between pages
- Create a new task
- Toggle dark mode
- Full keyboard navigation

---

## Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `N` | Open new task modal |
| `/` | Focus search bar |
| `Ctrl/Cmd + K` | Open command palette |
| `D` | Toggle dark mode |
| `B` | Toggle sidebar |
| `1` | Switch to Kanban view |
| `2` | Switch to List view |
| `3` | Switch to Calendar view |
| `Escape` | Close modals / clear search |

---

## Accessibility

- Full keyboard navigation
- ARIA labels on all interactive elements
- Focus management in modals and dialogs
- High-contrast dark mode support
- Semantic HTML5 structure throughout

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |

---

## Roadmap

- [ ] Recurring tasks
- [ ] Task dependencies
- [ ] Pomodoro timer integration
- [ ] Export / import (JSON, CSV)
- [ ] Email notifications (via Supabase Edge Functions)
- [ ] Real-time collaboration
- [ ] Mobile app (React Native / Expo)
- [ ] Offline support (PWA)
- [ ] Advanced reporting & exports
- [ ] Team workspaces

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
