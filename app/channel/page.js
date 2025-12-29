import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import VideoGridClient from "@/components/VideoGridClient";
import LoggedOutMessage from "@/components/LoggedOutMessage";

export const dynamic = "force-dynamic";

export default async function MyChannelPage() {
  const user = await getCurrentUser();

  // Not logged in
  if (!user) {
    return <LoggedOutMessage type="channel" />;
  }

  //  Guest user
  if (user.isGuest) {
    return (
      <LoggedOutMessage
        type="channel"
        isGuest
      />
    );
  }

  //  Logged-in real user
  const [videos, subscriberCount] = await Promise.all([
    prisma.video.findMany({
      where: {
        channel: user.name,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscription.count({
      where: {
        channel: user.name,
      },
    }),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {user.name}
        </h1>
        <p className="text-gray-500 text-sm">
          {subscriberCount} subscribers • {videos.length} videos
        </p>
      </div>

      {videos.length === 0 ? (
        <p className="text-gray-500">
          You haven’t uploaded any videos yet.
        </p>
      ) : (
        <VideoGridClient
          videos={videos}
          showDelete
        />
      )}
    </div>
  );
}
