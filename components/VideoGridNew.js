import { prisma } from "@/lib/prisma";
import VideoCardNew from "./VideoCardNew";

export default async function VideoGridNew() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (!videos || videos.length === 0) {
    return <div className="p-4">No videos available</div>;
  }

 return (
  <div className="w-full flex justify-center">
    <div
      className="
        w-full
        max-w-[1600px]
        px-3 sm:px-4 md:px-6 lg:px-8
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
      "
    >
      {videos.map((video) => (
        <VideoCardNew key={video.id} video={video} />
      ))}
    </div>
  </div>
);


}
