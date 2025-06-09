import React from "react";
import { Link } from "react-router-dom";
import QuasarImg from "../quasar.png";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center group">
              <img
                src={QuasarImg}
                alt="Quasar Logo"
                className="h-10 w-10 text-gray-700 group-hover:text-indigo-600 transition-colors duration-200"
              />
              <span className="ml-3 text-2xl font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                Quasar
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/ocr"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Process Documents
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
