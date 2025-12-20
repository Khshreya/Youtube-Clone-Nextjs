import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import VideoGridClient from "@/components/VideoGridClient";

const CURRENT_USER = "Shreya";

export default async function WatchLaterPage() {
  const items = await prisma.watchLater.findMany({
    where: { user: CURRENT_USER },
    orderBy: { addedAt: "desc" },
    include: { video: true },
  });

  const videos = items.map((i) => i.video);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Watch Later
      </h1>

      {videos.length === 0 ? (
        <p className="text-gray-500">
          Videos you save will appear here.
        </p>
      ) : (
        <VideoGridClient videos={videos} />
      )}
    </div>
  );
}
