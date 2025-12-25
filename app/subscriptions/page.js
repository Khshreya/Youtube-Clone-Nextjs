import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import SubscriptionsClient from "./SubscriptionsClient";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="p-6 text-gray-500">
        Please login to view subscriptions.
      </div>
    );
  }

  // 1️⃣ Get subscribed channels
  const subs = await prisma.subscription.findMany({
    where: { userId: user.id },
  });

  const channels = subs.map((s) => s.channel);

  if (channels.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        You haven’t subscribed to any channels yet.
      </div>
    );
  }

  // 2️⃣ Get videos ONLY from subscribed channels (include shorts)
  const videos = await prisma.video.findMany({
    where: {
      channel: { in: channels },
      contentType: { in: ["video", "short"] },
    },
    orderBy: { createdAt: "desc" },
  });

  // 3️⃣ Group videos by channel
  const grouped = channels.map((channel) => ({
    channel,
    videos: videos.filter((v) => v.channel === channel),
  }));

  return <SubscriptionsClient initialSubs={grouped} />;
}
