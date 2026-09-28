# FintechFlow — Personal Finance & Loan Manager

![Node](https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

A full-stack fintech web application for managing a digital wallet and
micro-loan applications. Deposit and withdraw virtual funds, browse
transaction history, apply for loans through a guided 3-step form, manage
applications with animated flip cards, and compute EMIs with a full
amortization schedule.

> Demo project — data lives in memory (no database) and resets when the
> server restarts.

## ✨ Features

- **Digital wallet** — deposits and withdrawals with server-side validation
- **Transaction history** — newest-first, with credit/debit filters and live search
- **Loan applications** — 3-step form with CNIC regex validation
- **Loan management** — approve/reject applications with CSS 3D flip cards
- **EMI calculator** — computed server-side (handles 0% rates); amortization table on the frontend
- **Dark/light theme** — persisted in `localStorage`
- **Polish** — toast notifications, skeleton loaders, animated counters, staggered card animations
- **Fully responsive** — mobile, tablet, and desktop

## 🛠️ Tech stack

- **Frontend**: React 18, Vite, React Router v6, custom CSS (no UI libraries)
- **Backend**: Node.js, Express.js
- **Storage**: In-memory (JS arrays/objects)

## ⚙️ Getting started

### Prerequisites

- Node.js 18+ and npm

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in values if needed
npm run dev            # or: npm start
```

| Variable | Description |
|---|---|
| `PORT` | API port (default `5000`) |
| `FRONTEND_URL` | Frontend origin allowed by CORS (optional in dev) |

The API runs on http://localhost:5000.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # only needed for deployments
npm run dev
```

The app opens at http://localhost:3000. In local dev, `/api` requests are
proxied to the backend automatically (see `vite.config.js`). For deployments,
point the frontend at the API with a `.env` file:

```
VITE_API_URL=https://your-backend.onrender.com
```

## 📂 Project structure

```
├── backend/
│   ├── routes/       # wallet, loans, EMI calculator
│   ├── server.js
│   └── .env.example
├── frontend/
│   └── src/
│       ├── components/   # Navbar, Skeleton, toasts
│       ├── context/      # AppContext (theme, toasts, API state)
│       ├── hooks/        # useCountUp
│       ├── pages/        # WalletDashboard, TransactionHistory, LoanApply,
│       │                 #   LoanStatus, EMICalculator
│       └── utils/        # helpers (API_BASE, formatPKR)
└── README.md
```

## 🔌 API endpoints

### Wallet

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/wallet` | Wallet info (balance, owner) |
| POST | `/api/wallet/deposit` | Add funds (`{ amount }`) — rejects non-positive amounts |
| POST | `/api/wallet/withdraw` | Deduct funds (`{ amount }`) — rejects insufficient balance |
| GET | `/api/transactions` | All transactions, newest-first; supports `?type=credit\|debit` |

### Loans

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/loans/apply` | Submit a loan application (`{ applicant, cnic, contact, amount, purpose, tenure }`) |
| GET | `/api/loans` | All loan applications |
| PATCH | `/api/loans/:id/status` | Approve or reject (`{ status: 'approved' \| 'rejected' }`) |
| GET | `/api/emi-calculator` | EMI calculation — query: `?principal=&annualRate=&months=` |

## 🚀 Deployment

- **Frontend (Vercel):** import the repo, set Root Directory to `frontend`, add env var `VITE_API_URL=https://your-backend.onrender.com`
- **Backend (Render):** new Web Service, Root Directory `backend`, build `npm install`, start `node server.js`, add env var `FRONTEND_URL=https://your-app.vercel.app`

## 📜 License

MIT — see [LICENSE](LICENSE).

---

**Author:** Muhammad Usman · FAST NUCES, Islamabad — BS Financial Technology (FinTech)
