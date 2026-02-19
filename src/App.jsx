import { useState } from "react";
import Cart from "./component/Cart";
import { useCart } from "./context/CartContext";
import { Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cartCount } = useCart();

    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-center min-h-screen w-full overflow-x-hidden flex flex-col items-center">
            {/* Header */}
            <header className="w-full py-4 px-4 md:py-6 flex flex-row flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
                <div className="text-left">
                    <Link
                        to="/"
                        className="inline-block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight"
                    >
                        Pocket Cart
                    </Link>
                    <p className="text-slate-400 mt-1 text-xs md:text-sm">
                        Wallet khush, dil khush!
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to="/orders"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-colors"
                    >
                        Orders
                    </Link>

                    {/* Cart Button */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 group"
                    >
                        <svg
                            className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {cartCount > 9 ? "9+" : cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <Routes>
                <Route
                    path="/"
                    element={<Home onOpenCart={() => setIsCartOpen(true)} />}
                />
                <Route
                    path="/product/:id"
                    element={<ProductDetails onOpenCart={() => setIsCartOpen(true)} />}
                />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />
            </Routes>

            {/* Cart Sidebar */}
            {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
        </div>
        
    );
}

export default App;
