import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiJson } from "../lib/api";

function OrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            setError("");

            try {
                const data = await apiJson(`/api/orders/${orderId}`);
                if (!cancelled) setOrder(data.order);
            } catch (e) {
                if (!cancelled) setError(e?.message || "Failed to load order");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        if (orderId) load();
        return () => {
            cancelled = true;
        };
    }, [orderId]);

    return (
        <main className="w-full max-w-4xl mx-auto px-4 pb-10">
            <div className="text-left mt-4 md:mt-6 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Track Order</h1>
                    <p className="text-slate-400 mt-1 text-sm">Order ID: {orderId}</p>
                </div>
                <Link
                    to="/orders"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                >
                    Order History
                </Link>
            </div>

            {isLoading ? (
                <div className="mt-6 text-slate-300">Loading…</div>
            ) : error ? (
                <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl p-4 text-left">
                    {error}
                </div>
            ) : !order ? null : (
                <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-white font-semibold">Status</p>
                        <p className="text-emerald-300 font-bold">{order.status}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-slate-400">Total</p>
                        <p className="text-white font-bold">₹{Number(order.total || 0).toFixed(2)}</p>
                    </div>

                    <div>
                        <p className="text-white font-semibold">Items</p>
                        <div className="mt-2 space-y-2">
                            {(order.items || []).map((it) => (
                                <div
                                    key={it.id}
                                    className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl p-3"
                                >
                                    <div className="min-w-0">
                                        <p className="text-white font-medium truncate">{it.title}</p>
                                        <p className="text-slate-400 text-sm">Qty: {it.quantity}</p>
                                    </div>
                                    <p className="text-white font-bold">₹{Number(it.price || 0).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-slate-500 text-xs">
                        Tracking is demo-level unless you connect real shipping updates.
                    </p>
                </div>
            )}
        </main>
    );
}

export default OrderDetails;
