"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (pathname === "/") {
    return null;
  }

  const showNav =
    pathname?.startsWith("/tracker") ||
    pathname?.startsWith("/budget") ||
    pathname?.startsWith("/subscriptions") ||
    pathname?.startsWith("/ai-advisor");

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-full flex justify-center pt-4 sticky top-0 z-50">
      <header
        className="backdrop-blur-xl border border-white/10 
        rounded-full w-[100%] mx-4 md:mx-8 lg:mx-64 shadow-lg shadow-black/5"
      >
        <div className="container mx-auto px-3 md:px-6">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => router.push('/tracker')}
              className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
            >
              FinTrac
            </button>

            {/* Desktop Navigation */}
            {showNav && (
              <div className="hidden md:flex items-center gap-6">
                <nav className="flex gap-4">
                  <Link
                    href="/tracker"
                    className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                      pathname === "/tracker"
                        ? "bg-blue-500/10 text-blue-400"
                        : "hover:bg-blue-500/10 text-gray-400 hover:text-blue-400"
                    }`}
                  >
                    Transactions
                  </Link>
                  <Link
                    href="/budget"
                    className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                      pathname === "/budget"
                        ? "bg-blue-500/10 text-blue-400"
                        : "hover:bg-blue-500/10 text-gray-400 hover:text-blue-400"
                    }`}
                  >
                    Budget
                  </Link>
                  <Link
                    href="/subscriptions"
                    className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                      pathname === "/subscriptions"
                        ? "bg-blue-500/10 text-blue-400"
                        : "hover:bg-blue-500/10 text-gray-400 hover:text-blue-400"
                    }`}
                  >
                    Subscriptions
                  </Link>
                  <Link
                    href="/ai-advisor"
                    className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                      pathname === "/ai-advisor"
                        ? "bg-blue-500/10 text-blue-400"
                        : "hover:bg-blue-500/10 text-gray-400 hover:text-blue-400"
                    }`}
                  >
                    AI Advisor ✨
                  </Link>
                </nav>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/50 
                  hover:bg-red-500/10 rounded-full transition-all duration-300 
                  backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.1)] 
                  hover:shadow-[0_0_25px_rgba(239,68,68,0.2)] 
                  hover:border-red-500/80"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            {showNav && (
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-400 hover:text-blue-400"
                >
                  <svg
                    className="w-6 h-6"
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

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-4 w-48 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl">
                    <Link
                      href="/tracker"
                      className={`block px-4 py-2 text-sm ${
                        pathname === "/tracker"
                          ? "text-blue-400"
                          : "text-gray-400 hover:text-blue-400"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Transactions
                    </Link>
                    <Link
                      href="/budget"
                      className={`block px-4 py-2 text-sm ${
                        pathname === "/budget"
                          ? "text-blue-400"
                          : "text-gray-400 hover:text-blue-400"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Budget
                    </Link>
                    <Link
                      href="/subscriptions"
                      className={`block px-4 py-2 text-sm ${
                        pathname === "/subscriptions"
                          ? "text-blue-400"
                          : "text-gray-400 hover:text-blue-400"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Subscriptions
                    </Link>
                    <Link
                      href="/ai-advisor"
                      className={`block px-4 py-2 text-sm ${
                        pathname === "/ai-advisor"
                          ? "text-blue-400"
                          : "text-gray-400 hover:text-blue-400"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      AI Advisor ✨
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
