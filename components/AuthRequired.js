"use client";

import Link from "next/link";

export default function AuthRequired({
  emoji = "🔒",
  title = "Sign in required",
  description = "Sign in to access this feature."
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <div className="text-6xl mb-4">{emoji}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">{description}</p>

      <Link
        href="/sign-in"
        className="px-6 py-2 bg-blue-600 text-white rounded-full"
      >
        Sign in
      </Link>
    </div>
  );
}
