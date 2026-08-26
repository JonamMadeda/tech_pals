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
      <body className="relative min-h-screen bg-[#fafaf8] text-[#172033] selection:bg-blue-100 selection:text-blue-900">
        <SpotlightTracker />
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>

  );
}
