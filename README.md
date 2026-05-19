<div align="center">

# 🚀 Synchro PMS

### A premium, modern Project Management SaaS built with the MERN stack

Inspired by Linear, Notion, Jira, and Monday.com — Synchro brings projects, tasks, files, and team collaboration into one beautiful, lightning-fast workspace.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MERN](https://img.shields.io/badge/Stack-MERN-success)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/atlas)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101.svg)](https://socket.io/)

[Live Demo](#) · [Report Bug](https://github.com/Anjef/synchro-pms/issues) · [Request Feature](https://github.com/Anjef/synchro-pms/issues)

</div>

---

## ✨ Features

### 🎨 Premium UI/UX
- 🌗 **Light/Dark mode** with smooth transitions
- 💎 Glassmorphism + minimal design (Linear/Notion inspired)
- ✨ Framer Motion animations throughout
- 📱 Fully responsive (mobile-first)
- ⚡ Optimistic UI updates for instant feedback

### 🔐 Authentication & Security
- 🔑 JWT-based authentication with HTTP-only cookies
- 👥 Role-based access control (Admin, PM, Member, Client)
- 📧 Email-based password reset (Nodemailer + Gmail SMTP)
- 🛡️ Helmet, CORS, rate limiting, XSS protection
- ✅ Express-validator for input validation

### 📊 Project & Task Management
- 📋 **Kanban board** with drag-and-drop (4 status columns)
- 📅 **Timeline calendar** view
- ✅ Subtasks, comments, file attachments
- 🏷️ Tags, labels, priorities (Low → Urgent)
- 🎯 Milestones tracking
- 🔍 Live search across projects and tasks

### ⚡ Realtime Collaboration
- 🟢 **Socket.IO** for live updates
- 💬 Realtime comments
- 🔔 Live notifications with bell badge
- 👥 Online presence indicators
- ⌨️ Typing indicators in comments

### 📁 File Management
- ☁️ **Cloudinary** integration for storage
- 🖼️ Image previews
- 📎 Up to 10 MB per file
- 🔒 Plan-based upload limits

### 📈 Analytics & Reporting
- 📊 Productivity charts (Recharts)
- 🎯 Completion rate tracking
- 👤 Team performance breakdown
- 📅 Last-7-days activity feed
- 📋 Status/priority distribution

### 💳 SaaS Features (Nepal-friendly!)
- 🆓 **14-day free Pro trial** for every new user
- 💵 **4 pricing tiers**: Free, Pro, Business, Enterprise
- 🇳🇵 **eSewa** payment integration
- 🇳🇵 **Khalti** payment integration
- 🔒 Feature gating per plan
- 📊 Usage limits enforcement
- 🧾 Payment history dashboard
- 🛠️ Dev-mode quick plan switching

### 👑 Admin Panel
- 👥 User management (activate/deactivate, role changes)
- 📈 Platform-wide statistics
- 📜 Activity logs
- 🛡️ Admin-only routes

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Redux Toolkit** | Global state management |
| **Context API** | Auth, Theme, Subscription state |
| **Framer Motion** | Animations |
| **Recharts** | Data visualization |
| **@hello-pangea/dnd** | Drag and drop |
| **Axios** | HTTP client |
| **Socket.IO Client** | Realtime updates |
| **React Hot Toast** | Notifications |
| **Date-fns** | Date formatting |
| **React Icons** | Icon library |
| **Normal CSS** | Styling (no Tailwind) |

### Backend
| Tech | Purpose |
|------|---------|
| **Node.js** | Runtime |
| **Express.js** | Web framework |
| **MongoDB Atlas** | Database |
| **Mongoose** | ODM |
| **Socket.IO** | WebSocket server |
| **JWT** | Authentication |
| **Bcrypt.js** | Password hashing |
| **Cloudinary** | File storage |
| **Multer** | File upload handling |
| **Nodemailer** | Email service |
| **Helmet** | Security headers |
| **CORS** | Cross-origin requests |
| **Express Rate Limit** | DDoS protection |
| **Morgan** | HTTP logging |

### Payment Gateways
- 🇳🇵 **eSewa** — Nepal's largest digital wallet
- 🇳🇵 **Khalti** — Modern Nepali payment platform

---

## 📂 Project Structure

```
project-management-system/
├── client/                          # React frontend (Vercel-ready)
│   ├── public/
│   ├── src/
│   │   ├── api/                     # Axios + Socket.IO config
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── billing/             # Subscription components
│   │   │   ├── common/              # Reusable (Button, Modal, etc.)
│   │   │   ├── dashboard/
│   │   │   ├── layout/              # Sidebar, Topbar, Layouts
│   │   │   ├── notifications/
│   │   │   ├── projects/
│   │   │   ├── public/              # Landing page sections
│   │   │   └── tasks/               # Kanban, TaskCard, etc.
│   │   ├── context/                 # AuthContext, ThemeContext
│   │   ├── hooks/                   # useAuth, useTheme, useSocket
│   │   ├── pages/
│   │   │   ├── auth/                # Login, Register, etc.
│   │   │   └── public/              # Landing, Pricing
│   │   ├── redux/                   # Store + slices
│   │   ├── routes/                  # AppRoutes, ProtectedRoute
│   │   ├── services/                # API service layer
│   │   ├── styles/                  # Global CSS + animations
│   │   ├── utils/                   # Helpers, constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                         # Environment variables
│   ├── index.html
│   └── package.json
│
├── server/                          # Node.js backend (Render-ready)
│   ├── config/                      # DB, Cloudinary, Email
│   ├── controllers/                 # Route handlers
│   ├── middleware/                  # Auth, error, upload, plan
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API routes
│   ├── sockets/                     # Socket.IO handlers
│   ├── utils/                       # Helpers, seeder
│   ├── validators/                  # Input validation
│   ├── .env                         # Environment variables
│   ├── server.js                    # Entry point
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** account ([Free signup](https://www.mongodb.com/cloud/atlas))
- **Cloudinary** account ([Free signup](https://cloudinary.com/users/register/free))
- **Gmail** account with App Password ([Guide](https://support.google.com/accounts/answer/185833))

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Anjef/synchro-pms.git
cd synchro-pms
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/synchro-pms

# JWT
JWT_SECRET=your_super_long_random_secret_min_32_chars
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES=7

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail SMTP (use App Password, not regular password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
EMAIL_FROM=Synchro PMS <your_email@gmail.com>

# eSewa (test credentials work out of the box)
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_PAYMENT_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_VERIFY_URL=https://rc.esewa.com.np/api/epay/transaction/status/

# Khalti (sign up at test-admin.khalti.com)
KHALTI_SECRET_KEY=your_khalti_test_secret_key
KHALTI_PUBLIC_KEY=your_khalti_test_public_key
KHALTI_INIT_URL=https://a.khalti.com/api/v2/epayment/initiate/
KHALTI_VERIFY_URL=https://a.khalti.com/api/v2/epayment/lookup/
```

Seed the database with sample data:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000` ✅

### 3️⃣ Frontend Setup

In a **new terminal**:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173` ✅

### 4️⃣ Login with Seeded Accounts

All passwords: `123456`

| Email | Role | Plan |
|-------|------|------|
| `sarah@synchro.com` | Admin | Business |
| `kiara@synchro.com` | Project Manager | Pro |
| `joe@synchro.com` | Team Member | Pro (Trial) |
| `tania@synchro.com` | Team Member | Pro (Trial) |
| `marcus@synchro.com` | Team Member | Pro (Trial) |

---

## 🧪 Test Payment Gateways

### eSewa (Test Mode)
- **eSewa ID:** `9806800001`
- **Password:** `Nepal@123`
- **MPIN:** `1122`
- **OTP:** `123456`

### Khalti (Test Mode)
- **Phone:** `9800000000`
- **MPIN:** `1111`
- **OTP:** `987654`

---

## 📜 Available Scripts

### Backend (`server/`)
```bash
npm run dev          # Start with nodemon (auto-reload)
npm run start        # Start production server
npm run seed         # Populate DB with sample data
npm run seed:destroy # Wipe all data from DB
```

### Frontend (`client/`)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🌍 Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) → Import Repository
3. **Root Directory:** `client`
4. **Framework Preset:** Vite
5. Add environment variables:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://your-backend.onrender.com`
6. Deploy ✅

### Backend → Render

1. Push your code to GitHub
2. Visit [render.com](https://render.com) → New Web Service
3. **Root Directory:** `server`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add all environment variables from `.env`
7. Update `CLIENT_URL` to your Vercel URL
8. Deploy ✅

> **Note:** Update MongoDB Atlas → Network Access → Add `0.0.0.0/0` to allow Render's IPs.

---

## 💰 Subscription Plans

| Plan | Price | Projects | Members | Storage | Features |
|------|-------|----------|---------|---------|----------|
| **Free** | Rs. 0 | 3 | 1 | 0 GB | Basic kanban |
| **Pro** ⭐ | Rs. 999/mo | ∞ | 10 | 10 GB | Realtime, goals, uploads |
| **Business** | Rs. 2,999/mo | ∞ | 50 | 100 GB | + Analytics, admin, portfolio |
| **Enterprise** | Custom | ∞ | ∞ | ∞ | SSO, dedicated support |

> 🎁 All new users get a **14-day Pro trial**, no credit card required!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 👤 Author

**Anjef**

- GitHub: [@Anjef](https://github.com/Anjef)

---

## 🙏 Acknowledgements

- 🎨 UI/UX inspired by [Linear](https://linear.app), [Notion](https://notion.so), [Monday.com](https://monday.com)
- 📸 Avatar images from [Unsplash](https://unsplash.com)
- 🎭 Icons by [React Icons](https://react-icons.github.io/react-icons/)
- 💳 Payment integration courtesy of [eSewa](https://esewa.com.np) and [Khalti](https://khalti.com)
- 🚀 Built with the legendary **MERN** stack

---

<div align="center">

### ⭐ If you found this project useful, please consider giving it a star!

**Crafted with ❤️ by Anjef**

</div>