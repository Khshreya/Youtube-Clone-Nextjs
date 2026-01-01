import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SyncUserPage() {
  const { userId } = auth();
  if (!userId) redirect("/");


  redirect("/");
}