'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Only show logout on authenticated pages
  const showLogout = pathname?.startsWith('/tracker');
  
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Redirect to home page
      router.push('/');
      // Force a refresh to ensure the app state is reset
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            FinTrac
          </Link>
          
          {showLogout && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}