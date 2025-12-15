// app/watch/[id]/page.js
import { prisma } from "@/lib/prisma";

export default async function WatchPage({ params }) {
  const { id } = await params;

  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video) {
    return <div className="p-4">Video not found</div>;
  }

  // extract videoId from URLs like: https://youtu.be/d8uV8U6lWa0?si=...
  const match = video.videoUrl.match(
    /(?:youtu\.be\/|v=)([A-Za-z0-9_-]{11})/
  );
  const videoId = match ? match[1] : null;

  return (
    <div className="p-6 pt-24">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>

      {videoId ? (
        <div className="w-full max-w-4xl aspect-video">
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="text-red-500">Invalid YouTube URL</p>
      )}

      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {video.channel} • {video.duration}
      </p>
    </div>
  );
}
