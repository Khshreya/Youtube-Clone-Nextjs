import { prisma } from "@/lib/prisma";
import VideoGridClient from "@/components/VideoGridClient";
import LoggedOutMessage from "@/components/LoggedOutMessage";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function MyChannelPage() {
  //  Check Clerk login
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return <LoggedOutMessage type="channel" />;
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

  //  Fetch channel data
  const [videos, subscriberCount] = await Promise.all([
    prisma.video.findMany({
      where: { channel: user.name },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscription.count({
      where: { channel: user.name },
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
