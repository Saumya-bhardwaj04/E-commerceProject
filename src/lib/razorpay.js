let loadingPromise;

export function loadRazorpayCheckout() {
    if (typeof window === "undefined") return Promise.reject(new Error("Not in browser"));
    if (window.Razorpay) return Promise.resolve(true);

    if (!loadingPromise) {
        loadingPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error("Failed to load Razorpay"));
            document.body.appendChild(script);
        });
    }

    return loadingPromise;
}
