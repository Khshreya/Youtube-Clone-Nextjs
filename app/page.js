export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import VideoGridClient from "@/components/VideoGridClient";
import ShortsRow from "@/components/ShortsRow";

export default async function Home() {
  const shorts = await prisma.video.findMany({
    where: { contentType: "short" },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const videos = await prisma.video.findMany({
    where: { contentType: "video" },
    orderBy: { createdAt: "desc" },
  });

  const firstBatch = videos.slice(0, 8);
  const remainingVideos = videos.slice(8);

  return (
    <div className="space-y-10 pb-10">
      {/* First grid */}
      {firstBatch.length > 0 && (
        <VideoGridClient videos={firstBatch} />
      )}

      {/* Shorts */}
      {shorts.length > 0 && <ShortsRow shorts={shorts} />}

      {/* Remaining videos */}
      {remainingVideos.length > 0 && (
        <VideoGridClient videos={remainingVideos} />
      )}
    </div>
  );
}
