# ScopeSync

> **A Full-Stack Project Management Dashboard for Developers**

ScopeSync is a MERN stack application for tracking development projects across multiple methodologies — Waterfall, Agile, Scrum, and Kanban. It features cross-domain JWT authentication with persistent sessions, multi-tenant data isolation, and a dark-themed dashboard UI.

---

## Live Application

- **Frontend:** [scope-sync-virid.vercel.app](https://scope-sync-virid.vercel.app)
- **Backend API:** [scopesync.onrender.com](https://scopesync.onrender.com)

---

## Key Features

- **Cross-Domain JWT Authentication** — Login/register with bcryptjs password hashing and HTTP-only cookies, working across separate Vercel/Render domains.
- **Persistent Sessions** — Sessions survive page reloads; the app checks for a valid auth cookie on load instead of forcing re-login every time.
- **Logout** — Securely clears the auth cookie on the server, ending the session.
- **Multi-Methodology Workspace** — Templates for Waterfall, Agile, Scrum, and Kanban workflows.
- **CRUD Operations** — Full control over projects, phases, and tasks.
- **Task Tracking** — Break projects into phases, track task status (Pending / In Progress / Completed).
- **Private by Default** — Every user's projects and tasks are isolated; no one else can see or access them.
- **Client Sharing** — Read-only shareable links so clients can view project status without an account.
- **Responsive UI** — Dark theme, Tailwind CSS.

---

## Tech Stack

- **Frontend:** React 19, Vite, React Router DOM, Tailwind CSS, React Hook Form
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Auth:** JSON Web Tokens (JWT), bcryptjs

---

## Project Structure

```
ScopeSync/
├── client/
│   └── src/
│       ├── pages/            # Home, Admin, ClientView
│       ├── components/
│       │   ├── admin/        # InitWindow, ProjectWizard, FinalWizard
│       │   ├── Auth.jsx
│       │   ├── ProjectDashboard.jsx
│       │   ├── Navbar.jsx
│       │   ├── LogoutButton.jsx
│       │   └── Footer.jsx
│       └── routes.jsx
│
└── server/
    ├── models/                # User, Project schemas
    ├── routes/                # authRoutes, projectRoutes
    └── middleware/            # authMiddleware (JWT verification)
```

---

## Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account or local MongoDB instance

### 1. Backend

```bash
cd server
npm install
```

Create `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_minimum_32_characters
FRONTEND_URL=http://localhost:5173
```
*No trailing slash on `FRONTEND_URL`.*

```bash
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

---

## Core API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Log in and issue an HTTP-only JWT cookie
- `POST /api/auth/logout` — Log out and clear the auth cookie
- `GET /api/auth/verify` — Check if the current session is still valid

### Projects (Protected — requires valid JWT cookie)
- `GET /api/projects` — Get all projects for the logged-in user
- `GET /api/projects/:id` — Get a single project by ID
- `POST /api/projects` — Create a new project
- `PUT /api/projects/:id` — Update a project's phases/tasks
- `DELETE /api/projects/:id` — Delete a single project
- `DELETE /api/projects` — Delete all of the user's projects
- `DELETE /api/tasks/:taskId` — Delete a single task

---

## Security

- **Password hashing:** bcryptjs, 10 salt rounds.
- **Cookies:** `httpOnly` always. In production, `secure: true` and `sameSite: 'none'` — required because frontend (Vercel) and backend (Render) are on different domains. In development, `sameSite: 'lax'`.
- **Trade-off:** `sameSite: 'none'` is necessary for cross-domain auth to work at all, but it weakens CSRF protection. There is currently no CSRF token implemented — this is a known gap, not an oversight left undocumented.
- **CORS:** single allowed origin, read from `FRONTEND_URL`. No wildcard, no multi-origin list.
- **Multi-tenancy:** middleware checks the JWT payload against resource ownership on every protected route.

`NODE_ENV=production` **must** be set on the Render deployment — the cookie's `secure`/`sameSite` values are conditional on it. If it's missing, login will silently break in production even though it works locally.

---

## Future Enhancements

- [ ] CSRF token protection
- [ ] Refresh token rotation
- [ ] Rate limiting on auth routes
- [ ] Email verification
- [ ] Password reset
- [ ] Real-time updates (Socket.io)

---

## Author

**Deepak Singh**
- GitHub: [@deepakdev88](https://github.com/deepakdev88)
- Email: deepaksingh.dev88@gmail.com
