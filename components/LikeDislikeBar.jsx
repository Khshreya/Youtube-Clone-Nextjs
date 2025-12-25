"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function LikeDislikeBar({ videoId, layout = "horizontal" }) {
  const [reaction, setReaction] = useState(null); // 1, -1, null
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch reaction + count on load
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/like?videoId=${videoId}`);
      const data = await res.json();
      setReaction(data.reaction);
      setLikeCount(data.likeCount);
    };
    load();
  }, [videoId]);

  // Handle Like / Dislike click (LOGIC UNCHANGED)
  const handleClick = async (value) => {
    if (loading) return;
    setLoading(true);

    let newReaction = reaction;
    let newCount = likeCount;

    // TOGGLE LOGIC
    if (reaction === value) {
      newReaction = null;
      if (value === 1) newCount -= 1;
    } else {
      if (reaction === 1) newCount -= 1;
      if (value === 1) newCount += 1;
      newReaction = value;
    }

    // Optimistic UI update
    setReaction(newReaction);
    setLikeCount(newCount);

    try {
      await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          value: newReaction,
        }),
      });
    } catch (err) {
      console.error(err);
      setReaction(reaction);
      setLikeCount(likeCount);
    } finally {
      setLoading(false);
    }
  };

  const isVertical = layout === "vertical";

  return (
    <div
      className={`flex ${
        isVertical ? "flex-col items-center gap-3" : "items-center gap-4"
      }`}
    >
      {/* LIKE */}
      <button
        onClick={() => handleClick(1)}
        disabled={loading}
        className={`flex ${
          isVertical ? "flex-col" : "items-center"
        } gap-1 px-3 py-2 rounded-full border transition ${
          reaction === 1
            ? "bg-blue-100 text-blue-600 border-blue-300"
            : "bg-white text-gray-700 border-gray-300"
        }`}
      >
        <ThumbsUp size={18} />
        <span className="text-sm">{likeCount}</span>
      </button>

      {/* DISLIKE */}
      <button
        onClick={() => handleClick(-1)}
        disabled={loading}
        className={`p-3 rounded-full border transition ${
          reaction === -1
            ? "bg-red-100 text-red-600 border-red-300"
            : "bg-white text-gray-700 border-gray-300"
        }`}
      >
        <ThumbsDown size={18} />
      </button>
    </div>
  );
}
