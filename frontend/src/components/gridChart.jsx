const GridChart = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {[...Array(12)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full mb-4 flex items-center justify-center text-white text-xl font-bold"> {index + 1} </div>
                    <h3 className="text-lg font-semibold mb-2">Chart {index + 1}</h3>
                    <p className="text-gray-600 text-center">This is a description for chart {index + 1}.</p>
                </div>
            ))}
        </div>
    );
}

export default GridChart;