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
        {/*
          RESPONSIVE IMAGE:
          - The `width` and `height` props are important for Next.js to prevent layout shift by reserving space.
          - The `className` with responsive prefixes controls the actual visual size.
          - `w-auto` is crucial to maintain the image's aspect ratio.
        */}
        <Image
          src="/logo-text.png"
          alt="Quasar Logo"
          width={240} // Base aspect ratio width
          height={60} // Base aspect ratio height
          className="w-auto h-10 sm:h-12 md:h-14 lg:h-16" // Responsive height
        />
        <p className="mt-4 text-xl md:text-2xl lg:text-3xl text-gray-700 font-light">
          Your all in one loan automation suite.
        </p>
        <p className="mt-8 text-lg text-gray-600 max-w-2xl">
          Streamline your entire loan workflow with our intelligent automation
          platform. Generate applications as PDFs, then let Quasar&apos;s
          advanced AI extract data with OCR and categorize every document with
          precision.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
