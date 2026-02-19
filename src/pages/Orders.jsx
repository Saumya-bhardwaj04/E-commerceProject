import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiJson } from "../lib/api";
import { getLocalOrderIds } from "../lib/orders";

function Orders() {
    const orderIds = useMemo(() => getLocalOrderIds(), []);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(orderIds.length > 0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (orderIds.length === 0) {
                setOrders([]);
                setIsLoading(false);
                return;
            }

            try {
                const results = await Promise.all(
                    orderIds.map(async (id) => {
                        try {
                            const data = await apiJson(`/api/orders/${id}`);
                            return data.order;
                        } catch {
                            return { id, status: "unknown" };
                        }
                    })
                );

                if (!cancelled) setOrders(results);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [orderIds]);

    return (
        <main className="w-full max-w-4xl mx-auto px-4 pb-10">
            <div className="text-left mt-4 md:mt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Order History</h1>
                <p className="text-slate-400 mt-1 text-sm">Orders saved on this device</p>
            </div>

            {isLoading ? (
                <div className="mt-6 text-slate-300">Loading orders…</div>
            ) : orderIds.length === 0 ? (
                <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                    <p className="text-white font-medium">No orders yet</p>
                    <p className="text-slate-400 text-sm mt-1">Complete a payment to see it here.</p>
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {orders.map((o) => (
                        <Link
                            key={o.id}
                            to={`/orders/${o.id}`}
                            className="block bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-2xl p-4 text-left"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-white font-semibold truncate">Order #{o.id.slice(0, 8)}</p>
                                    <p className="text-slate-400 text-sm mt-0.5">Status: {o.status}</p>
                                </div>
                                {typeof o.total === "number" && (
                                    <p className="text-white font-bold">₹{o.total.toFixed(2)}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Orders;
