import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await req.json();

  await prisma.watchLater.upsert({
    where: {
      userId_videoId: {
        userId: user.id,
        videoId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      videoId,
    },
  });

  return NextResponse.json({ saved: true });
}
