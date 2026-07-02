<<<<<<< HEAD
# ScopeSync

> **A Full-Stack Project Management Dashboard for Developers**

ScopeSync is a MERN stack application for tracking development projects across multiple methodologies — Waterfall, Agile, Scrum, and Kanban. It features cross-domain JWT authentication, multi-tenant data isolation, and a dark-themed dashboard UI.

---

## Live Application
=======
# ScopeSync 🚀

> **A Full-Stack Project Management Dashboard for Developers**

A production-ready MERN stack application for tracking projects across different methodologies (Waterfall, Agile, Scrum, Kanban). Secure JWT authentication, multi-user support, dark-themed dashboard.

---

## 🌐 Live Demo
>>>>>>> cc6b6e9d76de4b04eb41fffe4d20dc01d93b852e

- **Frontend:** [scope-sync-virid.vercel.app](https://scope-sync-virid.vercel.app)
- **Backend API:** [scopesync.onrender.com](https://scopesync.onrender.com)

---

<<<<<<< HEAD
## Key Features

- **Cross-Domain JWT Authentication** — Login/register with bcryptjs password hashing and HTTP-only cookies, working across separate Vercel/Render domains.
- **Multi-Methodology Workspace** — Templates for Waterfall, Agile, Scrum, and Kanban workflows.
- **CRUD Operations** — Full control over projects, phases, and tasks.
- **Task Tracking** — Break projects into phases, track task status (Pending / In Progress / Completed).
- **Multi-Tenant Isolation** — Users can only access their own data.
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
├── client/              # React Frontend (Vite)
│   ├── src/pages/       # Home, Admin Dashboard, ClientView
=======
## ✨ Key Features

- ✅ **JWT Authentication** — Secure login/register with bcrypt password hashing
- ✅ **Project Management** — Create, update, delete projects with CRUD operations
- ✅ **Multi-Methodology** — Waterfall, Agile, Scrum, Kanban templates
- ✅ **Task Tracking** — Organize tasks by phases, track status (pending/progress/completed)
- ✅ **Client Sharing** — Read-only shareable project links
- ✅ **Responsive UI** — Dark theme, mobile-friendly Tailwind CSS design
- ✅ **Multi-Tenant** — Complete data isolation per user

---

## 🛠️ Tech Stack

**Backend:** Node.js • Express • MongoDB • Mongoose • JWT • bcryptjs  
**Frontend:** React 19 • Vite • React Router • Tailwind CSS • React Hook Form

---

## 📁 Project Structure

```
ScopeSync/
├── client/              # React Frontend
│   ├── src/pages/       # Home, Admin, ClientView
>>>>>>> cc6b6e9d76de4b04eb41fffe4d20dc01d93b852e
│   ├── src/components/  # ProjectDashboard, Navbar
│   └── src/routes.jsx   # React Router config
│
└── server/              # Express Backend
    ├── models/          # User, Project schemas
    ├── routes/          # authRoutes, projectRoutes
    └── middleware/      # authMiddleware (JWT verification)
```

---

<<<<<<< HEAD
## Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account or local MongoDB instance

### 1. Backend
=======
## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (Atlas or local)
- Git

### Backend Setup
>>>>>>> cc6b6e9d76de4b04eb41fffe4d20dc01d93b852e

```bash
cd server
npm install
<<<<<<< HEAD
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
=======

# Create .env
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/scopesync
JWT_SECRET=your_secret_key_min_32_chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EOF

npm run dev
```

Backend: `http://localhost:5000`

### Frontend Setup
>>>>>>> cc6b6e9d76de4b04eb41fffe4d20dc01d93b852e

```bash
cd client
npm install
<<<<<<< HEAD
```

Create `.env`:
=======

# Create .env
cat > .env << EOF
VITE_API_URL=http://localhost:5000
EOF

npm run dev
```

Frontend: `http://localhost:5173`

---

## 📡 Core API Endpoints

### Authentication
- `POST /api/auth/register` — Create new user account
- `POST /api/auth/login` — Login with email/password (sets JWT cookie)
- `GET /api/auth/verify` — Verify current session

### Projects (requires JWT)
- `POST /api/projects` — Create new project
- `GET /api/projects` — Get all user projects
- `GET /api/projects/:id` — Get specific project
- `PUT /api/projects/:id` — Update project phases/tasks
- `DELETE /api/projects/:id` — Delete project
- `DELETE /api/tasks/:taskId` — Delete specific task

---

## 🎯 How to Use

1. **Sign Up** — Create account with email/password
2. **Create Project** — Choose methodology (Waterfall/Agile/Scrum/Kanban)
3. **Add Tasks** — Click phase → type task → press Enter
4. **Update Status** — Drag or click dropdown to change task status
5. **Share Link** — Click "Share Stream Link" for client access

---

## 🔐 Security Features

- **Password Hashing** — bcryptjs (10 salt rounds)
- **JWT Tokens** — 24-hour expiration, httpOnly cookies
- **XSS Protection** — httpOnly, Secure cookies
- **CSRF Protection** — sameSite: strict
- **Multi-Tenant** — Users can only access their own data

---

## 📊 Database Schema

**User:**
```javascript
{ email, password (hashed), createdAt, updatedAt }
```

**Project:**
```javascript
{
  projectName,
  user (owner),
  models (Waterfall/Agile/Scrum/Kanban),
  phases: [{ phaseName, tasks: [{ name, status }] }],
  createdAt, updatedAt
}
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repo to [Vercel](https://vercel.com)
2. Set `VITE_API_URL=your_backend_url`
3. Deploy!

### Backend (Render)
1. Connect GitHub repo to [Render](https://render.com)
2. Set environment variables:
   - `MONGO_URI` — MongoDB Atlas connection
   - `JWT_SECRET` — Strong secret key
   - `FRONTEND_URL` — Your frontend URL
3. Deploy!

---

## 📝 Environment Variables

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_super_secret_key_min_32_characters
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
>>>>>>> cc6b6e9d76de4b04eb41fffe4d20dc01d93b852e
```env
VITE_API_URL=http://localhost:5000
```

<<<<<<< HEAD
```bash
npm run dev
```

---

## Core API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Authenticate and issue an HTTP-only JWT cookie
- `GET /api/auth/verify` — Validate the active session

### Projects (Protected — requires valid JWT cookie)
- `GET /api/projects` — Fetch all projects for the authenticated user
- `POST /api/projects` — Create a new project
- `PUT /api/projects/:id` — Update a project's phases/tasks
- `DELETE /api/projects/:id` — Delete a project

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
=======
---

## 🛣️ Future Enhancements

- [ ] Refresh token rotation
- [ ] Rate limiting on auth
- [ ] Email verification
- [ ] Password reset
- [ ] Team collaboration
- [ ] Activity logging
- [ ] PDF/CSV export
>>>>>>> cc6b6e9d76de4b04eb41fffe4d20dc01d93b852e
- [ ] Real-time updates (Socket.io)

---

<<<<<<< HEAD
## Author
=======
## 📄 License

ISC License

---

## 👤 Author
>>>>>>> cc6b6e9d76de4b04eb41fffe4d20dc01d93b852e

**Deepak Singh**
- GitHub: [@deepakdev88](https://github.com/deepakdev88)
- Email: deepaksingh.dev88@gmail.com
<<<<<<< HEAD
=======
- Live: [scope-sync-virid.vercel.app](https://scope-sync-virid.vercel.app)

---

**⭐ Star this repo if you found it useful!**
>>>>>>> cc6b6e9d76de4b04eb41fffe4d20dc01d93b852e
