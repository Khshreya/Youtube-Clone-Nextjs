import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      videoUrl,
      thumbnail,
      contentType,
      duration,
      channelName,
      editMetadata,
    } = body;

    if (!title || !videoUrl || !thumbnail || !channelName) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        videoUrl,
        thumbnail,
        duration: duration || "0:00",
        contentType,
        channel: channelName, // ✅ THIS IS YOUR OWNER
        editMetadata,
      },
    });

    console.log("✅ Video saved:", video.id);

    return NextResponse.json({ success: true, videoId: video.id });
  } catch (err) {
    console.error("🔥 Video save failed:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
