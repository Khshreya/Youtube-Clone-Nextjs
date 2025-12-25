"use client";

import { useEffect, useState } from "react";
import { Clock, Check } from "lucide-react";

export default function WatchLaterButton({ videoId }) {
  const [saved, setSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch saved status
  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `/api/watch-later/status?videoId=${videoId}`
      );
      const data = await res.json();
      setSaved(data.saved);
      setLoading(false);
    };
    load();
  }, [videoId]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading || saved) return;

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
