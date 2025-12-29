import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import VideoGridClient from "@/components/VideoGridClient";
import LoggedOutMessage from "@/components/LoggedOutMessage";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await getCurrentUser();

 
  if (!user) {
    return <LoggedOutMessage type="history" />;
  }
 if (user.isGuest) {
    return (
      <LoggedOutMessage
        type="history"
        isGuest
      />
    );
  }
  const historyRaw = await prisma.history.findMany({
    where: { userId: user.id },
    orderBy: { watchedAt: "desc" },
    include: { video: true },
  });

  // Remove duplicates (latest first)
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
