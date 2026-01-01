import LoggedOutMessage from "@/components/LoggedOutMessage";
import UploadClient from "./upload-client";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  //  Clerk auth (single source of truth)
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return <LoggedOutMessage type="upload" />;
  }

  //  Resolve / create Prisma user
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email:
          clerkUser.emailAddresses?.[0]?.emailAddress ??
          `${clerkUser.id}@clerk.user`,
        name: clerkUser.fullName ?? "User",
      },
    });
  }

  //  Logged-in real user
  return <UploadClient />;
}
