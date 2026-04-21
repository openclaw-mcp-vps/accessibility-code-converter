import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { convertCodeToAccessibleFormat } from "@/lib/accessibilityFormatter";
import { isPaidAccessToken, ACCESS_COOKIE_NAME } from "@/lib/auth";

const convertSchema = z.object({
  code: z.string().min(1, "Paste code to convert").max(20000, "Code snippet is too large"),
  language: z.enum(["python", "javascript", "java"]),
  preview: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const payload = convertSchema.parse(await request.json());
    const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
    const hasPaidAccess = isPaidAccessToken(token);

    if (!hasPaidAccess && !payload.preview) {
      return NextResponse.json(
        {
          error: "Full conversion requires paid access. Complete checkout and claim your cookie first.",
        },
        { status: 402 },
      );
    }

    const result = convertCodeToAccessibleFormat(payload.code, payload.language);

    if (payload.preview && !hasPaidAccess) {
      const previewLines = result.formattedCode.split("\n");
      const truncated = previewLines.length > 12;
      return NextResponse.json({
        ...result,
        formattedCode: previewLines.slice(0, 12).join("\n"),
        previewTruncated: truncated,
      });
    }

    return NextResponse.json({
      ...result,
      previewTruncated: false,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ error: "Conversion failed. Please try again." }, { status: 500 });
  }
}
