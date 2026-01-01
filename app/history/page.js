import { prisma } from "@/lib/prisma";
import VideoGridClient from "@/components/VideoGridClient";
import LoggedOutMessage from "@/components/LoggedOutMessage";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return <LoggedOutMessage type="history" />;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    return (
      <p className="p-6 text-gray-500">
        No history yet.
      </p>
    );
  }

  const history = await prisma.history.findMany({
    where: { userId: user.id },
    orderBy: { watchedAt: "desc" },
    include: { video: true },
  });

  const seen = new Set();
  const videos = [];

  for (const h of history) {
    if (!seen.has(h.videoId)) {
      seen.add(h.videoId);
      videos.push(h.video);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">History</h1>

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
