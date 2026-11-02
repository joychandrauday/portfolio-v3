import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "joy-chandra-uday-ops-jwt-master-key-secure-2025"
);

export const DEFAULT_OPS_PASSWORD = process.env.OPS_ADMIN_PASSWORD || "joyuday2025";
const COOKIE_NAME = "ops_session";

export interface SessionPayload {
  role: "admin";
  issuedAt: number;
}

export async function createOpsSession(): Promise<string> {
  const token = await new SignJWT({ role: "admin", issuedAt: Date.now() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function clearOpsSession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyOpsSession(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;

    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.role === "admin";
  } catch {
    return false;
  }
}
