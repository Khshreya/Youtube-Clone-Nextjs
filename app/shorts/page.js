import { prisma } from "@/lib/prisma";
import ShortsFeed from "@/components/ShortsFeed";

export default async function ShortsPage() {
  const shorts = await prisma.video.findMany({
    where: { contentType: "short" },
    orderBy: { createdAt: "desc" },
  });

  return <ShortsFeed shorts={shorts} />;
}
