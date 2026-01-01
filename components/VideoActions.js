"use client";

import { useEffect } from "react";
import LikeDislikeBar from "@/components/LikeDislikeBar";
import WatchLaterButton from "@/components/WatchLaterButton";
import SubscribeButton from "@/components/SubscribeButton";

export default function VideoActions({ video }) {

  //  SAVE HISTORY ON WATCH PAGE LOAD
  useEffect(() => {
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId: video.id }),
    }).catch(() => {});
  }, [video.id]);

  return (
    <div className="flex items-center gap-4 mt-4">
      <LikeDislikeBar videoId={video.id} />
      <WatchLaterButton videoId={video.id} />
      <SubscribeButton channel={video.channel} />
    </div>
  );
}
