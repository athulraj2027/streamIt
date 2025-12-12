"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed z-20 tracking-tighter top-0 sm:top-3 w-full  shadow-sm">
      <div className="px-5 max-w-5xl mx-auto flex justify-between items-center p-3">
        <Link href={`/`}>
          <h1 className="text-2xl font-extrabold text-[#FF6D1F] cursor-pointer hover:opacity-80 transition">
            streamIt.
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul className="flex justify-around items-center gap-7 font-semibold text-[#222222]">
            <li className="hover:text-[#FF6D1F] transition">
              <Link href={`/`}>Home</Link>
            </li>
            <li className="hover:text-[#FF6D1F] transition">
              <Link href={`/`}>Streams</Link>
            </li>
            <li className="hover:text-[#FF6D1F] transition">
              <Link href={`/`}>About</Link>
            </li>
          </ul>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3">
          <Link href="/sign-in">
            <Button className="rounded-sm bg-[#222222] text-white hover:bg-[#444444] transition">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="rounded-sm bg-[#FF6D1F] text-white hover:bg-[#e55f18] px-8 transition">
              Start for free
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1 w-6 h-6 justify-center items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`w-full h-0.5 bg-[#222222] transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`w-full h-0.5 bg-[#222222] transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-full h-0.5 bg-[#222222] transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-5 pb-5 bg-[#FAF3E1] border-t border-[#F5E7C6]">
          <ul className="flex flex-col gap-4 mb-4 text-[#222222]">
            <li className="hover:text-[#FF6D1F] transition">
              <Link href={`/`} onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="hover:text-[#FF6D1F] transition">
              <Link href={`/`} onClick={() => setIsMenuOpen(false)}>
                Streams
              </Link>
            </li>
            <li className="hover:text-[#FF6D1F] transition">
              <Link href={`/`} onClick={() => setIsMenuOpen(false)}>
                Pricing
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
              <Button className="rounded-sm bg-[#222222] text-white w-full hover:bg-[#444444]">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
              <Button className="rounded-sm bg-[#FF6D1F] text-white w-full px-8 hover:bg-[#e55f18]">
                Start for free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
