import { prisma } from "@/lib/prisma";
import VideoGridClient from "@/components/VideoGridClient";

const MY_CHANNEL = "CodeWithShreya";

export default async function ChannelPage() {
  const videos = await prisma.video.findMany({
    where: {
      channel: MY_CHANNEL,
      contentType: "video",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      {/* CHANNEL HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{MY_CHANNEL}</h1>
        <p className="text-gray-500 text-sm">
          {videos.length} videos
        </p>
      </div>

      {/* VIDEOS */}
      {videos.length === 0 ? (
        <p className="text-gray-500">
          You haven’t uploaded any videos yet.
        </p>
      ) : (
        <VideoGridClient videos={videos} />
      )}
    </div>
  );
}
