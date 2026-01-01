import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0].emailAddress,
      name: clerkUser.fullName || "",
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: clerkUser.fullName || "",
    },
  });

  return NextResponse.json({ ok: true });
}
