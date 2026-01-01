import { getCurrentUser } from "@/lib/auth";
import SettingsClient from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  // user can be null (logged out)
  return <SettingsClient user={user} />;
}
