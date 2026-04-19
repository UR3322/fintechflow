# FintechFlow — Personal Finance & Loan Manager

A full-stack fintech web application built with React.js (frontend) and Node.js/Express (backend).

**Student Name:** Muhammad Usman

**Roll No:** 22i-2288

---

## Project Description

FintechFlow allows users to:
- Manage a digital wallet (deposits & withdrawals)
- View transaction history with filters and live search
- Apply for micro-loans via a 3-step form with CNIC validation
- Approve/reject loan applications with animated flip cards
- Calculate loan EMI with a full amortization schedule

---

## Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18 + Vite + React Router v6 |
| Backend   | Node.js + Express.js          |
| Styling   | Custom CSS (no Bootstrap/Tailwind) |
| Storage   | In-memory (JS arrays/objects) |
| Deploy    | Vercel (frontend) + Render (backend) |

---

## How to Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:5000 for local dev
npm run dev
# Runs on http://localhost:3000
```

---

## API Endpoints

### Wallet

| Method | Endpoint              | Description                        | Body              | Status   |
|--------|-----------------------|------------------------------------|-------------------|----------|
| GET    | /api/wallet           | Get wallet info (balance, owner)   | —                 | 200      |
| POST   | /api/wallet/deposit   | Add funds. Rejects if amount ≤ 0   | `{ amount }`      | 200/400  |
| POST   | /api/wallet/withdraw  | Deduct funds. Rejects if insufficient | `{ amount }`   | 200/400  |
| GET    | /api/transactions     | All transactions, newest-first. Supports `?type=credit\|debit` | — | 200 |

### Loans

| Method | Endpoint                  | Description                              | Body                                      | Status       |
|--------|---------------------------|------------------------------------------|-------------------------------------------|--------------|
| POST   | /api/loans/apply          | Submit loan application                  | `{ applicant, cnic, contact, amount, purpose, tenure }` | 201/400 |
| GET    | /api/loans                | Get all loan applications                | —                                         | 200          |
| PATCH  | /api/loans/:id/status     | Approve or reject a loan                 | `{ status: 'approved'\|'rejected' }`      | 200/400/404  |
| GET    | /api/emi-calculator       | Calculate EMI (server-side)              | Query: `?principal=&annualRate=&months=`  | 200/400      |

---

## Deployment

- **Frontend (Vercel):** https://your-app.vercel.app
- **Backend (Render):** https://your-backend.onrender.com

### Deployment Steps

1. Push project to GitHub (public repo, with `/frontend` and `/backend` folders)
2. **Vercel:** Import repo → set Root Directory to `frontend` → add env var `VITE_API_URL=https://your-backend.onrender.com`
3. **Render:** New Web Service → Root Directory `backend` → Build: `npm install` → Start: `node server.js` → add env var `FRONTEND_URL=https://your-app.vercel.app`

---

## Features

- ✅ `useCountUp()` custom hook — no external library
- ✅ Toast notification system via React Context — no react-toastify
- ✅ 3-step loan form with CNIC regex validation (`/^\d{5}-\d{7}-\d{1}$/`)
- ✅ CSS 3D flip cards for loan management
- ✅ Skeleton loaders for every API call
- ✅ Dark/light theme persisted in `localStorage`
- ✅ Staggered slide-in animations on transaction cards
- ✅ `formatPKR()` utility used across all components
- ✅ Fully responsive (mobile / tablet / desktop)
- ✅ EMI computed server-side; amortization table built on frontend
