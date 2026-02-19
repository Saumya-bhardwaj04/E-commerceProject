import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.json");

async function ensureStore() {
    await fs.mkdir(dataDir, { recursive: true });
    try {
        await fs.access(ordersFile);
    } catch {
        await fs.writeFile(ordersFile, JSON.stringify({ orders: [] }, null, 2), "utf8");
    }
}

async function readStore() {
    await ensureStore();
    const raw = await fs.readFile(ordersFile, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.orders)) {
        return { orders: [] };
    }
    return parsed;
}

async function writeStore(store) {
    await ensureStore();
    await fs.writeFile(ordersFile, JSON.stringify(store, null, 2), "utf8");
}

export async function createOrderRecord(order) {
    const store = await readStore();
    store.orders.unshift(order);
    await writeStore(store);
    return order;
}

export async function updateOrderRecord(orderId, patch) {
    const store = await readStore();
    const idx = store.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;
    store.orders[idx] = { ...store.orders[idx], ...patch, updatedAt: new Date().toISOString() };
    await writeStore(store);
    return store.orders[idx];
}

export async function getOrderRecord(orderId) {
    const store = await readStore();
    return store.orders.find((o) => o.id === orderId) || null;
}
