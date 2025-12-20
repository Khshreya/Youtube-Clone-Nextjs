import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import VideoGridClient from "@/components/VideoGridClient";

const CURRENT_USER = "Shreya";

export default async function HistoryPage() {
  const historyRaw = await prisma.history.findMany({
    where: { user: CURRENT_USER },
    orderBy: { watchedAt: "desc" },
    include: { video: true },
  });

  // 🔥 Deduplicate by videoId (keep most recent)
  const seen = new Set();
  const videos = [];

  for (const item of historyRaw) {
    if (!seen.has(item.videoId)) {
      seen.add(item.videoId);
      videos.push(item.video);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        History
      </h1>

      {videos.length === 0 ? (
        <p className="text-gray-500">
          Videos you watch will appear here.
        </p>
      ) : (
        <VideoGridClient videos={videos} />
      )}
    </div>
  );
}
