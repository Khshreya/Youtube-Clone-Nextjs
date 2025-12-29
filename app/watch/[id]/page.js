import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VideoActions from "@/components/VideoActions";

export default async function WatchPage({ params }) {
  const { id } = await params; 

  if (!id) notFound();

  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video) notFound();

  return (
    <div className="pt-16 px-6 max-w-4xl mx-auto">
      <div className="w-full aspect-video bg-black">
        <video
          src={video.videoUrl}
          controls
          className="w-full h-full rounded-lg"
        />
      </div>

      <h1 className="text-lg font-semibold mt-4">
        {video.title}
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        {video.channel} 
      </p>

      <VideoActions video={video} />
    </div>
  );
}
