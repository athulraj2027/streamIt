"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full px-4 pt-3">
      <div className="fixed top-3 left-0 right-0 z-20">
        <div className="max-w-5xl mx-3 md:mx-auto bg-black/80 rounded-md shadow-sm backdrop-blur-lg">
          <div className="px-6 py-3 flex justify-between items-center tracking-tight">
            {/* Logo */}
            <Link href={`/`}>
              <h1 className="text-xl font-extrabold text-[#FF6D1F] cursor-pointer hover:opacity-80 transition tracking-tighter">
                streamIt
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <ul className="flex items-center gap-6 font-medium text-white text-sm tracking-tight">
                <li className="hover:text-[#FF6D1F] transition">
                  <Link href={`/`}>Home</Link>
                </li>
                <li className="hover:text-[#FF6D1F] transition">
                  <Link href={`/`}>About</Link>
                </li>
              </ul>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-3">
              <Link href="/sign-in">
                <Button className="rounded-sm bg-[#222222] text-white hover:bg-[#444444] transition text-sm px-4 py-1.5">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="rounded-sm bg-[#FF6D1F] text-white hover:bg-[#e55f18] transition text-sm px-5 py-1.5">
                  Sign up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex flex-col gap-1 w-6 h-6 justify-center items-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`w-full h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden mx-3 transition-all duration-300 ${
              isMenuOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="px-6 pb-6 pt-4 bg-black/15 border-t border-[#222222] rounded-md mb-3">
              <ul className="flex flex-col gap-4 mb-5 text-white text-sm tracking-tight">
                <li className="hover:text-[#FF6D1F] transition">
                  <Link href={`/`} onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                </li>
                <li className="hover:text-[#FF6D1F] transition">
                  <Link href={`/`} onClick={() => setIsMenuOpen(false)}>
                    About
                  </Link>
                </li>
              </ul>

              {/* Mobile Buttons */}
              <div className="flex flex-col gap-3">
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button className="rounded-sm bg-[#222222] text-white w-full hover:bg-[#444444] text-sm py-2">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button className="rounded-sm bg-[#FF6D1F] text-white w-full hover:bg-[#e55f18] text-sm py-2">
                    Start for free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
