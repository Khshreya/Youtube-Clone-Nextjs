"use client";

import LikeDislikeBar from "@/components/LikeDislikeBar";
import WatchLaterButton from "@/components/WatchLaterButton";
import SubscribeButton from "@/components/SubscribeButton";
import { useEffect, useState } from "react";

export default function VideoActions({ video }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user (client-safe)
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.ok && res.json())
      .then((data) => setCurrentUser(data?.user))
      .catch(() => {});
  }, []);

  const isOwnChannel =
    currentUser && currentUser.name === video.channel;

  return (
    <div className="flex items-center gap-4 mt-4">
      <LikeDislikeBar videoId={video.id} />
      <WatchLaterButton videoId={video.id} />

      {/* SHOW SUBSCRIBE ONLY IF NOT OWN CHANNEL */}
      {!isOwnChannel && (
        <SubscribeButton channel={video.channel} />
      )}
    </div>
  );
}
