import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LikeDislikeBar from "@/components/LikeDislikeBar"; 
import WatchLaterButton from "@/components/WatchLaterButton";
import VideoActions from "@/components/VideoActions";


export default async function WatchPage({ params }) {
  const { id } = await params;

  if (!id) notFound();

  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video) notFound();

  const match = video.videoUrl.match(
    /(?:youtu\.be\/|v=)([A-Za-z0-9_-]{11})/
  );
  const videoId = match ? match[1] : null;

  return (
    <div className="pt-16 px-6 max-w-4xl mx-auto">
      {/* VIDEO */}
      <div className="w-full aspect-video bg-black">
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0&iv_load_policy=3`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="text-white flex items-center justify-center h-full">
            Invalid video
          </div>
        )}
      </div>

      {/* TITLE */}
      <h1 className="text-lg font-semibold mt-4">
        {video.title}
      </h1>

      {/* CHANNEL */}
      <p className="text-sm text-gray-500 mt-1">
        {video.channel} • {video.duration}
      </p>

      {/* ACTION BAR */}
    <VideoActions video={video} />


    </div>
  );
}
