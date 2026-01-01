export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// ADD
export async function POST(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await req.json();

  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email:
          clerkUser.emailAddresses?.[0]?.emailAddress ??
          `${clerkUser.id}@clerk.user`,
        name: clerkUser.fullName ?? "User",
      },
    });
  }

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

// REMOVE
export async function DELETE(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    return NextResponse.json({ saved: false });
  }

  await prisma.watchLater.deleteMany({
    where: { userId: user.id, videoId },
  });

  return NextResponse.json({ saved: false });
}
