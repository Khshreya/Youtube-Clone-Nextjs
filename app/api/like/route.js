export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// GET → fetch reaction + like count
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  const clerkUser = await currentUser();

  let reaction = null;

  if (clerkUser) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (dbUser) {
      const existing = await prisma.like.findUnique({
        where: {
          userId_videoId: {
            userId: dbUser.id,
            videoId,
          },
        },
      });
      reaction = existing?.value ?? null;
    }
  }

  const likeCount = await prisma.like.count({
    where: { videoId, value: 1 },
  });

  return NextResponse.json({ reaction, likeCount });
}

// POST → persist ONLY for logged-in users
export async function POST(req) {
  const clerkUser = await currentUser();
  const { videoId, value } = await req.json();

  
  if (!clerkUser) {
    return NextResponse.json({ success: true });
  }

  // Ensure Prisma user exists
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email:
          clerkUser.emailAddresses?.[0]?.emailAddress ??
          `${clerkUser.id}@clerk.user`,
        name: clerkUser.fullName ?? "User",
      },
    });
  }

  // Remove reaction
  if (value === null) {
    await prisma.like.deleteMany({
      where: { userId: dbUser.id, videoId },
    });
    return NextResponse.json({ success: true });
  }

  // Persist like / dislike
  await prisma.like.upsert({
    where: {
      userId_videoId: {
        userId: dbUser.id,
        videoId,
      },
    },
    update: { value },
    create: {
      userId: dbUser.id,
      videoId,
      value,
    },
  });

  return NextResponse.json({ success: true });
}
