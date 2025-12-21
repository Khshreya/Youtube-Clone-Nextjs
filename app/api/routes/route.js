import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CURRENT_USER = "Shreya";

export async function POST(req) {
  const { videoId } = await req.json();

  await prisma.history.upsert({
    where: {
      user_videoId: {
        user: CURRENT_USER,
        videoId,
      },
    },
    update: {
      watchedAt: new Date(), 
    },
    create: {
      user: CURRENT_USER,
      videoId,
    },
  });

  return NextResponse.json({ success: true });
}
