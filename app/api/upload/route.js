import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const formData = await req.formData();

  const title = formData.get("title");
  const videoFile = formData.get("video");
  const thumbnailFile = formData.get("thumbnail");
  const contentType = formData.get("contentType");

  /* ---------- Upload thumbnail ---------- */
  const thumbBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
  const thumbUpload = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "thumbnails" },
      (err, result) => (err ? reject(err) : resolve(result))
    ).end(thumbBuffer);
  });

  /* ---------- Upload video ---------- */
  const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
  const videoUpload = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: contentType === "short" ? "shorts" : "videos",
      },
      (err, result) => (err ? reject(err) : resolve(result))
    ).end(videoBuffer);
  });

  /* ---------- SAVE TO DATABASE (FIXED) ---------- */
  const video = await prisma.video.create({
    data: {
      title,
      videoUrl: videoUpload.secure_url,   // ✅ Cloudinary URL
      thumbnail: thumbUpload.secure_url,   // ✅ Cloudinary URL
      duration: "0:00",
      channel: user.name ?? "Unknown",
      contentType,
    },
  });

  console.log("Video saved:", video.id);

  return NextResponse.json({ success: true });
}
