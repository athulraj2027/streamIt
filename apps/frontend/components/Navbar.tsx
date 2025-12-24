"use client";

import Link from "next/link";
import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    router.replace("/sign-in");
  };

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  return (
    <div className="w-[80%] px-4 pt-3">
      <div className="fixed top-3 left-0 right-0 z-20">
        <div className="max-w-5xl mx-3 md:mx-auto bg-black/80 rounded-md shadow-sm backdrop-blur-lg">
          <div className="px-6 py-3 flex justify-between items-center tracking-tight">
            <Link href={isAuthenticated ? "/streams" : "/"}>
              <h1 className="text-xl font-extrabold text-[#FF6D1F] cursor-pointer hover:opacity-80 transition tracking-tighter">
                streamIt
              </h1>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <ul className="flex items-center gap-6 font-medium text-white text-sm tracking-tight">
                <li className="hover:text-[#FF6D1F] transition">
                  <Link href="/">Home</Link>
                </li>
                <li className="hover:text-[#FF6D1F] transition">
                  <Link href="/">Workflow</Link>
                </li>
                <li className="hover:text-[#FF6D1F] transition">
                  <Link href="/">About</Link>
                </li>
              </ul>
            </div>

            {/* Auth Buttons / Profile */}
            <div className="hidden md:flex gap-3 items-center">
              {!isAuthenticated ? (
                <>
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
                </>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-9 h-9 rounded-full bg-[#FF6D1F] flex items-center justify-center text-white font-semibold hover:bg-[#e55f18] transition"
                  >
                    {user.name?.[0].toUpperCase() || "U"}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-48 bg-[#1a1a1a]/90 rounded-md shadow-lg py-1 border border-[#333333]">
                      <Link
                        href="/streams"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-white hover:text-md transition"
                      >
                        My Streams
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-extrabold transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              className="md:hidden flex flex-col gap-1 w-6 h-6 justify-center items-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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

          <div
            className={`md:hidden overflow-hidden mx-3 transition-all duration-300 ${
              isMenuOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="px-6 pb-6 pt-4 bg-black/15 border-t border-[#222222] rounded-md mb-3">
              {!isAuthenticated ? (
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
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/streams"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-[#FF6D1F] text-white transition"
                  >
                    My Streams
                  </Link>
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="rounded-sm bg-red-600 text-white w-full hover:bg-red-700 text-sm py-2"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
