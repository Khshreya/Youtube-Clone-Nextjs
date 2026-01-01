export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ subscribed: false });
  }

  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user || !channel) {
    return NextResponse.json({ subscribed: false });
  }

  const exists = await prisma.subscription.findUnique({
    where: {
      userId_channel: {
        userId: user.id,
        channel,
      },
    },
  });

  return NextResponse.json({ subscribed: !!exists });
}
