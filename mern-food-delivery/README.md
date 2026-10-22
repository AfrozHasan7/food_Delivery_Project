# QuickBite — MERN Food Delivery Starter

A full-stack food delivery college project built with MongoDB, Express, React, and Node.js.

## Features
- Responsive restaurant-style home page
- Menu listing with category filters and search
- Add/remove items and quantity controls in cart
- Register/login with JWT authentication
- Checkout and order creation
- My Orders page
- Seed script for sample menu items
- Express validation and centralized error handling

## Requirements
- Node.js 18+
- MongoDB Community Server or MongoDB Atlas

## 1. Configure the backend
```bash
cd server
cp .env.example .env
```
Edit `.env` and set `MONGO_URI` and a long `JWT_SECRET`.

## 2. Install and seed
```bash
npm install
npm run seed
npm run dev
```
API runs at `http://localhost:5000`.

## 3. Configure the frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in your terminal (usually `http://localhost:5173`).

## Demo flow
1. Browse the menu and add items to your cart.
2. Register or sign in.
3. Open Cart and place an order.
4. Open My Orders to see your order history.

## API overview
| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| GET | `/api/foods` | No | List/search/filter foods |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/orders` | Yes | Place order |
| GET | `/api/orders/my` | Yes | Current user's orders |

## Notes before submission
- This is a learning starter, not a production payment system.
- Checkout uses cash on delivery as a demo; no real payment is taken.
- Add rate limiting, email verification, secure deployment settings, image hosting, and a real payment provider before production.
- Never commit `.env` or real secrets.
