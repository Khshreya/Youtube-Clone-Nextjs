// app/page.js
import { prisma } from "@/lib/prisma";
import VideoGridClient from "@/components/VideoGridClient";

export default async function Home() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mt-4">
      <VideoGridClient videos={videos} />
    </div>
  );
}
