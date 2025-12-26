"use client";

import { useEffect, useState } from "react";
import { Clock, Check } from "lucide-react";

export default function WatchLaterButton({ videoId }) {
  const [saved, setSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Fetch saved status
  useEffect(() => {
    const load = async () => {
      try {
        const [res, meRes] = await Promise.all([
          fetch(`/api/watch-later/status?videoId=${videoId}`),
          fetch('/api/auth/me'),
        ]);
        const data = await res.json();
        const me = await meRes.json().catch(() => ({}));
        setSaved(data.saved);
        setIsGuest(!!me.user?.isGuest);
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
    if (loading || saved) return;

    if (isGuest) {
      alert("Sign in to save videos");
      return;
    }

    setSaved(true);
    setJustSaved(true); // trigger green feedback

    await fetch("/api/watch-later", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
    });

    // Remove green highlight after 1.2s
    setTimeout(() => setJustSaved(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      title={saved ? "Saved to Watch later" : "Watch later"}
      className={`relative p-3 rounded-full border transition-all duration-200
        ${
          justSaved
            ? "bg-green-100 border-green-300"
            : "bg-white border-gray-300 hover:bg-gray-100"
        }
      `}
    >
      {/* CLOCK ICON */}
      <Clock
        size={18}
        className="text-gray-700"
      />

      {/* SMALL CHECK INDICATOR (persistent) */}
      {saved && !justSaved && (
        <span className="absolute -top-1 -right-1 bg-green-600 rounded-full p-[2px]">
          <Check size={10} className="text-white" />
        </span>
      )}
    </button>
  );
}
