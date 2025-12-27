import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

//  OPTIONS handler for Vercel preflight
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

//  POST handler
export async function POST(req) {
  try {
    //  LOG REQUEST HEADERS (IMPORTANT FOR 413)
    const contentLength = req.headers.get("content-length");
    console.log(" Content-Length:", contentLength);

    const user = await getCurrentUser();
    console.log(" User:", user?.id, "Guest:", user?.isGuest);

    if (!user || user.isGuest) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    //  PARSE BODY
    const body = await req.json();
    console.log("🧾 Body keys:", Object.keys(body));

   const { title, videoUrl, thumbnail, contentType, editMetadata } = body;


    // 🔍 LOG VALUES (safe ones only)
    console.log(" title:", title);
    console.log(" videoUrl length:", videoUrl?.length);
    console.log(" thumbnail length:", thumbnail?.length);
    console.log(" contentType:", contentType);

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
        editMetadata,
      },
    });

    console.log("Video saved to DB");

    return NextResponse.json({ success: true });
  } catch (err) {
    // VERY IMPORTANT: LOG FULL ERROR
    console.error(" POST /api/videos FAILED");
    console.error(err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
