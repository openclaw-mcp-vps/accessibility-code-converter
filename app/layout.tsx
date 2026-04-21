import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Accessibility Code Converter",
    template: "%s | Accessibility Code Converter",
  },
  description:
    "Convert code snippets into screen-reader friendly formats with indentation markers, descriptive variable names, and audio-optimized syntax.",
  keywords: [
    "accessible coding",
    "screen reader",
    "blind developers",
    "code converter",
    "inclusive engineering",
  ],
  openGraph: {
    title: "Accessibility Code Converter",
    description:
      "Convert code for blind developers instantly with structure-aware formatting and spoken-friendly syntax.",
    type: "website",
    url: "/",
    siteName: "Accessibility Code Converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Code Converter",
    description:
      "Structure-aware code conversion for screen readers and accessibility-focused engineering teams.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} bg-[var(--background)] text-[var(--text)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
