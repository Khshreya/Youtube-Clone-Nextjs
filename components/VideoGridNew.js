import { prisma } from "@/lib/prisma";
import VideoGridClient from "./VideoGridClient";

export default async function VideoGridNew() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (!videos || videos.length === 0) {
    return <div className="p-4">No videos available</div>;
  }

  return <VideoGridClient videos={videos} />;
}
