import { getCurrentUser } from "@/lib/auth";
import SettingsClient from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();


  // Pass user (can be null)
  return <SettingsClient user={user} />;
}
