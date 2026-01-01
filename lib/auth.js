import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const clerkUser = await currentUser();

  //  Not logged in
  if (!clerkUser) {
    return null;
  }

  //  Logged in with Clerk → real user
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  // Create Prisma user if missing
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email:
          clerkUser.emailAddresses?.[0]?.emailAddress ??
          `${clerkUser.id}@clerk.user`,
        name: clerkUser.fullName ?? "User",
        isGuest: false, // VERY IMPORTANT
      },
    });
  }

  // FORCE non-guest
  return {
    ...user,
    isGuest: false,
  };
}
