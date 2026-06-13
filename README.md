# 🛒 TrackSell- A Daily Sales Logger — MERN Stack

Hi, My name is Prathmesh Malunjkar(Prathm2005), I have developed,A simple app for kirana shop owners to log daily sales, track revenue, and see best-selling products.

---

## 📁 Structure

```
sales-logger/
├── server/    ← Express + MongoDB backend
└── client/    ← React + Tailwind frontend
```

---

## ⚙️ Setup

### Backend
```bash
cd server
npm install
```
Create `.env` file:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sales-logger
JWT_SECRET=any_random_secret
PORT=5000
```
```bash
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

---

## ✅ Features

- Register with shop name
- Add your products once (name, category, price, unit)
- Log daily sales — pick products, set quantity, price auto-fills
- Add multiple items per sale entry
- Filter sales by date range
- Export sales to CSV
- Dashboard with:
  - Today / This Week / This Month revenue
  - Bar chart — last 7 days
  - Top 5 best sellers this month

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register shop owner |
| POST | /api/auth/login | Login |
| GET | /api/products | Get all products |
| POST | /api/products | Add product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/sales | Get sales (with date filter) |
| GET | /api/sales/summary | Dashboard data |
| POST | /api/sales | Log new sale |
| DELETE | /api/sales/:id | Delete sale |

---

## 🚀 Deploy
I deploy the application on Vercel+render.
- Backend → Render.com
- Frontend → Vercel
- Database → MongoDB Atlas (free)

---
