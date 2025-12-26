import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req) {
  const user = await getCurrentUser();

  if (!user || user.isGuest) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") || "videos";

  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );

  return NextResponse.json({
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
