import { createHmac, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

const dataDirectory = path.join(process.cwd(), "data");
const purchasesFile = path.join(dataDirectory, "paid-customers.json");

export interface PaidPurchaseRecord {
  email: string;
  eventId: string;
  purchasedAt: string;
  source: "stripe" | "manual";
}

function parseSignatureHeader(signatureHeader: string | null): { timestamp: string; signature: string } | null {
  if (!signatureHeader) return null;

  const items = signatureHeader.split(",");
  const timestamp = items.find((item) => item.startsWith("t="))?.slice(2);
  const signature = items.find((item) => item.startsWith("v1="))?.slice(3);

  if (!timestamp || !signature) return null;
  return { timestamp, signature };
}

export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  webhookSecret: string | undefined,
): boolean {
  if (!webhookSecret) return false;

  const signatureParts = parseSignatureHeader(signatureHeader);
  if (!signatureParts) return false;

  const signedPayload = `${signatureParts.timestamp}.${rawBody}`;
  const expected = createHmac("sha256", webhookSecret).update(signedPayload).digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signatureParts.signature, "utf8");

  if (expectedBuffer.length !== signatureBuffer.length) return false;

  const timestampAgeMs = Math.abs(Date.now() - Number(signatureParts.timestamp) * 1000);
  if (Number.isNaN(timestampAgeMs) || timestampAgeMs > 5 * 60 * 1000) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

async function readPurchaseRecords(): Promise<PaidPurchaseRecord[]> {
  try {
    const content = await readFile(purchasesFile, "utf8");
    const parsed = JSON.parse(content) as PaidPurchaseRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writePurchaseRecords(records: PaidPurchaseRecord[]): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(purchasesFile, JSON.stringify(records, null, 2), "utf8");
}

export async function recordPaidPurchase(record: PaidPurchaseRecord): Promise<void> {
  const records = await readPurchaseRecords();
  const duplicate = records.some(
    (item) => item.eventId === record.eventId || item.email.toLowerCase() === record.email.toLowerCase(),
  );

  if (duplicate) return;

  records.push({
    ...record,
    email: record.email.toLowerCase(),
  });

  await writePurchaseRecords(records);
}

export async function hasRecordedPurchase(email: string): Promise<boolean> {
  const records = await readPurchaseRecords();
  return records.some((item) => item.email.toLowerCase() === email.toLowerCase());
}

export function initializeLemonSqueezySdk() {
  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY,
    onError: () => undefined,
  });
}
