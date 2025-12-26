import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// CHECK SUBSCRIBE STATUS
export async function GET(req) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ subscribed: false });

  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");

  const exists = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      channel,
    },
  });

  return NextResponse.json({ subscribed: !!exists });
}

// SUBSCRIBE
export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.isGuest) {
    return NextResponse.json({ error: "Guests cannot subscribe" }, { status: 403 });
  }

  const { channel } = await req.json();

  if (!channel) {
    return NextResponse.json({ error: "Channel missing" }, { status: 400 });
  }

  try {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        channel,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    // Handle duplicate subscription (unique constraint)
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }
    console.error("Subscribe failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UNSUBSCRIBE
export async function DELETE(req) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (user.isGuest) {
    return NextResponse.json({ error: "Guests cannot unsubscribe" }, { status: 403 });
  }

  const { channel } = await req.json();

  if (!channel) {
    return NextResponse.json(
      { error: "Channel missing" },
      { status: 400 }
    );
  }

  await prisma.subscription.deleteMany({
    where: {
      userId: user.id,
      channel,
    },
  });

  return NextResponse.json({ success: true });
}
