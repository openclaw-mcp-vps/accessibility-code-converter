import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Ear, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeConverter } from "@/components/CodeConverter";

export const metadata: Metadata = {
  title: "Convert Code For Blind Developers Instantly",
  description:
    "Accessibility Code Converter transforms Python, JavaScript, and Java snippets into screen-reader optimized output with indentation markers and spoken-friendly syntax.",
};

const stripePaymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK as string;

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 py-12 md:px-10">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <Badge className="bg-blue-500/20 text-blue-200">Accessibility-first developer tooling</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Convert code for blind developers instantly.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Paste raw snippets and get structure-aware output with indentation markers, descriptive names, and audio-optimized syntax that works with modern screen readers.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/convert">
                Open Full Converter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <a href={stripePaymentLink} target="_blank" rel="noreferrer">
                Buy Access - $15/mo
              </a>
            </Button>
          </div>
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-300" />
              Python, JavaScript, and Java support
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-300" />
              Paid access controlled by secure cookie
            </div>
          </div>
        </div>
        <Card className="border-slate-700/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100">Try a free preview conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeConverter previewMode />
          </CardContent>
        </Card>
      </section>

      <section id="problem" className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-700/70 bg-slate-900/55 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl text-white">The problem with visual-first code formatting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>
              Blind engineers frequently receive code snippets that rely on visual indentation, color syntax highlighting, and abbreviated variable names. Parsing that through speech can turn a two-minute review into an hour-long manual rewrite.
            </p>
            <p>
              Teams lose velocity when accessible formatting is handled ad hoc. Accessibility consultants and inclusive product teams need a repeatable way to share code that is understandable without sight.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-700/70 bg-slate-900/55">
          <CardHeader>
            <CardTitle className="text-xl text-white">Who pays</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>Blind and low-vision software engineers</p>
            <p>Accessibility consultants auditing codebases</p>
            <p>Development teams sharing code inclusively</p>
          </CardContent>
        </Card>
      </section>

      <section id="solution" className="space-y-6">
        <h2 className="text-3xl font-semibold text-white">Built for accessibility workflows, not visual IDE workflows</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="border-slate-700/70 bg-slate-900/55">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Ear className="h-5 w-5 text-blue-300" />
                Spoken structure markers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Every line is rewritten with explicit indentation levels and punctuation cues to reduce ambiguity in screen-reader playback.
            </CardContent>
          </Card>
          <Card className="border-slate-700/70 bg-slate-900/55">
            <CardHeader>
              <CardTitle className="text-slate-100">Descriptive variable upgrades</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Short variable names are mapped to clearer alternatives, making logic understandable without needing visual context from nearby lines.
            </CardContent>
          </Card>
          <Card className="border-slate-700/70 bg-slate-900/55">
            <CardHeader>
              <CardTitle className="text-slate-100">One-click language support</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Switch between Python, JavaScript, and Java parsing rules while preserving flow-control semantics and code intent.
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="pricing" className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-slate-700/70 bg-slate-900/55">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Simple pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p className="text-4xl font-semibold text-white">$15<span className="text-base text-slate-400"> / month</span></p>
            <p>
              Unlimited full conversions, webhook-backed purchase verification, and cookie-based access to the complete converter tool.
            </p>
            <Button asChild size="lg">
              <a href={stripePaymentLink} target="_blank" rel="noreferrer">
                Buy With Stripe Hosted Checkout
              </a>
            </Button>
            <p className="text-sm text-slate-400">
              After checkout, return here and claim access with the purchase email to activate your converter cookie.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-700/70 bg-slate-900/55">
          <CardHeader>
            <CardTitle className="text-xl text-white">FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            <div>
              <h3 className="font-medium text-slate-100">Does the free version work?</h3>
              <p>The landing-page demo converts the first part of your snippet so you can evaluate output quality before buying.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-100">How is access controlled?</h3>
              <p>Purchases are verified through webhook events, then unlocked using a signed cookie tied to your claimed email.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-100">Can teams use it?</h3>
              <p>Yes. Teams can standardize code-sharing workflows by having each engineer claim paid access with their own purchase record.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
