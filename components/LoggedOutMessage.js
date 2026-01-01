"use client";

import Link from "next/link";
import {
  Clock,
  ThumbsUp,
  Bookmark,
  Info,
  Tv,
  User,
  Upload,
} from "lucide-react";

export default function LoggedOutMessage({ type, isGuest = false }) {
  let Icon;
  let title;
  let subtitle;//  Guest user message (same for all pages)
  if (isGuest) {
    Icon = Info;
    title = "You’re browsing as a guest";
    subtitle =
      "Sign in to unlock history, likes, subscriptions, and Watch Later.";
  } else {
    switch (type) {
      case "history":
        Icon = Clock;
        title = "Keep track of what you watch";
        subtitle =
          "Watch history isn’t viewable when signed out.";
        break;

      case "liked":
        Icon = ThumbsUp;
        title = "Liked videos";
        subtitle =
          "Sign in to see the videos you like.";
        break;

      case "watchLater":
        Icon = Bookmark;
        title = "Save videos to watch later";
        subtitle =
          "Sign in to access your Watch Later videos.";
        break;

      case "subscriptions":
        Icon = Tv;
        title = "Don’t miss new videos";
        subtitle =
          "Sign in to see updates from your favorite channels.";
        break;

      case "channel":
        Icon = User;
        title = "This channel is available when you sign in";
        subtitle =
          "Sign in to view channel videos and subscribe.";
        break;

        case "upload":
  Icon = Upload;
  title = "Upload your videos";
  subtitle =
    "Sign in to upload videos and manage your channel.";
  break;


      default:
        Icon = Info;
        title = "Sign in to continue";
        subtitle = "Please sign in to continue.";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
      <Icon className="w-20 h-20 text-gray-400 mb-6" />

      <h2 className="text-2xl font-semibold mb-2">
        {title}
      </h2>

      <p className="text-gray-500 mb-6 max-w-md">
        {subtitle}
      </p>

      {!isGuest && (
        <Link
          href="/sign-in"
          className="px-6 py-2 rounded-full border
                     text-blue-600 font-medium
                     hover:bg-blue-50"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
