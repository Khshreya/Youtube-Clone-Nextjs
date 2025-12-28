import { prisma } from "@/lib/prisma";
import VideoGridClient from "./VideoGridClient";
import ShortsRow from "@/components/ShortsRow";

export default async function VideoGridNew() {
  const allVideos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  });

  const videos = allVideos.filter(
    (v) => v.contentType !== "short"
  );

  const shorts = allVideos.filter(
    (v) => v.contentType === "short"
  );

  return (
    <>
      {/* NORMAL VIDEOS */}
      <VideoGridClient videos={videos} />

      {/* SHORTS SECTION */}
      <ShortsRow shorts={shorts} />
    </>
  );
}
