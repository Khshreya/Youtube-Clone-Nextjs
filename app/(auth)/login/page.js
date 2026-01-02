"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signIn.create({
        identifier: email,
        password,
      });
      router.push("/auth/sync");
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && email && password) {
      handleLogin();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/auth/sync",
        redirectUrlComplete: "/auth/sync",
      });
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Left side - Form */}
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-600 mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Welcome back
              </h1>
              <p className="text-base text-gray-600">
                Sign in to your CnTube account to continue
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="space-y-5">
                {/* Error Alert */}
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                             transition duration-200 placeholder:text-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="name@company.com"
                    disabled={loading}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                               transition duration-200 placeholder:text-gray-400 pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                {/* <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div> */}

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading || !email || !password}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium
                           hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                           transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-sm hover:shadow-md"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3
                           bg-white border-2 border-gray-300 rounded-lg
                           hover:bg-gray-50 hover:border-gray-400
                           focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                           transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           font-medium text-gray-700"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span>Google</span>
                </button>
              </div>

              {/* Sign up link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="text-red-600 hover:text-red-700 font-semibold transition"
                  disabled={loading}
                >
                  Sign up for free
                </button>
              </p>
            </div>

            {/* Footer */}
           
          </div>
        </div>

        {/* Right side - Image/Illustration */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 h-full p-12">
          <div className="max-w-lg">
            <img
              src="/sign-in.png"
              alt="Sign in illustration"
              className="w-full h-auto drop-shadow-2xl"
            />
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your video platform awaits
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Access  videos, manage your playlists, and enjoy a seamless viewing experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}