import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CURRENT_USER = "Shreya";

export async function POST(req) {
  const { channel } = await req.json();

  await prisma.subscription.create({
    data: {
      user: CURRENT_USER,
      channel,
    },
  });

  return NextResponse.json({ success: true });
}
