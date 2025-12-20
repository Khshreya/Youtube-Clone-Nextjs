import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CURRENT_USER = "Shreya";

export async function POST(req) {
  const { videoId } = await req.json();

  // 🔥 1. Remove old history entry (if exists)
  await prisma.history.deleteMany({
    where: {
      user: CURRENT_USER,
      videoId,
    },
  });

  // 🔥 2. Insert fresh entry (moves to top)
  await prisma.history.create({
    data: {
      user: CURRENT_USER,
      videoId,
      watchedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
