import { useCart } from "../context/CartContext";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { apiJson } from "../lib/api";
import { loadRazorpayCheckout } from "../lib/razorpay";
import { addLocalOrderId } from "../lib/orders";
import { formatInr } from "../lib/pricing";

function Cart({ onClose }) {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const navigate = useNavigate();

    function handleCheckout() {
        setIsCheckoutOpen(true);
    }

    async function handlePay(selectedMethod) {
        if (!cartItems.length) throw new Error("Cart is empty");
        if (!Number.isFinite(cartTotal) || cartTotal <= 0) throw new Error("Invalid total");

        const items = cartItems.map((it) => ({
            id: it.id,
            title: it.title,
            price: it.price,
            marketPrice: it.marketPrice,
            discountPercentage: it.discountPercentage,
            quantity: it.quantity,
            thumbnail: it.thumbnail,
        }));

        const orderCreate = await apiJson("/api/orders", {
            method: "POST",
            body: JSON.stringify({
                items,
                total: cartTotal,
                currency: "INR",
                preferredMethod: selectedMethod?.type,
            }),
        });

        await loadRazorpayCheckout();

        // Close our modal so Razorpay becomes the only overlay.
        setIsCheckoutOpen(false);

        const options = {
            key: orderCreate.keyId,
            amount: orderCreate.amountPaise,
            currency: orderCreate.currency,
            name: "Pocket Cart",
            description: "Order payment",
            order_id: orderCreate.razorpayOrderId,
            method: {
                card: selectedMethod?.id === "cards",
                netbanking: selectedMethod?.id === "netbanking",
                wallet: selectedMethod?.id === "wallet",
                paylater: selectedMethod?.id === "paylater",
            },
            handler: async (response) => {
                try {
                    await apiJson("/api/payments/verify", {
                        method: "POST",
                        body: JSON.stringify({
                            orderId: orderCreate.orderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    toast.success("Payment successful");
                    addLocalOrderId(orderCreate.orderId);
                    clearCart();
                    onClose();
                    navigate(`/orders/${orderCreate.orderId}`);
                } catch (e) {
                    toast.error(e?.message || "Payment verification failed");
                }
            },
            modal: {
                ondismiss: () => {
                    toast("Payment cancelled");
                },
            },
        };

        // Razorpay Checkout handles real UPI & card flows.
        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Cart Panel */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">
                            Your Cart
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            {cartCount} {cartCount === 1 ? "item" : "items"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <svg
                                className="w-20 h-20 text-slate-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <h3 className="text-xl text-slate-400 mt-4 font-medium">
                                Cart is empty
                            </h3>
                            <p className="text-slate-500 mt-2">
                                Add some awesome deals!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-3"
                                >
                                    {/* Image */}
                                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium text-sm line-clamp-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-emerald-400 font-bold mt-1">
                                            {formatInr(item.price)}
                                        </p>
                                        {Number(item.discountPercentage) > 0 && Number.isFinite(item.marketPrice) && (
                                            <p className="text-slate-500 text-xs line-through">
                                                {formatInr(item.marketPrice)}
                                            </p>
                                        )}

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity - 1)
                                                }
                                                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="text-white text-sm w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-1.5 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors self-start"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-white/10 p-4 md:p-6 space-y-4">
                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Total</span>
                            <span className="text-2xl font-bold text-white">
                                {formatInr(cartTotal)}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            <button onClick={handleCheckout} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-all duration-200 active:scale-95">
                                Checkout
                            </button>
                            <button
                                onClick={clearCart}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-all duration-200"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isCheckoutOpen && (
                <CheckoutModal
                    onClose={() => setIsCheckoutOpen(false)}
                    onPay={handlePay}
                    totalAmount={cartTotal}
                />
            )}
        </div>
    );
}

export default Cart;
