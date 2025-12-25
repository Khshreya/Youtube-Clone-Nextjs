import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ saved: false });
  }

  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  const exists = await prisma.watchLater.findUnique({
    where: {
      userId_videoId: {
        userId: user.id,
        videoId,
      },
    },
  });

  return NextResponse.json({ saved: !!exists });
}
