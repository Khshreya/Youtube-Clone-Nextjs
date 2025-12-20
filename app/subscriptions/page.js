import { prisma } from "@/lib/prisma";
import VideoGridClient from "@/components/VideoGridClient";

const CURRENT_USER = "Shreya";

export default async function SubscriptionsPage() {
  const subs = await prisma.subscription.findMany({
    where: { user: CURRENT_USER },
  });

  const channels = subs.map((s) => s.channel);

  const videos = await prisma.video.findMany({
    where: {
      contentType: "video",
      channel: {
        in: channels,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Subscriptions
      </h1>

      {videos.length === 0 ? (
        <p className="text-gray-500">
          You haven’t subscribed to any channels yet.
        </p>
      ) : (
        <VideoGridClient videos={videos} />
      )}
    </div>
  );
}
