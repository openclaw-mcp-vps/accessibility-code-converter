import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { CodeConverter } from "@/components/CodeConverter";
import { AccessClaimForm } from "@/components/AccessClaimForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCESS_COOKIE_NAME, isPaidAccessToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Full Converter",
  description: "Paid conversion workspace for screen-reader optimized code transformation.",
};

const stripePaymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK as string;

export default async function ConvertPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const hasPaidAccess = isPaidAccessToken(token);

  if (!hasPaidAccess) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-12 md:px-10">
        <Link href="/" className="text-sm text-slate-300 underline underline-offset-4 hover:text-white">
          Back to landing page
        </Link>
        <Card className="border-slate-700/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-white">
              <LockKeyhole className="h-6 w-6 text-blue-300" />
              Full converter is behind the paid plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-slate-300">
            <p>
              Buy once through Stripe hosted checkout, then claim access using the same purchase email. This sets a secure cookie so you can use unlimited full conversions.
            </p>
            <Button asChild size="lg">
              <a href={stripePaymentLink} target="_blank" rel="noreferrer">
                Buy Access - $15/mo
              </a>
            </Button>
            <div className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-4">
              <h2 className="mb-2 text-lg font-semibold text-white">Already purchased?</h2>
              <p className="mb-4 text-sm text-slate-400">
                Enter the same email used at checkout to claim access and enable the converter in this browser.
              </p>
              <AccessClaimForm />
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12 md:px-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold text-white">Full Accessibility Converter</h1>
        <p className="text-slate-300">
          Convert full snippets with detailed structure narration, variable rename hints, and speech-optimized syntax output.
        </p>
      </div>
      <Card className="border-slate-700/70 bg-slate-900/60">
        <CardContent className="pt-6">
          <CodeConverter />
        </CardContent>
      </Card>
    </main>
  );
}
