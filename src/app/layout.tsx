import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A&B Tournaments",
  description: "A&B Tournaments is a competition discovery and registration platform.",
  icons: {
    icon: "/images/spidericon.png",
  }
};

import ProgressBarProvider from "@/components/ProgressBarProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${pressStart2P.variable} antialiased`}
    >
      <body className="min-h-screen font-sans flex flex-col text-navy">
        <ProgressBarProvider />
        {children}
      </body>
    </html>
  );
}
