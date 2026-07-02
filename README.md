# ScopeSync 🚀

> **A Full-Stack Project Management Dashboard for Developers**

A complete MERN stack project management application built for tracking projects across different methodologies (Waterfall, Agile, Scrum, Kanban). Features secure JWT authentication, multi-user support, and a modern dark-themed dashboard.

**Live Demo:** [scope-sync-virid.vercel.app](https://scope-sync-virid.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [API Endpoints](#-api-endpoints)
- [Usage Guide](#-usage-guide)
- [Authentication Flow](#-authentication-flow)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- ✅ **User Authentication** — Secure login/register with JWT tokens
- ✅ **Multi-Methodology Support** — Waterfall, Agile, Scrum, Kanban templates
- ✅ **Project Management** — Create, read, update, delete projects
- ✅ **Task Tracking** — Organize tasks by phases, track status (pending/progress/completed)
- ✅ **Admin Dashboard** — Full project management console
- ✅ **Client View** — Read-only shareable project links for clients
- ✅ **Phase-Based Organization** — Structured workflow with multiple phases per project

### Technical Highlights
- 🔐 **JWT Authentication** — Secure token-based auth with bcrypt password hashing
- 🗄️ **MongoDB Database** — NoSQL persistence with Mongoose ODM
- 🎨 **Modern UI** — Dark-themed, responsive design with Tailwind CSS
- 📱 **Mobile Responsive** — Works seamlessly on all devices
- 🔒 **CORS Protection** — Secure cross-origin requests
- 🚀 **Fast Build Process** — Vite for rapid development

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Used For |
|------------|---------|----------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 5.2.1 | Web server & routing |
| **MongoDB** | Latest | Database |
| **Mongoose** | 9.7.1 | Database schema & validation |
| **JWT** | Latest | Authentication tokens |
| **bcryptjs** | Latest | Password hashing |
| **CORS** | 2.8.6 | Cross-origin requests |
| **dotenv** | 17.4.2 | Environment variables |
| **Nodemon** | 3.1.14 | Development auto-reload |

### Frontend
| Technology | Version | Used For |
|------------|---------|----------|
| **React** | 19.2.6 | UI library |
| **Vite** | 8.0.12 | Build tool & dev server |
| **React Router** | 7.17.0 | Client-side routing |
| **React Hook Form** | 7.78.0 | Form handling & validation |
| **Tailwind CSS** | 4.3.0 | Styling |
| **react-hot-toast** | 2.6.0 | Notifications |

---

## 📁 Project Structure

```
ScopeSync/
│
├── client/                        # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Admin.jsx         # Admin management console
│   │   │   └── ClientView.jsx    # Read-only client dashboard
│   │   ├── components/
│   │   │   ├── ProjectDashboard.jsx  # Main dashboard component
│   │   │   └── Navbar.jsx            # Navigation
│   │   ├── routes.jsx            # React Router setup
│   │   ├── App.jsx               # Root component
│   │   └── main.jsx              # Entry point
│   ├── public/                   # Static files
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                        # Express Backend
│   ├── models/
│   │   ├── User.js              # User schema (email, password)
│   │   └── Project.js           # Project schema (phases, tasks)
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── projectRoutes.js     # Project CRUD endpoints
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── server.js                # App initialization
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- MongoDB account (Atlas or local instance)
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/deepakdev88/ScopeSync.git
cd ScopeSync
```

### Step 2: Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/scopesync
JWT_SECRET=your-secret-key-here-min-32-chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EOF

# Start server
npm run dev
```

**Backend runs on:** `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000
VITE_ADMIN_PASSWORD=1234
EOF

# Start dev server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

---

## ⚙️ Environment Configuration

### Backend `.env` File

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_key_minimum_32_characters_long_recommended

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` File

```env
# API Base URL
VITE_API_URL=http://localhost:5000

# Admin Password for console access
VITE_ADMIN_PASSWORD=1234
```

### Getting MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

---

## 📡 API Endpoints

### Authentication Routes

#### Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response (201):
{
  "success": true,
  "message": "User registration sequence verified.",
  "data": {
    "id": "user_mongodb_id",
    "email": "user@example.com"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "success": true,
  "message": "Authentication sequence established."
}
# Sets httpOnly JWT cookie automatically
```

#### Verify Session
```bash
GET /api/auth/verify
# Requires valid JWT cookie

Response (200):
{
  "success": true,
  "message": "Session verified. Token remains valid."
}
```

---

### Project Routes

#### Create Project
```bash
POST /api/projects
Authorization: (JWT cookie)
Content-Type: application/json

{
  "projectName": "E-commerce Platform",
  "models": "Agile",
  "phases": [
    {
      "phaseName": "Backlog",
      "tasks": []
    },
    {
      "phaseName": "In Progress",
      "tasks": []
    },
    {
      "phaseName": "Done",
      "tasks": []
    }
  ]
}

Response (201):
{
  "success": true,
  "data": { ...project object }
}
```

#### Get All Projects
```bash
GET /api/projects
Authorization: (JWT cookie)

Response (200):
{
  "success": true,
  "data": [
    { project1 },
    { project2 }
  ]
}
```

#### Get Single Project
```bash
GET /api/projects/:id
Authorization: (JWT cookie)

Response (200):
{
  "success": true,
  "data": { project object }
}
```

#### Update Project (Add/Modify Tasks)
```bash
PUT /api/projects/:id
Authorization: (JWT cookie)
Content-Type: application/json

{
  "phases": [
    {
      "phaseName": "Backlog",
      "tasks": [
        {
          "_id": "task_id",
          "name": "Setup database",
          "status": "completed"
        }
      ]
    }
  ]
}

Response (200):
{
  "success": true,
  "data": { updated project }
}
```

#### Delete Project
```bash
DELETE /api/projects/:id
Authorization: (JWT cookie)

Response (200):
{
  "success": true,
  "message": "Project deleted"
}
```

#### Delete Task
```bash
DELETE /api/tasks/:taskId
Authorization: (JWT cookie)

Response (200):
{
  "success": true,
  "data": { updated project }
}
```

---

## 🎯 Usage Guide

### 1. First Time Setup

1. Go to `http://localhost:5173`
2. Click **"Launch Developer Console"**
3. Enter password: **`1234`**
4. Click **"Initialize New Workspace"**

### 2. Create a Project

1. Enter project name (e.g., "Website Redesign")
2. Select methodology:
   - **Waterfall** — Sequential phases (Requirements → Design → Implementation → Verification)
   - **Agile** — Simple phases (Backlog → In Progress → Done)
   - **Scrum** — Sprint-based (Sprint Planning → Current Sprint → Retrospective)
   - **Kanban** — Continuous flow (To Do → Doing → Done)
3. Click "Initialize & Build Sync Link"

### 3. Manage Tasks

- **Add Task** — Click on a phase, type task name, press Enter
- **Change Status** — Click dropdown on task, select new status
- **Delete Task** — Click trash icon on task
- **Clear Phase** — Click "Wipe All Tasks" in phase header

### 4. Share with Clients

1. Click **"Share Stream Link"** button
2. Copy URL (e.g., `http://localhost:5173/project/project_id`)
3. Send to client
4. Client sees read-only dashboard with live status

---

## 🔐 Authentication Flow

```
1. User registers with email/password
   ↓
2. Password hashed with bcrypt (10 rounds)
   ↓
3. User stored in MongoDB
   ↓
4. User logs in
   ↓
5. Password verified against hash
   ↓
6. JWT token generated (24-hour expiry)
   ↓
7. Token stored in httpOnly cookie (secure against XSS)
   ↓
8. All API requests include JWT via cookie
   ↓
9. authMiddleware verifies token on every request
   ↓
10. Request allowed only if token valid
```

---

## 📊 Database Schema

### User Schema
```javascript
{
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    hashed: true  // bcrypt hashed
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Project Schema
```javascript
{
  projectName: String,
  userId: ObjectId,  // Links to User
  models: String,    // "Waterfall" | "Agile" | "Scrum" | "Kanban"
  phases: [
    {
      phaseName: String,
      tasks: [
        {
          id: String,
          name: String,
          status: "pending" | "progress" | "completed"
        }
      ]
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Features

### Implemented Security

1. **Password Security**
   - Passwords hashed with bcryptjs (10 salt rounds)
   - Secure comparison during login
   - Never stored in plain text

2. **JWT Authentication**
   - 24-hour token expiration
   - httpOnly cookies prevent XSS attacks
   - `sameSite: strict` prevents CSRF attacks

3. **Multi-Tenant Security**
   - Each user can only access their own projects
   - Server validates user ID on every request
   - Cannot access other users' data

4. **Network Security**
   - CORS enabled with frontend whitelist
   - Cookie credentials require same-origin
   - Environment variables protect secrets

### Recommendations for Production

Before deploying to production:

```javascript
// In authRoutes.js, change:
secure: false,  // ❌ Current (development)
// TO:
secure: true,   // ✅ Production (requires HTTPS)

// Use strong JWT_SECRET (min 32 chars)
JWT_SECRET=abcdefghijklmnopqrstuvwxyz123456

// Enable HTTPS on your domain
FRONTEND_URL=https://yourdomain.com
```

---

## 🚀 Deployment

### Deploy Backend (Render, Heroku, Railway)

1. Push code to GitHub
2. Create account on [Render](https://render.com) or [Railway](https://railway.app)
3. Connect GitHub repository
4. Set environment variables:
   ```
   MONGO_URI=your_production_mongodb
   JWT_SECRET=strong_secret_key
   FRONTEND_URL=your_frontend_url
   NODE_ENV=production
   PORT=5000
   ```
5. Deploy!

### Deploy Frontend (Vercel, Netlify)

1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set environment variables:
   ```
   VITE_API_URL=your_backend_url
   VITE_ADMIN_PASSWORD=secure_password
   ```
4. Deploy!

---

## 🛣️ Future Improvements

- [ ] Add refresh token rotation for better security
- [ ] Implement rate limiting on auth endpoints
- [ ] Add email verification for new accounts
- [ ] Create password reset functionality
- [ ] Add project templates/presets
- [ ] Implement team/collaboration features
- [ ] Add activity logging/audit trail
- [ ] Export projects to PDF/CSV
- [ ] Dark/Light mode toggle
- [ ] Real-time updates (Socket.io integration ready)

---

## 📄 License

ISC License - See LICENSE file

---

## 👤 Author

**Deepak Singh**
- GitHub: [@deepakdev88](https://github.com/deepakdev88)
- Email: deepaksingh.dev88@gmail.com

---

## 🤝 Contributing

Found a bug? Have a suggestion?

1. Open an issue on [GitHub](https://github.com/deepakdev88/ScopeSync/issues)
2. Describe the problem clearly
3. Include steps to reproduce (if bug)

---

**⭐ If you found this useful, please star the repository!**
