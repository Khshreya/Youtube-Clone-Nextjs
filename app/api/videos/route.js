import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// OPTIONS handler (Vercel preflight)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        Allow: "POST, OPTIONS",
      },
    }
  );
}

// POST handler
export async function POST(req) {
  try {
    const user = await getCurrentUser();

    if (!user || user.isGuest) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      title,
      videoUrl,
      thumbnail,
      contentType,
      duration,
      editMetadata,
    } = body;

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
        duration: duration || "0:00",
        channel: user.name,
        contentType,
        editMetadata,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/videos failed", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
