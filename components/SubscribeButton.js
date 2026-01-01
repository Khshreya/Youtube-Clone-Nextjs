"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

export default function SubscribeButton({ channel }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load subscription status
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `/api/subscription/status?channel=${encodeURIComponent(channel)}`,
          { credentials: "include" } // REQUIRED
        );
        const data = await res.json();
        setSubscribed(!!data.subscribed);
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

    const next = !subscribed;
    setSubscribed(next); // optimistic UI
    setLoading(true);

    try {
      const res = await fetch("/api/subscription", {
        method: next ? "POST" : "DELETE",
        credentials: "include", // REQUIRED
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      });

      if (!res.ok) {
        setSubscribed(!next); // rollback
        if (res.status === 401 || res.status === 403) {
          alert("Sign in to subscribe to channels");
        }
      }
    } catch (err) {
      console.error(err);
      setSubscribed(!next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2
        px-4 py-1.5 rounded-full text-sm font-semibold
        transition
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
