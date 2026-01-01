export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ saved: false });
  }

  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    return NextResponse.json({ saved: false });
  }

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
