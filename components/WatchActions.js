"use client";

import { useState } from "react";
import LikeDislikeBar from "./LikeDislikeBar";
import WatchLaterButton from "./WatchLaterButton";

export default function WatchActions({ videoId }) {
  const [saved, setSaved] = useState(false);

  const handleWatchLater = async () => {
    if (saved) return;

    setSaved(true);

    try {
      await fetch("/api/watch-later", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
    } catch {
      setSaved(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-3">
      <LikeDislikeBar videoId={videoId} />
      <WatchLaterButton saved={saved} onClick={handleWatchLater} />
    </div>
  );
}
