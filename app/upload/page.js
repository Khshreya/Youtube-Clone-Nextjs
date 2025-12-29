import { getCurrentUser } from "@/lib/auth";
import LoggedOutMessage from "@/components/LoggedOutMessage";
import UploadClient from "./upload-client";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const user = await getCurrentUser();

  //  Logged out
  if (!user) {
    return <LoggedOutMessage type="upload" />;
  }

  //  Guest
  if (user.isGuest) {
    return <LoggedOutMessage type="upload" isGuest />;
  }

  //  Real user
  return <UploadClient />;
}
