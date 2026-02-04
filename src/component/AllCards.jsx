import { useCart } from "../context/CartContext";

function AllCards({ data, onOpenCart }) {
    const { addToCart } = useCart();

    function handleAddToCart(item) {
        addToCart(item);
        onOpenCart();
    }
    return (
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full max-w-7xl px-4 md:px-6">
            {data.map((singleItem) => (
                <div
                    key={singleItem.id}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
                >
                    {/* Image Container */}
                    <div className="relative overflow-hidden aspect-square bg-slate-800">
                        <img
                            src={singleItem.thumbnail}
                            alt={singleItem.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                        {/* Discount Badge */}
                        {singleItem.discountPercentage > 10 && (
                            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {Math.round(singleItem.discountPercentage)}% OFF
                            </span>
                        )}
                        {/* Rating Badge */}
                        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            {singleItem.rating?.toFixed(1) || "N/A"}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {/* Category Tag */}
                        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                            {singleItem.category}
                        </span>

                        {/* Title */}
                        <h2 className="font-semibold text-white text-left mt-1 text-base md:text-lg line-clamp-1">
                            {singleItem.title}
                        </h2>

                        {/* Description */}
                        <p className="text-left text-slate-400 text-sm line-clamp-2 mt-2 leading-relaxed">
                            {singleItem.description}
                        </p>

                        {/* Price and Button */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex flex-col">
                                <span className="text-xl md:text-2xl font-bold text-white">
                                    ${singleItem.price}
                                </span>
                                {singleItem.discountPercentage > 10 && (
                                    <span className="text-xs text-slate-500 line-through">
                                        ${(singleItem.price / (1 - singleItem.discountPercentage / 100)).toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <button 
                                onClick={() => handleAddToCart(singleItem)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 active:scale-95"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AllCards;
