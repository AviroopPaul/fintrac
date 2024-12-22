'use client'

import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  return (
    <div>
      {error === 'OAuthAccountNotLinked' && (
        <div className="error-message">
          An account already exists with this email using a different sign-in method. 
          Please sign in using your original authentication method.
        </div>
      )}
      {/* Rest of your login form */}
    </div>
  );
} 