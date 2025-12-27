import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  // Update all videos channel name
  await prisma.video.updateMany({
    where: { channel: user.name },
    data: { channel: name },
  });

  return NextResponse.json({ success: true });
}
