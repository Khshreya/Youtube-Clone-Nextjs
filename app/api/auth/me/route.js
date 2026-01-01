import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return NextResponse.json({
    user: user
      ? { id: user.id, email: user.email }
      : null,
  });
}
