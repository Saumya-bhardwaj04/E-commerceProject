# Pocket Cart (Dynamic Data)

A React + Vite shopping UI that loads products from an API, lets you search and filter by category, and manages a cart with quantity controls.

## Features
- Fetches products from a live API
- Search by product title and filter by category
- Add to cart, update quantity, remove items, clear cart
- Real payments via Razorpay (UPI + cards)
- Order tracking + order history

## Setup
1. Install dependencies: `npm install`
2. Start client only: `npm run dev`

## Real Payments (Razorpay)
This project uses a small Node/Express backend in `server/` to create Razorpay orders and verify payment signatures.

1. Create a Razorpay account and get **Test Mode** keys.
2. Create `server/.env` based on `server/.env.example` and set:
	- `RAZORPAY_KEY_ID`
	- `RAZORPAY_KEY_SECRET`
3. Run the backend and frontend:
	- Backend: `npm run dev:server` (http://localhost:5174)
	- Frontend: `npm run dev` (http://localhost:5173)
	- Or both together: `npm run dev:full`

After a successful payment, the app redirects to:
- `/orders/:orderId` (track order)
- `/orders` (order history stored on this device)

## API
Products: `https://dummyjson.com/products`

Backend endpoints (local):
- `POST /api/orders` create an order + Razorpay order
- `POST /api/payments/verify` verify Razorpay signature
- `GET /api/orders/:id` fetch order details

## Scripts
- `npm run dev` - start Vite dev server (client)
- `npm run dev:server` - start Express payment server
- `npm run dev:full` - run both client + server
- `npm run build` - production build
- `npm run preview` - preview production build

## Tech Stack
- React 19, Vite
- Tailwind CSS
- react-hot-toast
