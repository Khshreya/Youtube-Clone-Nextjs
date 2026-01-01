"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function WatchLaterButton({ videoId }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load saved state
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `/api/watch-later/status?videoId=${videoId}`,
          { credentials: "include" } //  REQUIRED
        );
        const data = await res.json();
        setSaved(!!data.saved);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [videoId]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading) return;

    const next = !saved;
    setSaved(next); // optimistic UI

    try {
      const res = await fetch("/api/watch-later", {
        method: next ? "POST" : "DELETE",
        credentials: "include", // REQUIRED
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });

      if (!res.ok) {
        setSaved(!next); // rollback
        if (res.status === 401 || res.status === 403) {
          alert("Sign in to use Watch Later");
        }
      }
    } catch (err) {
      console.error(err);
      setSaved(!next);
    }
  };

  return (
    <button
      onClick={handleClick}
      title={saved ? "Remove from Watch Later" : "Save to Watch Later"}
      className={`w-11 h-11 rounded-full flex items-center justify-center transition
        ${
          saved
            ? "bg-blue-600 text-white"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      <Clock size={18} />
    </button>
  );
}
