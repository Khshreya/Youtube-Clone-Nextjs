"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function SubscribeButton({ channel }) {
  const router = useRouter();

  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [statusRes, meRes] = await Promise.all([
          fetch(
            `/api/subscription/status?channel=${encodeURIComponent(channel)}`
          ),
          fetch("/api/auth/me"),
        ]);

        const statusData = await statusRes.json();
        const meData = await meRes.json().catch(() => ({}));

        setSubscribed(statusData.subscribed);
        setIsGuest(!!meData.user?.isGuest);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [channel]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading) return;

    if (isGuest) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/subscription", {
        method: subscribed ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      });

      if (!res.ok) throw new Error("Subscription failed");

      setSubscribed((p) => !p);
      try {
        router.refresh();
      } catch {}
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        inline-flex items-center gap-2
        px-4 py-1.5 rounded-full
        text-sm font-semibold
        transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed

        ${
          subscribed
            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
            : "bg-red-600 text-white hover:bg-red-700"
        }
      `}
    >
      {loading ? (
        "Processing…"
      ) : subscribed ? (
        <>
          <Check size={14} />
          Subscribed
        </>
      ) : (
        "Subscribe"
      )}
    </button>
  );
}
