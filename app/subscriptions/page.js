import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import SubscriptionsClient from "./SubscriptionsClient";
import LoggedOutMessage from "@/components/LoggedOutMessage";
export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const user = await getCurrentUser();

  // Safety check (middleware already handles this)
 if (!user) {
  return <LoggedOutMessage type="subscriptions" />;
}

if (user.isGuest) {
  return (
    <LoggedOutMessage
      type="subscriptions"
      isGuest
    />
  );
}


  // Get subscribed channels
  const subs = await prisma.subscription.findMany({
    where: { userId: user.id },
  });

  const channels = subs.map((s) => s.channel);

  //  Logged in but no subscriptions
  if (channels.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        <h1 className="text-2xl font-semibold mb-2">
          Subscriptions
        </h1>
        <p>
          Channels you subscribe to will appear here.
        </p>
      </div>
    );
  }

  // Get videos from subscribed channels
  const videos = await prisma.video.findMany({
    where: {
      channel: { in: channels },
      contentType: { in: ["video", "short"] },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group videos by channel
  const grouped = channels.map((channel) => ({
    channel,
    videos: videos.filter((v) => v.channel === channel),
  }));

  return <SubscriptionsClient initialSubs={grouped} />;
}
