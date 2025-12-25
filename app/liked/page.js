import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import VideoGridClient from "@/components/VideoGridClient";

export const dynamic = "force-dynamic";

export default async function LikedVideosPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="p-6 text-gray-500">
        Please login to view liked videos.
      </div>
    );
  }

  // Fetch liked video IDs
  const likes = await prisma.like.findMany({
    where: {
      userId: user.id,
      value: 1, // ONLY liked
    },
    select: {
      videoId: true,
    },
  });

  const videoIds = likes.map((l) => l.videoId);

  if (videoIds.length === 0) {
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

  // Fetch actual videos
  const videos = await prisma.video.findMany({
    where: {
      id: { in: videoIds },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Liked Videos
      </h1>

      <VideoGridClient videos={videos} />
    </div>
  );
}
