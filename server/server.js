import crypto from "crypto";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import Razorpay from "razorpay";

import { createOrderRecord, getOrderRecord, updateOrderRecord } from "./store.js";

dotenv.config();

const PORT = Number(process.env.PORT || 5174);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = CLIENT_ORIGIN.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
    // Don’t crash hard — but make the error obvious.
    console.warn(
        "[server] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET. Payments will not work until you add them to server/.env"
    );
}

const razorpay = keyId && keySecret ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null;

const app = express();
app.use(express.json());
app.use(
    cors({
        origin(origin, callback) {
            // allow non-browser tools (no Origin header)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error("Not allowed by CORS"));
        },
    })
);

app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

// Create an internal order + a Razorpay order
app.post("/api/orders", async (req, res) => {
    try {
        const { items, total, currency } = req.body || {};
        const totalNumber = Number(total);
        const currencyCode = String(currency || "INR").toUpperCase();

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }
        if (!Number.isFinite(totalNumber) || totalNumber <= 0) {
            return res.status(400).json({ error: "Invalid total" });
        }
        if (!razorpay) {
            return res.status(500).json({ error: "Server missing Razorpay credentials" });
        }

        // IMPORTANT: In production, never trust client totals.
        // Recalculate amount on server from your own product DB/prices.
        const amountPaise = Math.round(totalNumber * 100);

        const orderId = crypto.randomUUID();
        const now = new Date().toISOString();

        const razorpayOrder = await razorpay.orders.create({
            amount: amountPaise,
            currency: currencyCode,
            receipt: orderId,
        });

        const orderRecord = {
            id: orderId,
            status: "created",
            currency: currencyCode,
            total: totalNumber,
            amountPaise,
            items,
            razorpayOrderId: razorpayOrder.id,
            createdAt: now,
            updatedAt: now,
        };

        await createOrderRecord(orderRecord);

        res.json({
            orderId,
            razorpayOrderId: razorpayOrder.id,
            amountPaise,
            currency: currencyCode,
            keyId,
        });
    } catch (err) {
        console.error("[server] /api/orders error", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

// Verify payment signature and mark order as paid
app.post("/api/payments/verify", async (req, res) => {
    try {
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

        if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: "Missing payment fields" });
        }
        if (!keySecret) {
            return res.status(500).json({ error: "Server missing Razorpay secret" });
        }

        const existing = await getOrderRecord(orderId);
        if (!existing) return res.status(404).json({ error: "Order not found" });
        if (existing.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({ error: "Order mismatch" });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");

        if (expected !== razorpay_signature) {
            await updateOrderRecord(orderId, {
                status: "failed",
                failureReason: "Signature verification failed",
            });
            return res.status(400).json({ error: "Invalid signature" });
        }

        const updated = await updateOrderRecord(orderId, {
            status: "paid",
            paidAt: new Date().toISOString(),
            razorpayPaymentId: razorpay_payment_id,
        });

        res.json({ ok: true, order: updated });
    } catch (err) {
        console.error("[server] /api/payments/verify error", err);
        res.status(500).json({ error: "Payment verification failed" });
    }
});

app.get("/api/orders/:id", async (req, res) => {
    try {
        const order = await getOrderRecord(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json({ order });
    } catch (err) {
        console.error("[server] /api/orders/:id error", err);
        res.status(500).json({ error: "Failed to fetch order" });
    }
});

app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
});
