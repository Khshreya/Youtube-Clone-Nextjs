import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import ShortsFeed from "@/components/ShortsFeed";
import { getCurrentUser } from "@/lib/auth";

export default async function ShortsPage() {
  const user = await getCurrentUser(); // may be null → guest

  const shorts = await prisma.video.findMany({
    where: { contentType: "short" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ShortsFeed
      shorts={shorts}
      isGuest={!user || user.isGuest}
    />
  );
}
