"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export const Header = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-secondary shadow-md" : "bg-primary"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav className="flex h-16 items-center justify-between">
          <div className="hidden items-center space-x-8 md:flex">
            <Link href="/kiosk" className="text-gray-900 hover:opacity-80">
              Kioks
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-gray-900 md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed right-0 top-16 z-50 h-full w-full transform bg-white/95 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex flex-col space-y-4 p-4">
            <Link
              href="/products"
              className="text-gray-900 hover:opacity-80"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-gray-900 hover:opacity-80"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/how-to-buy"
              className="text-gray-900 hover:opacity-80"
              onClick={() => setIsMenuOpen(false)}
            >
              How to buy?
            </Link>
            <Link
              href="/serial"
              className="text-gray-900 hover:opacity-80"
              onClick={() => setIsMenuOpen(false)}
            >
              Device Manager
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
