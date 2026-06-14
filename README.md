# CoreInventory 🏭

A full-stack Inventory Management System built with Next.js, TypeScript, and MongoDB.

## Tech Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Next.js API Routes
- **Database**: MongoDB

---

## ⚡ Quick Start (3 steps)

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Set up MongoDB
**Option A — Local MongoDB** (already configured in `.env.local`):
Make sure MongoDB is running on your machine, then skip to Step 3.

**Option B — MongoDB Atlas (free cloud)**:
1. Go to https://www.mongodb.com/atlas and create a free account
2. Create a free cluster
3. Get your connection string
4. Open `.env.local` and replace with:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net
MONGODB_DB=coreinventory
```

### Step 3 — Seed & Run
```bash
npm run seed    # fills the database with sample data
npm run dev     # starts the app on http://localhost:3000
```

---

## 🔑 Login Credentials

| Email | Password | Role |
|-------|----------|------|
| manager@coreinventory.com | password123 | Manager |
| staff@coreinventory.com | password123 | Staff |

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/           # login, register, me
│   │   ├── products/       # CRUD products
│   │   ├── warehouses/     # CRUD warehouses
│   │   ├── inventory/      # receipt, delivery, transfer, adjust, history
│   │   └── dashboard/      # stats & charts
│   └── page.tsx
├── components/             # UI components (shadcn/ui)
├── lib/
│   ├── mongodb.ts          # MongoDB connection
│   ├── models.ts           # Collection schemas & indexes
│   ├── db.ts               # DataStore (MongoDB-backed)
│   ├── stock-utils.ts      # Stock operations
│   ├── auth.ts             # Auth helpers
│   ├── seed.ts             # Database seed script
│   └── types.ts            # TypeScript interfaces
├── hooks/                  # React hooks
├── .env.local              # ← your MongoDB URI goes here
└── package.json
```

---

## 🗄️ Database Collections

| Collection | Description |
|------------|-------------|
| `users` | Manager and staff accounts |
| `products` | Product catalog (SKU, category, reorder levels) |
| `warehouses` | Warehouse locations |
| `inventory` | Stock levels per product per warehouse |
| `movements` | Full audit trail of all stock movements |
