"use client";

import { useState } from "react";
import { User, Lock } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { Moon, Sun } from "lucide-react";

export default function SettingsClient({ user }) {
    const darkMode = useUIStore((s) => s.darkMode);
const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  const [name, setName] = useState(user.name);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const updateName = async () => {
    setLoading(true);
    await fetch("/api/settings/name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setLoading(false);
    alert("Channel name updated");
  };

  const updatePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/settings/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) alert(data.error);
    else {
      alert("Password updated");
      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Settings</h1>

      {/* ================= CHANNEL NAME ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <User className="text-red-600" />
          <h2 className="text-lg font-semibold">Channel details</h2>
        </div>

        <label className="text-sm text-gray-500">Channel name</label>
        <input
          className="
            w-full mt-1 px-4 py-3 rounded-xl
            bg-gray-100 dark:bg-gray-800
            outline-none focus:ring-2 focus:ring-red-500
          "
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={updateName}
          disabled={loading}
          className="
            mt-4 px-6 py-2.5 rounded-full
            bg-red-600 text-white font-medium
            hover:bg-red-700 transition
          "
        >
          Save changes
        </button>
      </div>
{/* ================= THEME ================= */}
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
    className="
      flex items-center gap-3
      px-5 py-3 rounded-xl
      bg-gray-100 dark:bg-gray-800
      hover:bg-gray-200 dark:hover:bg-gray-700
      transition
    "
  >
    {darkMode ? (
      <>
        <Sun size={18} />
        <span className="text-sm font-medium">Switch to Light mode</span>
      </>
    ) : (
      <>
        <Moon size={18} />
        <span className="text-sm font-medium">Switch to Dark mode</span>
      </>
    )}
  </button>
</div>

      {/* ================= PASSWORD ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="text-red-600" />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>

        <label className="text-sm text-gray-500">Current password</label>
        <input
          type="password"
          className="
            w-full mt-1 px-4 py-3 rounded-xl
            bg-gray-100 dark:bg-gray-800
            outline-none focus:ring-2 focus:ring-red-500
          "
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label className="text-sm text-gray-500 mt-4 block">
          New password
        </label>
        <input
          type="password"
          className="
            w-full mt-1 px-4 py-3 rounded-xl
            bg-gray-100 dark:bg-gray-800
            outline-none focus:ring-2 focus:ring-red-500
          "
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={updatePassword}
          disabled={loading}
          className="
            mt-5 px-6 py-2.5 rounded-full
            bg-red-600 text-white font-medium
            hover:bg-red-700 transition
          "
        >
          Update password
        </button>
      </div>
    </div>
  );
}
