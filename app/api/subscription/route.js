export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// SUBSCRIBE
export async function POST(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { channel } = await req.json();
  if (!channel) {
    return NextResponse.json({ error: "Channel missing" }, { status: 400 });
  }

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

  await prisma.subscription.upsert({
    where: {
      userId_channel: {
        userId: user.id,
        channel,
      },
    },
    update: {},
    create: {
      userId: user.id,
      channel,
    },
  });

  return NextResponse.json({ success: true });
}

// UNSUBSCRIBE
export async function DELETE(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { channel } = await req.json();

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    return NextResponse.json({ success: false });
  }

  await prisma.subscription.deleteMany({
    where: {
      userId: user.id,
      channel,
    },
  });

  return NextResponse.json({ success: true });
}
