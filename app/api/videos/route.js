import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  const user = await getCurrentUser();

  if (!user || user.isGuest) {
    return NextResponse.json(
      { error: "Login required" },
      { status: 401 }
    );
  }

  const { title, videoUrl, thumbnail, contentType } = await req.json();

  if (!title || !videoUrl || !thumbnail) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  await prisma.video.create({
    data: {
      title,
      videoUrl,
      thumbnail,
      duration: "0:00",
      channel: user.name,
      contentType,
    },
  });

  return NextResponse.json({ success: true });
}
