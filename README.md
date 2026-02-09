# Pocket Cart (Dynamic Data)

A React + Vite shopping UI that loads products from an API, lets you search and filter by category, and manages a cart with quantity controls.

## Features
- Fetches products from a live API
- Search by product title and filter by category
- Add to cart, update quantity, remove items, clear cart
- Toasts for checkout feedback

## Setup
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`

## API
The app reads the products API from `https://dummyjson.com/products` in [src/App.jsx].

## Scripts
- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run preview` - preview production build

## Tech Stack
- React 19, Vite
- Tailwind CSS
- react-hot-toast
