import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAccessToken, setPaidAccessCookie } from "@/lib/auth";
import { hasRecordedPurchase } from "@/lib/lemonsqueezy";

const claimSchema = z.object({
  email: z.string().email("Enter a valid purchase email."),
});

export async function POST(request: NextRequest) {
  try {
    const payload = claimSchema.parse(await request.json());
    const normalizedEmail = payload.email.toLowerCase();
    const hasPurchase = await hasRecordedPurchase(normalizedEmail);

    if (!hasPurchase) {
      return NextResponse.json(
        {
          error: "No completed purchase was found for that email yet. If you just checked out, wait a minute and try again.",
        },
        { status: 404 },
      );
    }

    const token = createAccessToken(normalizedEmail);
    const response = NextResponse.json({ success: true });
    setPaidAccessCookie(response, token);

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid email" }, { status: 400 });
    }

    return NextResponse.json({ error: "Access claim failed" }, { status: 500 });
  }
}
