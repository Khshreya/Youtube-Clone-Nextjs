"use client";

import { useState } from "react";

export default function SubscribeButton({ channel }) {
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = async () => {
    await fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel }),
    });

    setSubscribed(true);
  };

  return (
    <button
      onClick={subscribe}
      className="px-4 py-2 rounded-full bg-black text-white text-sm"
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
