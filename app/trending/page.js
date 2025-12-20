import { prisma } from "@/lib/prisma";
import VideoGridClient from "@/components/VideoGridClient";

export default async function TrendingPage() {
  const videos = await prisma.video.findMany({
    where: { category: "Trending" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Trending</h1>
      {videos.length === 0 ? (
        <p className="text-gray-500">No trending videos.</p>
      ) : (
        <VideoGridClient videos={videos} />
      )}
    </div>
  );
}
