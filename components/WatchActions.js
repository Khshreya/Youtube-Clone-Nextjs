"use client";

import LikeDislikeBar from "./LikeDislikeBar";
import WatchLaterButton from "./WatchLaterButton";

export default function WatchActions({ videoId }) {
  return (
    <div className="flex items-center gap-4 mt-3">
      <LikeDislikeBar videoId={videoId} />
      <WatchLaterButton videoId={videoId} />
    </div>
  );
}
