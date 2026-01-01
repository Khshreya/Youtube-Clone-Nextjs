import LoggedOutMessage from "@/components/LoggedOutMessage";
import UploadClient from "./upload-client";
import { currentUser } from "@clerk/nextjs/server";

export default async function UploadPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return <LoggedOutMessage type="upload" />;
  }

  return <UploadClient />;
}
