import { prisma } from "@/lib/prisma";
import LoggedOutMessage from "@/components/LoggedOutMessage";
import VideoGridClient from "@/components/VideoGridClient";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function LikedVideosPage() {
  //  Check Clerk login
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return <LoggedOutMessage type="liked" />;
  }

  // Resolve / create Prisma user
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

  //  Get liked videos
  const likes = await prisma.like.findMany({
    where: {
      userId: user.id,
      value: 1,
    },
    select: { videoId: true },
  });

  if (likes.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Liked Videos
        </h1>
        <p className="text-gray-500">
          Videos you like will appear here.
        </p>
      </div>
    );
  }

  //  Fetch videos
  const videos = await prisma.video.findMany({
    where: {
      id: { in: likes.map((l) => l.videoId) },
    },
  });

  return <VideoGridClient videos={videos} />;
}
