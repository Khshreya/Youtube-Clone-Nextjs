import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CURRENT_USER = "Shreya";

export async function POST(req) {
  const { videoId } = await req.json();

  try {
    await prisma.watchLater.create({
      data: {
        user: CURRENT_USER,
        videoId,
      },
    });
  } catch (err) {
    // Ignore duplicate error
  }

  return NextResponse.json({ success: true });
}
