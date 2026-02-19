import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function ProductDetails({ onOpenCart }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const productId = useMemo(() => Number(id), [id]);

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchProduct() {
            setIsLoading(true);
            setError("");
            try {
                if (!Number.isFinite(productId)) {
                    throw new Error("Invalid product id");
                }

                const res = await fetch(`https://dummyjson.com/products/${productId}`);
                if (!res.ok) {
                    throw new Error("Product not found");
                }
                const data = await res.json();
                if (isMounted) {
                    setProduct(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Something went wrong");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchProduct();

        return () => {
            isMounted = false;
        };
    }, [productId]);

    function handleAddToCart() {
        if (!product) return;
        addToCart(product);
        toast.success("Added to cart");
        if (onOpenCart) onOpenCart();
    }

    if (isLoading) {
        return (
            <main className="w-full flex-1 flex flex-col items-center pb-10">
                <div className="flex flex-col items-center justify-center mt-20">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 mt-4">Loading product...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="w-full flex-1 flex flex-col items-center pb-10 px-4">
                <div className="max-w-3xl w-full mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                    <h2 className="text-2xl font-bold text-white">{error}</h2>
                    <p className="text-slate-400 mt-2">Please go back and try another product.</p>
                    <div className="flex items-center gap-3 mt-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                        >
                            Go Back
                        </button>
                        <Link
                            to="/"
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
                        >
                            Home
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const primaryImage = product?.images?.[0] || product?.thumbnail;

    return (
        <main className="w-full flex-1 flex flex-col items-center pb-10 px-4">
            <div className="w-full max-w-4xl mt-4">
                <div className="flex items-center justify-start">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>

                {/* Single Medium Card (image + details in one box) */}
                <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-0">
                        {/* Image (smaller) */}
                        <div className="bg-slate-800/70 p-4 flex items-center justify-center">
                            <div className="w-full h-64 md:h-72 rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center">
                                {primaryImage ? (
                                    <img
                                        src={primaryImage}
                                        alt={product.title}
                                        className="max-w-full max-h-full object-contain"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="text-slate-500">No image</div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 md:p-6 text-left">
                            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                                {product.category}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
                                {product.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                {product.brand && (
                                    <span className="text-slate-300 text-sm bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                        Brand: {product.brand}
                                    </span>
                                )}
                                <span className="text-slate-300 text-sm bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1">
                                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                    {product.rating?.toFixed(1) || "N/A"}
                                </span>
                                {Number.isFinite(product.stock) && (
                                    <span className="text-slate-300 text-sm bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                        Stock: {product.stock}
                                    </span>
                                )}
                            </div>

                            <p className="text-slate-400 mt-4 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="flex items-end justify-between gap-4 mt-6">
                                <div>
                                    <div className="text-3xl font-bold text-white">${product.price}</div>
                                    {product.discountPercentage > 0 && (
                                        <div className="text-sm text-slate-400 mt-1">
                                            {Math.round(product.discountPercentage)}% off
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-all duration-200 active:scale-95"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProductDetails;
