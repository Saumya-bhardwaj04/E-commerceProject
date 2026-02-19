const DEFAULT_USD_TO_INR = 83;

export function getUsdToInrRate() {
    const raw = import.meta.env.VITE_USD_TO_INR_RATE;
    const rate = Number(raw);
    return Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_USD_TO_INR;
}

export function toMoney(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100) / 100;
}

export function formatInr(value) {
    return `₹${toMoney(value).toFixed(2)}`;
}

export function getPricingFromProduct(product) {
    const rate = getUsdToInrRate();
    const usd = Number(product?.price);
    const marketPrice = toMoney((Number.isFinite(usd) ? usd : 0) * rate);

    const discount = Number(product?.discountPercentage);
    const discountPct = Number.isFinite(discount) && discount > 0 ? discount : 0;

    const offerPrice = toMoney(marketPrice * (1 - discountPct / 100));

    return { marketPrice, offerPrice, discountPct };
}
