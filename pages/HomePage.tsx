import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center bg-gray-50 p-6 rounded-lg shadow-xl">
      {" "}
      {/* bg-gray-50 for main area */}
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-800">
        {" "}
        {/* text-slate-800 to text-gray-800 */}
        Quasar
      </h1>
      <p className="mt-4 text-xl md:text-2xl lg:text-3xl text-gray-700 font-light">
        {" "}
        {/* text-slate-600 to text-gray-700 */}
        Your all in one loan automation suite.
      </p>
      {/* <img src="https://picsum.photos/800/400?random=1" alt="Abstract financial technology" className="mt-12 rounded-lg shadow-2xl object-cover max-w-full md:max-w-2xl lg:max-w-3xl"/> */}
      <p className="mt-8 text-lg text-gray-600 max-w-2xl">
        {" "}
        {/* text-gray-700 to text-gray-600 for secondary text */}
        Streamline your document processing with our intelligent automation
        platform. Upload your loan documents and let Quasar, powered by advanced
        AI, categorize them accurately and efficiently.
      </p>
    </div>
  );
};

export default HomePage;
