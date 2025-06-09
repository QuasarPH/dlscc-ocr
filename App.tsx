import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import OcrPage from "./pages/OcrPage";

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {" "}
        {/* Changed to bg-gray-50 (close to #f8f9fa) */}
        <Navbar />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/ocr" element={<OcrPage />} />
          </Routes>
        </main>
        <footer className="text-center p-4 text-gray-700 text-sm bg-gray-100 border-t border-gray-200">
          {" "}
          {/* Updated footer style */}© {new Date().getFullYear()} Quasar. All
          rights reserved.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
