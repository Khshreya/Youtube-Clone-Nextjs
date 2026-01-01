"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) return null;

  const handleSignup = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await signUp.create({
        emailAddress: email,
        password,
      });

      router.push("/auth/sync");
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!signUp) return;
   await signUp.authenticateWithRedirect({
  strategy: "oauth_google",
  redirectUrl: "/auth/sync",
  redirectUrlComplete: "/auth/sync",
  afterSignUpUrl: "/auth/sync",
  afterSignInUrl: "/auth/sync",
});

  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center px-4 sm:px-6 lg:px-12 py-8 md:py-0 gap-8">
        {/* IMAGE – visible on mobile and desktop */}
        <div className="flex items-center justify-center mb-6 md:mb-0">
          <div className="relative h-full w-full flex items-center justify-center">
            {/* rose panel only on md+ */}
            <div className="hidden md:block absolute inset-y-10 left-6 w-[75%] rounded-3xl" />
            <img
              src="/sign-up.png"
              alt="Sign up"
              className="relative z-10 w-56 sm:w-64 md:w-[480px] max-w-full"
            />
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white/90 px-5 sm:px-8 py-6 sm:py-8 shadow-xl ring-1 ring-slate-200 backdrop-blur">
            <p className="text-sm font-medium text-red-600 mb-1">
              Create your account
            </p>

            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              Sign up
            </h1>

            <p className="text-gray-500 mb-6 sm:mb-8 text-sm">
              Join{" "}
              <span className="font-medium text-gray-900">
                CnTube
              </span>{" "}
              to start watching and uploading content.
            </p>

            <input
              type="email"
              placeholder="Email address"
              className="w-full mb-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg
                         bg-gray-50 border border-gray-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                         transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg
                         bg-gray-50 border border-gray-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                         transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-sm text-red-600 mb-4 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleSignup}
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-2.5 sm:py-3 rounded-lg
                         text-sm font-medium shadow-sm
                         hover:bg-red-700 transition
                         disabled:cursor-not-allowed disabled:bg-red-400
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-3 text-xs text-gray-400 uppercase tracking-wide">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3
                         bg-white border border-gray-200
                         py-2.5 sm:py-3 rounded-lg
                         text-sm font-medium text-gray-700 shadow-sm
                         hover:bg-gray-50 transition"
            >
              <FcGoogle size={22} />
              <span>Continue with Google</span>
            </button>

            <p className="text-xs sm:text-sm text-center mt-6 sm:mt-8 text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-red-600 cursor-pointer hover:underline font-medium"
              >
                Log in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
