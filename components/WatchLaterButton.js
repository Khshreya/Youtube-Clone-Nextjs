"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function WatchLaterButton({ videoId }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [statusRes, meRes] = await Promise.all([
          fetch(`/api/watch-later/status?videoId=${videoId}`),
          fetch("/api/auth/me"),
        ]);

        const statusData = await statusRes.json();
        const meData = await meRes.json().catch(() => ({}));

        setSaved(!!statusData.saved);
        setIsGuest(!meData.user || meData.user.isGuest);
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

   
    if (isGuest) {
      alert("You’re in guest mode. Sign in to use Watch Later.");
      return;
    }

    setSaved((prev) => !prev);

    try {
      await fetch("/api/watch-later", {
        method: saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
    } catch (err) {
      console.error(err);
      setSaved((prev) => !prev);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={
        saved ? "Remove from Watch Later" : "Save to Watch Later"
      }
      className={`
        flex items-center justify-center
        w-11 h-11 rounded-full
        transition-all duration-200

        ${
          saved
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
        }
      `}
    >
      <Clock size={18} />
    </button>
  );
}
