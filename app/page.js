export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import VideoGridClient from "@/components/VideoGridClient";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Please login to watch videos
        </h2>

        <div className="flex gap-4 mt-4">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 border rounded"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  const videos = await prisma.video.findMany({
    where: { contentType: "video" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mt-4">
      <VideoGridClient videos={videos} />
    </div>
  );
}