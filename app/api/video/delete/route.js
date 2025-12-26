import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(req) {
  const user = await getCurrentUser();
  if (!user || user.role === "guest") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID required" },
      { status: 400 }
    );
  }

  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video || video.channel !== user.name) {
    return NextResponse.json(
      { error: "Not allowed" },
      { status: 403 }
    );
  }

  await prisma.video.delete({
    where: { id: videoId },
  });

  return NextResponse.json({ success: true });
}
