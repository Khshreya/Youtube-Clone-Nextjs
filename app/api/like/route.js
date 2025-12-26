import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET → fetch reaction + like count
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  const user = await getCurrentUser();

  // Get current user's reaction (if logged in)
  let reaction = null;
  if (user) {
    const existing = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId,
        },
      },
    });
    reaction = existing?.value ?? null;
  }

  // Count total likes
  const likeCount = await prisma.like.count({
    where: {
      videoId,
      value: 1,
    },
  });

  return NextResponse.json({ reaction, likeCount });
}

// POST → add / update / remove reaction
export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (user.isGuest) {
    return NextResponse.json({ error: "Guests cannot like videos" }, { status: 403 });
  }

  const { videoId, value } = await req.json();

  // If value is null → remove reaction
  if (value === null) {
    await prisma.like.deleteMany({
      where: { userId: user.id, videoId },
    });

    return NextResponse.json({ success: true });
  }

  // Upsert like / dislike
  await prisma.like.upsert({
    where: {
      userId_videoId: {
        userId: user.id,
        videoId,
      },
    },
    update: { value },
    create: {
      userId: user.id,
      videoId,
      value,
    },
  });

  return NextResponse.json({ success: true });
}
