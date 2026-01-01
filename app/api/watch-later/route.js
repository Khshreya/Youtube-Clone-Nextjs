export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

/* ---------------- ADD (POST) ---------------- */
export async function POST(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await req.json();

  const email =
    clerkUser.emailAddresses?.[0]?.emailAddress ??
    `${clerkUser.id}@clerk.user`;

  // ✅ SAFE USER RESOLUTION (NO DUPLICATES)
  const user = await prisma.user.upsert({
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

/* ---------------- REMOVE (DELETE) ---------------- */
export async function DELETE(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await req.json();

  const email =
    clerkUser.emailAddresses?.[0]?.emailAddress ??
    `${clerkUser.id}@clerk.user`;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ saved: false });
  }

  await prisma.watchLater.deleteMany({
    where: {
      userId: user.id,
      videoId,
    },
  });

  return NextResponse.json({ saved: false });
}

/* ---------------- STATUS (GET) ---------------- */
export async function GET(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ saved: false });
  }

  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  const email =
    clerkUser.emailAddresses?.[0]?.emailAddress ??
    `${clerkUser.id}@clerk.user`;

  const user = await prisma.user.findUnique({
    where: { email },
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
