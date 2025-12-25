import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ subscribed: false });
  }

  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");

  if (!channel) {
    return NextResponse.json({ subscribed: false });
  }

  const existing = await prisma.subscription.findUnique({
    where: {
      userId_channel: {
        userId: user.id,
        channel,
      },
    },
  });

  return NextResponse.json({
    subscribed: Boolean(existing),
  });
}
