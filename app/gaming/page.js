import { prisma } from "@/lib/prisma";
import VideoGridClient from "@/components/VideoGridClient";

export default async function GamingPage() {
  const videos = await prisma.video.findMany({
    where: {
      category: "Gaming",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Gaming
      </h1>

      {videos.length === 0 ? (
        <p className="text-gray-500">
          No gaming videos found.
        </p>
      ) : (
        <VideoGridClient videos={videos} />
      )}
    </div>
  );
}
