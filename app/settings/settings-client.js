"use client";

import { Moon, Sun, Shield } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useClerk } from "@clerk/nextjs";

export default function SettingsClient({ user }) {
  const isGuest = !user;

  const { openUserProfile } = useClerk();

  const darkMode = useUIStore((s) => s.darkMode);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Settings</h1>

      {/* ================= APPEARANCE ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          {darkMode ? (
            <Moon className="text-red-600" />
          ) : (
            <Sun className="text-red-600" />
          )}
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Choose how CnTube looks for you.
        </p>

        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 px-5 py-3 rounded-xl
                     bg-gray-100 dark:bg-gray-800
                     hover:bg-gray-200 dark:hover:bg-gray-700
                     transition"
        >
          {darkMode ? "Switch to Light mode" : "Switch to Dark mode"}
        </button>
      </div>

      {/* ================= ACCOUNT (CLERK) ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-red-600" />
          <h2 className="text-lg font-semibold">Account & security</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Manage your name, password, email, profile photo and security settings.
        </p>

        <button
          disabled={isGuest}
          onClick={() => openUserProfile()}
          className={`px-6 py-2.5 rounded-full font-medium transition
            ${
              isGuest
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          Manage account
        </button>

        {isGuest && (
          <p className="text-sm text-gray-500 mt-3">
            Sign in to manage your account.
          </p>
        )}
      </div>
    </div>
  );
}
