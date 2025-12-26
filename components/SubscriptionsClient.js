"use client";

import { useState } from "react";
import UnsubscribeButton from "@/components/UnsubscribeButton";
import VideoGridClient from "@/components/VideoGridClient";

export default function SubscriptionsClient({ initialSubs = [] }) {
  const [subs, setSubs] = useState(initialSubs);

  const handleUnsubscribed = (channel) => {
    setSubs((prev) => prev.filter((s) => s.channel !== channel));
  };

  if (subs.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        You haven’t subscribed to any channels yet.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Subscriptions</h1>

      {subs.map((item) => (
        <div key={item.channel}>
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold">{item.channel}</h2>

            <UnsubscribeButton
              channel={item.channel}
              onUnsubscribed={handleUnsubscribed}
            />
          </div>

          {/* VIDEOS */}
          {item.videos.length === 0 ? (
            <p className="text-sm text-gray-500">No videos yet</p>
          ) : (
            <VideoGridClient videos={item.videos} />
          )}
        </div>
      ))}
    </div>
  );
}
