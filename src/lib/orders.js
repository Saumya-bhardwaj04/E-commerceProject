const KEY = "pc_orders";

export function getLocalOrderIds() {
    try {
        const raw = localStorage.getItem(KEY);
        const parsed = JSON.parse(raw || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function addLocalOrderId(orderId) {
    const ids = getLocalOrderIds();
    const next = [orderId, ...ids.filter((id) => id !== orderId)].slice(0, 50);
    localStorage.setItem(KEY, JSON.stringify(next));
}
