import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import VideoGridClient from "@/components/VideoGridClient";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function TrendingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <h2 className="text-xl font-semibold mb-2">Please login to view Trending videos</h2>

        <div className="flex gap-4 mt-4">
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 border rounded">
            Register
          </Link>
        </div>
      </div>
    );
  }

  const videos = await prisma.video.findMany({
    where: { category: "Trending" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Trending</h1>
      {videos.length === 0 ? (
        <p className="text-gray-500">No trending videos.</p>
      ) : (
        <VideoGridClient videos={videos} />
      )}
    </div>
  );
}
