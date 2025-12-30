import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import VideoGridClient from "@/components/VideoGridClient";
import { getCurrentUser } from "@/lib/auth";

export default async function MusicPage() {
  const user = await getCurrentUser(); // may be null → guest

  const videos = await prisma.video.findMany({
    where: { category: "Music" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Music</h1>

      {videos.length === 0 ? (
        <p className="text-gray-500">No music videos found.</p>
      ) : (
        <VideoGridClient videos={videos} />
      )}
    </div>
  );
}
