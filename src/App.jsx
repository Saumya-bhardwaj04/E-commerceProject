import { useEffect, useState } from "react";
import AllCards from "./component/AllCards";

function App() {
    const [val, setVal] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [initialData, setinitialData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    function filterHandler() {
        let res = initialData.filter((item) =>
            item.title.toLowerCase().includes(val.toLowerCase())
        );
        setFilterData(res);
    }

    function handleKeyPress(e) {
        if (e.key === "Enter") {
            filterHandler();
        }
    }

    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-center min-h-screen w-full overflow-x-hidden flex flex-col items-center">
            {/* Header */}
            <header className="w-full py-6 px-4 md:py-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    Raste Ka Maal Saste Mai
                </h1>
                <p className="text-slate-400 mt-2 text-sm md:text-base">
                    Find the best deals on quality products
                </p>
            </header>

            {/* Search Bar */}
            <div className="w-full px-4 md:px-0 md:w-auto mt-4 md:mt-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 max-w-xl mx-auto">
                    <input
                        className="flex-1 p-3 px-5 rounded-full sm:rounded-l-full sm:rounded-r-none bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        type="text"
                        placeholder="Search products..."
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className="p-3 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full sm:rounded-l-none sm:rounded-r-full transition-all duration-200 active:scale-95"
                        onClick={filterHandler}
                    >
                        Search
                    </button>
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
        </div>
    );
}

export default App;
