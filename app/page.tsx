"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { signIn } from "next-auth/react";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      console.log("Submitting to:", endpoint, { email, password });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password,
          provider: "credentials"
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      router.push("/tracker");
      router.refresh();

    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/tracker",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center relative overflow-hidden py-8">
      {/* Animated Background Elements - Updated for more prominence */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-cyan-400/30 text-6xl font-bold animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              filter: "blur(1px)",
              textShadow: "0 0 20px rgba(34, 211, 238, 0.3)",
            }}
          >
            {["$", "€", "£", "¥"][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-[90rem] w-full mx-4 flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Info Section - Left Column - Updated padding for mobile */}
        <div className="w-full md:w-[52%] p-6 md:p-12 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/20">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 leading-tight">
              FinTrac
            </h1>
            <p className="text-2xl md:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200 leading-relaxed">
              Finance Tracking for Modern Life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12">
            {[
              {
                icon: "📊",
                title: "Real-time Analytics",
                desc: "Visual insights into your spending patterns with dynamic charts",
              },
              {
                icon: "🔐",
                title: "AI Powered Analysis",
                desc: "Smart predictions and personalized financial insights",
              },
              {
                icon: "📱",
                title: "Cross-platform",
                desc: "Seamlessly sync across all your devices",
              },
              {
                icon: "🎯",
                title: "Budget Goals",
                desc: "Set, track, and achieve your financial objectives",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-start space-x-4 bg-white/5 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Form Section - Right Column - Updated for better height and mobile */}
        <div className="w-full md:w-[40%] flex items-center">
          <div className="backdrop-blur-xl bg-white/10 p-6 md:p-12 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] w-full">
            <div className="space-y-6 md:space-y-8">
              <div className="flex space-x-4 p-1.5 bg-gray-800/50 rounded-xl">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
                    isLogin
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
                    !isLogin
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form
                onSubmit={handleAuthSubmit}
                className="space-y-4 md:space-y-6"
              >
                <div className="group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none backdrop-blur-sm transition-all text-lg"
                  />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none backdrop-blur-sm transition-all text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl 
                    hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25
                    disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none
                    flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>{isLogin ? "Logging in..." : "Signing up..."}</span>
                    </>
                  ) : (
                    <span>{isLogin ? "Login" : "Sign Up"}</span>
                  )}
                </button>
              </form>

              <button
                onClick={handleGoogleSignIn}
                className="w-full px-8 py-4 text-lg font-semibold text-white/70 bg-white/5 rounded-xl border border-white/10 
                flex items-center justify-center gap-3 relative group hover:bg-white/10 transition-all duration-200"
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </button>
            </div>

            <div className="mt-6 md:mt-8">
              <div className="relative mb-4 md:mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 backdrop-blur-sm bg-white/5 text-gray-400">
                    Or
                  </span>
                </div>
              </div>

              <Link
                href="/tracker?mode=guest"
                className="inline-block w-full px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold text-white bg-white/5 backdrop-blur-sm rounded-xl 
                hover:bg-white/10 transform hover:scale-105 transition-all duration-200 border border-white/10 text-center"
              >
                Continue as Guest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
