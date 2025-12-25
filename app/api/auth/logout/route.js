import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    await prisma.session.deleteMany({
      where: { id: sessionId },
    });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("session_id", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
