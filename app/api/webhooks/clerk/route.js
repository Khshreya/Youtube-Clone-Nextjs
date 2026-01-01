import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const payload = await req.text();
  const headerPayload = headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let event;
  try {
    event = wh.verify(payload, {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    });
  } catch (err) {
    console.error("Webhook verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created") {
    await prisma.user.upsert({
      where: { clerkId: event.data.id },
      update: {},
      create: {
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
        name: event.data.first_name ?? "User",
      },
    });
  }

  return new Response("OK");
}
