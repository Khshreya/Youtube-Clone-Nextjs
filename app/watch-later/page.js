import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import VideoGridClient from "@/components/VideoGridClient";
import LoggedOutMessage from "@/components/LoggedOutMessage";
export const dynamic = "force-dynamic";

export default async function WatchLaterPage() {
  const user = await getCurrentUser();
if (!user) {
  return <LoggedOutMessage type="watchLater" />;
}

if (user.isGuest) {
  return (
    <LoggedOutMessage
      type="watchLater"
      isGuest
    />
  );
}


  const items = await prisma.watchLater.findMany({
    where: { userId: user.id },
    orderBy: { addedAt: "desc" },
    include: { video: true },
  });

  const videos = items.map((item) => item.video);

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