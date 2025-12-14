// app/watch/[id]/page.js
import { prisma } from "@/lib/prisma";

// for JS
export default async function WatchPage({ params }) {
  // In new App Router, params can be a Promise – always await it:
  const { id } = await params; // id is your UUID string

  const video = await prisma.video.findUnique({
    where: { id }, // matches your `id` column
  });

  if (!video) {
    return <div className="p-4">Video not found</div>;
  }

  return (
    <div className="p-6 pt-24">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>

      <video
        src={video.videoUrl}
        controls
        className="w-full max-w-4xl rounded-lg bg-black"
      />

      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {video.channel} • {video.duration}
      </p>
    </div>
  );
}
