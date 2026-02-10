import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated";
}
