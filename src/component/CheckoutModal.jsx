import { useMemo, useState } from "react";

const METHODS = [
    { id: "cards", label: "Cards", type: "card" },
    { id: "netbanking", label: "Netbanking", type: "netbanking" },
    { id: "wallet", label: "Wallet", type: "wallet" },
    { id: "paylater", label: "Pay Later", type: "paylater" },
];

function CheckoutModal({ onClose, onPay, totalAmount }) {
    const [selectedMethodId, setSelectedMethodId] = useState(METHODS[0].id);
    const selectedMethod = useMemo(
        () => METHODS.find((m) => m.id === selectedMethodId) || METHODS[0],
        [selectedMethodId]
    );

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formattedTotal = useMemo(() => {
        const amt = Number(totalAmount);
        if (!Number.isFinite(amt)) return "₹0.00";
        return `₹${amt.toFixed(2)}`;
    }, [totalAmount]);

    async function handlePay() {
        if (error) setError("");
        setIsSubmitting(true);
        try {
            await onPay(selectedMethod);
        } catch (e) {
            setError(e?.message || "Payment failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b border-white/10">
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">Checkout</h3>
                            <p className="text-slate-400 text-sm mt-0.5">Choose a payment method</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Close checkout"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 space-y-4 overflow-y-auto">
                        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
                            <span className="text-slate-300 text-sm">Total</span>
                            <span className="text-white font-bold">{formattedTotal}</span>
                        </div>

                        {/* Method */}
                        <div className="space-y-2">
                            {METHODS.map((m) => (
                                <label
                                    key={m.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                                        selectedMethodId === m.id
                                            ? "bg-emerald-500/10 border-emerald-500/40"
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={m.id}
                                        checked={selectedMethodId === m.id}
                                        onChange={() => {
                                            setSelectedMethodId(m.id);
                                            if (error) setError("");
                                        }}
                                    />
                                    <span className="text-white font-medium">{m.label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left">
                            <p className="text-white font-medium">Secure checkout</p>
                            <p className="text-slate-400 text-sm mt-1">
                                You’ll complete payment in Razorpay’s secure window. We don’t collect or store your UPI/card details.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl p-3 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePay}
                                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:active:scale-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : "Pay Now"}
                            </button>
                        </div>

                        <p className="text-slate-500 text-xs">
                            Payments are processed by Razorpay.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;
