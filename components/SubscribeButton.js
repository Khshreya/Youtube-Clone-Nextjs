"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscribeButton({ channel }) {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `/api/subscription/status?channel=${encodeURIComponent(channel)}`
      );
      const data = await res.json();
      setSubscribed(data.subscribed);
      setLoading(false);
    };
    load();
  }, [channel]);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/subscription", {
        method: subscribed ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Subscription failed");
      }

      setSubscribed(!subscribed);
      // refresh current route so subscription-only pages update
      try { router.refresh(); } catch (e) {}
    } catch (err) {
      console.error("Subscription failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-5 py-2 rounded-full text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed
        ${
          subscribed
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-black text-white hover:bg-gray-900"
        }
      `}
    >
      {loading ? (subscribed ? "Processing..." : "Processing...") : subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
