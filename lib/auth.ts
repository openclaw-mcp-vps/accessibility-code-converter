import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const ACCESS_COOKIE_NAME = "acc_code_paid";
const ACCESS_TOKEN_VERSION = 1;
const ACCESS_EXPIRY_SECONDS = 60 * 60 * 24 * 30;

interface AccessPayload {
  version: number;
  email: string;
  exp: number;
}

function getSigningSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET ?? "local-development-secret-change-me";
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payloadEncoded: string): string {
  return createHmac("sha256", getSigningSecret()).update(payloadEncoded).digest("base64url");
}

export function createAccessToken(email: string): string {
  const payload: AccessPayload = {
    version: ACCESS_TOKEN_VERSION,
    email,
    exp: Math.floor(Date.now() / 1000) + ACCESS_EXPIRY_SECONDS,
  };

  const payloadEncoded = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function isPaidAccessToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) return false;

  const expectedSignature = signPayload(payloadEncoded);

  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const providedBuffer = Buffer.from(signature, "utf8");
  if (expectedBuffer.length !== providedBuffer.length) return false;
  if (!timingSafeEqual(expectedBuffer, providedBuffer)) return false;

  try {
    const payload = JSON.parse(fromBase64Url(payloadEncoded)) as AccessPayload;
    if (payload.version !== ACCESS_TOKEN_VERSION) return false;
    if (!payload.email) return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export function setPaidAccessCookie(response: NextResponse, token: string) {
  response.cookies.set(ACCESS_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ACCESS_EXPIRY_SECONDS,
    path: "/",
  });
}
