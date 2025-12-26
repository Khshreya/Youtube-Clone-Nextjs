"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    router.push("/");
    router.refresh();
  };
  const handleGuest = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/guest", { method: "POST" });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || "Guest login failed");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setLoading(false);
      setError("Guest login failed");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <button
        type="button"
        onClick={handleGuest}
        disabled={loading}
        className="w-full mt-2 bg-gray-100 text-black py-2 rounded"
      >
        Continue as guest
      </button>
    </form>
  );
}
