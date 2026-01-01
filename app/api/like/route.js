import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

/* ---------------- GET: reaction + like count ---------------- */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  const clerkUser = await currentUser();
  let reaction = null;

  if (clerkUser) {
    const email = clerkUser.emailAddresses?.[0]?.emailAddress;

    if (email) {
      const dbUser = await prisma.user.findUnique({
        where: { email },
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
  }

  const likeCount = await prisma.like.count({
    where: { videoId, value: 1 },
  });

  return NextResponse.json({ reaction, likeCount });
}

/* ---------------- POST: like / dislike ---------------- */
export async function POST(req) {
  const clerkUser = await currentUser();
  const { videoId, value } = await req.json();

  // Guest → ignore silently
  if (!clerkUser) {
    return NextResponse.json({ success: true });
  }

  const email =
    clerkUser.emailAddresses?.[0]?.emailAddress ??
    `${clerkUser.id}@clerk.user`;

  // ✅ SAFE USER RESOLUTION (NO DUPLICATES)
  const dbUser = await prisma.user.upsert({
    where: { email },
    update: {
      clerkId: clerkUser.id,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      name: clerkUser.fullName ?? "User",
    },
  });

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
