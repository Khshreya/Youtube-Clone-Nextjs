import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST() {
  try {
    const uid = randomUUID();
    const password = uid + Math.random().toString(36).slice(2, 8); // random fallback
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: `Guest-${uid.slice(0, 8)}`,
        email: `guest-${uid}@local`,
        password: hashed,
        isGuest: true,
      },
    });

    const session = await prisma.session.create({
      data: { userId: user.id },
    });

    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name } });

    response.cookies.set("session_id", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Guest login error:", error);
    // Return dev-only error details to aid debugging (do not reveal in production)
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ error: "Something went wrong", details: String(error) }, { status: 500 });
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}