import { prisma } from "@/lib/prisma";
import VideoGridClient from "@/components/VideoGridClient";
import LoggedOutMessage from "@/components/LoggedOutMessage";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function WatchLaterPage() {
  //  Check Clerk login
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return <LoggedOutMessage type="watchLater" />;
  }

  // Resolve / create Prisma user
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email:
          clerkUser.emailAddresses?.[0]?.emailAddress ??
          `${clerkUser.id}@clerk.user`,
        name: clerkUser.fullName ?? "User",
      },
    });
  }

  //  Fetch Watch Later items
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
