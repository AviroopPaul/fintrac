"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Create a separate component for the part that uses useSearchParams
function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div>
      {error === "OAuthAccountNotLinked" && (
        <div className="error-message">
          An account already exists with this email using a different sign-in
          method. Please sign in using your original authentication method.
        </div>
      )}
      {/* Rest of your login form */}
    </div>
  );
}

// Main component with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
