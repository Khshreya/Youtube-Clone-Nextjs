export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import VideoGridClient from "@/components/VideoGridClient";
import ShortsRow from "@/components/ShortsRow";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Please login to watch videos
        </h2>

        <div className="flex gap-4 mt-4">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 border rounded"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  //  Fetch shorts
  const shorts = await prisma.video.findMany({
    where: { contentType: "short" },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  //  Fetch videos
  const videos = await prisma.video.findMany({
    where: { contentType: "video" },
    orderBy: { createdAt: "desc" },
  });

  // Split videos to place shorts in the middle
  const firstBatch = videos.slice(0, 8);
  const remainingVideos = videos.slice(8);

  return (
    <div className="space-y-10 pb-10">
      {/*  TOP VIDEOS */}
      <VideoGridClient videos={firstBatch} />

      {/*  SHORTS (CENTER) */}
      {shorts.length > 0 && <ShortsRow shorts={shorts} />}

      {/*  MORE VIDEOS */}
      <VideoGridClient videos={remainingVideos} />
    </div>
  );
}
