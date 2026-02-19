import { useEffect, useState } from "react";
import AllCards from "../component/AllCards";

function sortProductsByCategory(products) {
    const categoryWeight = (category) => {
        const c = String(category || "").toLowerCase();
        if (c === "groceries") return -100;
        if (c === "beauty") return 100;
        return 0;
    };

    return [...products].sort((a, b) => {
        const wA = categoryWeight(a.category);
        const wB = categoryWeight(b.category);
        if (wA !== wB) return wA - wB;
        return a.id - b.id;
    });
}

function Home({ onOpenCart }) {
    const [val, setVal] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        let isMounted = true;

        async function fetchProducts() {
            setIsLoading(true);
            try {
                const res = await fetch("https://dummyjson.com/products");
                const data = await res.json();
                const sorted = sortProductsByCategory(data.products || []);
                if (isMounted) {
                    setFilterData(sorted);
                    setInitialData(sorted);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const categories = ["all", ...new Set(initialData.map((item) => item.category))];

    function filterHandler() {
        const res = initialData.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(val.toLowerCase());
            const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        setFilterData(res);
    }

    useEffect(() => {
        if (initialData.length > 0) {
            filterHandler();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    function handleKeyPress(e) {
        if (e.key === "Enter") {
            filterHandler();
        }
    }

    function clearSearch() {
        setVal("");
        setSelectedCategory("all");
        setFilterData(initialData);
    }

    return (
        <>
            {/* Search Section */}
            <div className="w-full px-4 mt-2 md:mt-4 max-w-4xl mx-auto">
                {/* Search Bar */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2">
                    {/* Search Icon */}
                    <div className="pl-3">
                        <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <input
                        className="flex-1 p-2 bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm md:text-base"
                        type="text"
                        placeholder="Search for products, brands, and more..."
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />

                    {val && (
                        <button
                            onClick={clearSearch}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                            aria-label="Clear search"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    <button
                        className="px-4 md:px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all duration-200 active:scale-95 text-sm md:text-base"
                        onClick={filterHandler}
                    >
                        Search
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {categories.slice(0, 8).map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 capitalize ${
                                selectedCategory === category
                                    ? "bg-emerald-500 text-white"
                                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="w-full flex-1 flex flex-col items-center pb-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center mt-20">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 mt-4">Loading products...</p>
                    </div>
                ) : filterData.length <= 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20">
                        <svg
                            className="w-20 h-20 text-slate-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h2 className="text-2xl md:text-4xl text-slate-400 mt-4 font-medium">
                            No items found
                        </h2>
                        <p className="text-slate-500 mt-2">Try a different search term</p>
                    </div>
                ) : (
                    <AllCards data={filterData} onOpenCart={onOpenCart} />
                )}
            </main>
        </>
    );
}

export default Home;
