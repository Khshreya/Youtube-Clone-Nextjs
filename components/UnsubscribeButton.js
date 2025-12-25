"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UnsubscribeButton({ channel, onUnsubscribed }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/subscription", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Unsubscribe failed");
      }

      // Notify parent to remove channel from UI, fallback to refresh
      if (typeof onUnsubscribed === "function") {
        onUnsubscribed(channel);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Unsubscribe failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUnsubscribe}
      disabled={loading}
      className="px-4 py-1.5 rounded-full text-sm font-medium border
                 bg-gray-100 hover:bg-gray-200 text-gray-800
                 disabled:opacity-50"
    >
      Unsubscribe
    </button>
  );
}
