import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccessCode — Convert Code for Blind Developers",
  description: "Real-time code conversion with verbose comments, screen reader friendly syntax, and audio descriptions for blind and visually impaired developers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-[#c9d1d9] min-h-screen">{children}</body>
    </html>
  );
}
