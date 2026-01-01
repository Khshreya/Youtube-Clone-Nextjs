import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });


  return user;
}
