"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check for authentication token
  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("streamIt_token="));
      setIsAuthenticated(!!token);
    };

    checkAuth();
    // Re-check auth when the component mounts or window gets focus
    window.addEventListener("focus", checkAuth);
    return () => window.removeEventListener("focus", checkAuth);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      // Clear the cookie
      document.cookie =
        "streamIt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Update state
      setIsAuthenticated(false);
      setIsProfileOpen(false);

      // Redirect to sign-in page
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-full px-4 pt-3">
      <div className="fixed top-3 left-0 right-0 z-20">
        <div className="max-w-5xl mx-3 md:mx-auto bg-black/80 rounded-md shadow-sm backdrop-blur-lg">
          <div className="px-6 py-3 flex justify-between items-center tracking-tight">
            {/* Logo */}
            <Link href={isAuthenticated ? "/streams" : "/"}>
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

            {/* Desktop Auth Buttons or Profile */}
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
                    aria-label="Profile menu"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-[-24] mt-4 w-48 bg-[#1a1a1a]/90 rounded-md shadow-lg py-1 border border-[#333333]">
                      <Link
                        href="/streams"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-white  hover:text-md transition"
                      >
                        My Streams
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-extrabold  transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
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
              {/* Mobile Auth Section */}
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3">
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
                    href={`/`}
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
