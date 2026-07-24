import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SpotlightTracker from "@/components/SpotlightTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "tech_pals — Where Developers Connect & Build",
  description:
    "tech_pals is a community of developers, engineers, and tech enthusiasts sharing knowledge, collaborating on projects, and growing together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="relative min-h-screen bg-[#f8fafc] text-[#0f172a] selection:bg-blue-100 selection:text-blue-900">
        {/* Subtle developer grid overlay for light theme */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#0f172a04_1px,transparent_1px),linear-gradient(to_bottom,#0f172a04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_75%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#0f172a03_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_80%,transparent_100%)]" />
        
        <SpotlightTracker />
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>

  );
}

