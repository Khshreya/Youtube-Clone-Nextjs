// app/page.js
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import VideoGridClient from "@/components/VideoGridClient";

export default async function Home() {
  const videos = await prisma.video.findMany({
    where: {
      contentType: "video", 
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mt-4">
      <VideoGridClient videos={videos} />
    </div>
  );
}
