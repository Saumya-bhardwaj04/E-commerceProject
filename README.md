# Pocket Cart (Dynamic Data)

A React + Vite e-commerce demo that fetches products from DummyJSON, supports a cart, a product details page, and a Razorpay (test mode) checkout.

## What you get
- Product listing + search + category filter
- Product details page: `/product/:id`
- Cart with quantity controls (saved in localStorage)
- Razorpay checkout (test mode) + payment verification
- Orders:
	- `/orders` (list)
	- `/orders/:orderId` (details)

Note: Available payment methods depend on your Razorpay account settings. This build does not show a separate UPI option in the UI.

## Run locally
1. Install:
	 - `npm install`
2. Create backend env:
	 - `server/.env`
	 - Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (Test Mode keys)
3. Start both servers:
	 - `npm run dev:full`

Client: http://localhost:5173
Server: http://localhost:5174

## Backend (server/)
The Node/Express server creates Razorpay orders and verifies the payment signature.

Local endpoints:
- `GET /api/health`
- `POST /api/orders`
- `POST /api/payments/verify`
- `GET /api/orders/:id`

## Data & persistence (important)
- Cart is stored in your browser (localStorage).
- Order list is stored on your device (localStorage). The backend also writes orders to a JSON file for demo purposes.
	For real production apps, use a database.

## Scripts
- `npm run dev` / `npm run dev:client` - start Vite dev server
- `npm run dev:server` - start Express server
- `npm run dev:full` - run both
- `npm run build` - production build
- `npm run preview` - preview build
