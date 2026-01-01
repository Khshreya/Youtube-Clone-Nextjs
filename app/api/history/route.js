import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    //  Clerk session (SOURCE OF TRUTH)
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ success: false });
    }

    //  Resolve Prisma user
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    //  Auto-create Prisma user (CRITICAL)
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

    //  Save history (no duplicates)
    const { videoId } = await req.json();

    await prisma.history.create({
      data: {
        userId: user.id,
        videoId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("History save failed:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
