"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function LikeDislikeBar({ videoId, layout = "horizontal" }) {
  const [reaction, setReaction] = useState(null); // 1 | -1 | null
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /* Load reaction + count */
  useEffect(() => {
    fetch(`/api/like?videoId=${videoId}`)
      .then((r) => r.json())
      .then((d) => {
        setReaction(d.reaction);
        setLikeCount(d.likeCount);
      })
      .catch(() => {});
  }, [videoId]);

  const handleClick = async (value) => {
    if (loading) return;
    setLoading(true);

    let newReaction = reaction;
    let newCount = likeCount;

    if (reaction === value) {
      newReaction = null;
      if (value === 1) newCount -= 1;
    } else {
      if (reaction === 1) newCount -= 1;
      if (value === 1) newCount += 1;
      newReaction = value;
    }

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
    } catch {
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
        isVertical
          ? "flex-col items-center gap-4"
          : "items-center gap-4"
      }`}
    >
      {/* LIKE */}
      <button
        onClick={() => handleClick(1)}
        className={`
          flex flex-col items-center justify-center
          w-12 h-12 rounded-full
          transition
          ${
            reaction === 1
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300"
          }
        `}
      >
        <ThumbsUp size={18} />
        <span className="text-xs mt-1">{likeCount}</span>
      </button>

      {/* DISLIKE */}
      <button
        onClick={() => handleClick(-1)}
        className={`
          flex items-center justify-center
          w-12 h-12 rounded-full
          transition
          ${
            reaction === -1
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-700 border border-gray-300"
          }
        `}
      >
        <ThumbsDown size={18} />
      </button>
    </div>
  );
}
