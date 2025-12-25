import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VideoGridClient from "@/components/VideoGridClient";

export const dynamic = "force-dynamic";

export default async function PublicChannelPage({ params }) {
  const username = params?.username;

  if (!username) {
    notFound();
  }

  const [videos, subscriberCount] = await Promise.all([
    prisma.video.findMany({
      where: {
        channel: username,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscription.count({
      where: {
        channel: username,
      },
    }),
  ]);

  // If channel exists but no videos → still show channel
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{username}</h1>
        <p className="text-gray-500 text-sm">
          {subscriberCount} subscribers • {videos.length} videos
        </p>
      </div>

      {videos.length === 0 ? (
        <p className="text-gray-500">
          This channel has no videos yet.
        </p>
      ) : (
        <VideoGridClient videos={videos} />
      )}
    </div>
  );
}
