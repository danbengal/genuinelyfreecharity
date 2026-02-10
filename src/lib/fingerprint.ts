import crypto from "crypto";

const SALT = process.env.SALT_SECRET || "default-salt";

export function hashFingerprint(raw: string): string {
  return crypto.createHmac("sha256", SALT).update(raw).digest("hex");
}

export function buildFingerprint(cookieUuid: string | undefined, ip: string, ua: string): string {
  if (cookieUuid) {
    return hashFingerprint(cookieUuid);
  }
  return hashFingerprint(`${ip}|${ua}`);
}
