"use client";

import { useState } from "react";
import Link from "next/link";

export function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">DLSCC</span>
              <span className="text-sm text-gray-600">Loan Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/forms"
              className="font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Form Builder
            </Link>
            <Link
              href="/upload"
              className="font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Form Scanner
            </Link>
            <Link
              href="/dashboard"
              className="font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <button className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 transition-all duration-200 hover:scale-105">
              Log In
            </button>
          </div>

          {/* Mobile Menu Button with Custom Icon */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Custom animated hamburger/close icon */}
              <div className="h-6 w-6" aria-hidden="true">
                <div className="relative flex h-full w-full items-center justify-center">
                  <span
                    className={`absolute block h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
                      isMenuOpen ? "rotate-45" : "-translate-y-1.5"
                    }`}
                  ></span>
                  <span
                    className={`absolute block h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
                      isMenuOpen ? "opacity-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`absolute block h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
                      isMenuOpen ? "-rotate-45" : "translate-y-1.5"
                    }`}
                  ></span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {/* The `transition-transform` and `transform` classes create a smooth slide-down effect */}
      <div
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3 bg-white border-t border-gray-200">
          <Link
            href="/forms"
            onClick={() => setIsMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          >
            Form Builder
          </Link>
          <Link
            href="/upload"
            onClick={() => setIsMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          >
            Form Scanner
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          >
            Dashboard
          </Link>
          <div className="pt-2">
            <button className="w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
              Log In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
