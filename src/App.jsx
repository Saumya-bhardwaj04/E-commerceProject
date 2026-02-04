import { useEffect, useState } from "react";
import AllCards from "./component/AllCards";
import Cart from "./component/Cart";
import { useCart } from "./context/CartContext";

function App() {
    const [val, setVal] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [initialData, setinitialData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const { cartCount } = useCart();

    async function getData() {
        setIsLoading(true);
        try {
            let res = await fetch("https://dummyjson.com/products");
            let data = await res.json();
            setFilterData(data.products);
            setinitialData(data.products);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const categories = ["all", ...new Set(initialData.map((item) => item.category))];

    function filterHandler() {
        let res = initialData.filter((item) => {
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
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-center min-h-screen w-full overflow-x-hidden flex flex-col items-center">
            {/* Header */}
            <header className="w-full py-4 px-4 md:py-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                        Sasta Sundar Tikau
                    </h1>
                    <p className="text-slate-400 mt-1 text-xs md:text-sm">
                        Wallet khush, dil khush!
                    </p>
                </div>
                
                {/* Cart Button */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 group"
                >
                    <svg
                        className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {cartCount > 9 ? "9+" : cartCount}
                        </span>
                    )}
                </button>
            </header>

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
                        onKeyPress={handleKeyPress}
                    />
                    
                    {val && (
                        <button
                            onClick={clearSearch}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
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
                    <AllCards data={filterData} />
                )}
            </main>

            {/* Cart Sidebar */}
            {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
        </div>
    );
}

export default App;
