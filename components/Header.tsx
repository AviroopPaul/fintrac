'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Hide header on home page
  if (pathname === '/') {
    return null;
  }
  
  // Only show logout on authenticated pages
  const showLogout = pathname?.startsWith('/tracker');
  
  const handleLogout = async () => {
    try {
      // Simplified logout - let NextAuth handle everything
      await signOut({ 
        redirect: true,
        callbackUrl: '/' 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-full flex justify-center pt-4 sticky top-0 z-50">
      <header className="backdrop-blur-xl border border-white/10 
        rounded-full w-[100%] mx-4 md:mx-8 lg:mx-64 shadow-lg shadow-black/5">
        <div className="container mx-auto px-3 md:px-6">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => window.location.reload()}
              className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
            >
              FinTrac
            </button>
            
            {showLogout && (
              <button
                onClick={handleLogout}
                className="px-3 md:px-4 py-1.5 md:py-2 text-sm font-medium text-red-400 border border-red-500/50 
                hover:bg-red-500/10 rounded-full transition-all duration-300 
                backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.1)] 
                hover:shadow-[0_0_25px_rgba(239,68,68,0.2)] 
                hover:border-red-500/80"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}