"use client";

import React from "react";
import { Topbar } from "@/components/index/Topbar";
import Image from "next/image";

const HomePage: React.FC = () => {
  return (
    <div>
      <Topbar />
      {/* 
        The main hero section container.
        - `min-h-[calc(100vh-12rem)]`: Ensures it takes up significant screen height.
        - `mx-2 sm:mx-12`: Provides responsive horizontal margins.
      */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center mt-10 bg-gray-50 p-6 rounded-lg shadow-xl mx-2 sm:mx-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
          DLSCC Loan Application Portal
        </h1>
        <p className="mt-4 text-xl md:text-2xl lg:text-3xl text-gray-700 font-light">
          Your trusted partner for cooperative loan management.
        </p>
        <p className="mt-8 text-lg text-gray-600 max-w-2xl">
          Process loan applications efficiently with our comprehensive portal.
          Generate application forms, scan and categorize documents, and extract
          data automatically with advanced OCR technology.
        </p>
        <div className="mt-12 flex items-center gap-2 text-sm text-gray-500">
          <span>Powered by</span>
          <Image
            src="/logo-text.png"
            alt="Quasar Logo"
            width={80}
            height={20}
            className="w-auto h-5"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
