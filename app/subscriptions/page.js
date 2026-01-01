import { prisma } from "@/lib/prisma";
import SubscriptionsClient from "./SubscriptionsClient";
import LoggedOutMessage from "@/components/LoggedOutMessage";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  //  Check Clerk login
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return <LoggedOutMessage type="subscriptions" />;
  }

  //  Resolve / create Prisma user
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email:
          clerkUser.emailAddresses?.[0]?.emailAddress ??
          `${clerkUser.id}@clerk.user`,
        name: clerkUser.fullName ?? "User",
      },
    });
  }

  //  Get subscribed channels
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

  //  Fetch videos from subscribed channels
  const videos = await prisma.video.findMany({
    where: {
      channel: { in: channels },
      contentType: { in: ["video", "short"] },
    },
    orderBy: { createdAt: "desc" },
  });

  //  Group videos by channel
  const grouped = channels.map((channel) => ({
    channel,
    videos: videos.filter((v) => v.channel === channel),
  }));

  return <SubscriptionsClient initialSubs={grouped} />;
}