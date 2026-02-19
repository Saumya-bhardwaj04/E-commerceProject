export async function apiJson(path, options = {}) {
    const base = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
    const url = path.startsWith("http") ? path : `${base}${path}`;

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data?.error || `Request failed (${res.status})`;
        throw new Error(msg);
    }
    return data;
}
