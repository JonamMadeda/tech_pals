import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth overflow-x-hidden`}>
      <body className="relative min-h-screen w-full overflow-x-hidden bg-[#fafaf8] text-[#172033] selection:bg-blue-100 selection:text-blue-900">
        <div className="relative z-10 flex min-h-screen w-full max-w-full flex-col overflow-x-hidden">
          <SpotlightTracker />
          {children}
        </div>
      </body>
    </html>

  );
}
