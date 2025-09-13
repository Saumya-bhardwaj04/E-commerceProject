function AllCards({ data }) {
    return (
        <div className="mt-10 flex flex-wrap justify-around w-[80%] gap-10 mb-10">
            {data.map((singleItem) => (
                <div
                    key={singleItem.id}
                    className="bg-teal-500 w-[25%] max-h-[500px] p-4 rounded-xl shadow-lg overflow-hidden"
                >
                    <img
                        src={singleItem.thumbnail}
                        className="aspect-square w-[100%] object-cover h-[70%] rounded-xl shadow-xl bg-teal-200 transition-transform duration-300 ease-in-out hover:scale-110"
                    />
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-left my-5 text-xl line-clamp-1">
                            {" "}
                            {singleItem.title}
                        </h2>
                        <p className="text-4xl ">${singleItem.price}</p>
                    </div>

                    <p className="text-left line-clamp-1 lg:line-clamp-2 opacity-80">{singleItem.description}</p>
                </div>
            ))}
        </div>
    );
}

export default AllCards;