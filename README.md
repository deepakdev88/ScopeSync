# ScopeSync 🚀

> **A Full-Stack Project Management Dashboard for Developers**

A production-ready MERN stack application for tracking projects across different methodologies (Waterfall, Agile, Scrum, Kanban). Secure JWT authentication, multi-user support, dark-themed dashboard.

---

## 🌐 Live Demo

- **Frontend:** [scope-sync-virid.vercel.app](https://scope-sync-virid.vercel.app)
- **Backend API:** [scopesync.onrender.com](https://scopesync.onrender.com)

---

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
│   ├── src/components/  # ProjectDashboard, Navbar
│   └── src/routes.jsx   # React Router config
│
└── server/              # Express Backend
    ├── models/          # User, Project schemas
    ├── routes/          # authRoutes, projectRoutes
    └── middleware/      # authMiddleware (JWT verification)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (Atlas or local)
- Git

### Backend Setup

```bash
cd server
npm install

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

```bash
cd client
npm install

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
```env
VITE_API_URL=http://localhost:5000
```

---

## 🛣️ Future Enhancements

- [ ] Refresh token rotation
- [ ] Rate limiting on auth
- [ ] Email verification
- [ ] Password reset
- [ ] Team collaboration
- [ ] Activity logging
- [ ] PDF/CSV export
- [ ] Real-time updates (Socket.io)

---

## 📄 License

ISC License

---

## 👤 Author

**Deepak Singh**
- GitHub: [@deepakdev88](https://github.com/deepakdev88)
- Email: deepaksingh.dev88@gmail.com
- Live: [scope-sync-virid.vercel.app](https://scope-sync-virid.vercel.app)

---

**⭐ Star this repo if you found it useful!**
