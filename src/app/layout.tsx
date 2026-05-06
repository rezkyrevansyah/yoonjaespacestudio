import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const THEME_COLOR = "hsl(0 68% 32%)";

export const metadata: Metadata = {
  title: "Yoonjaespace Studio",
  description: "Studio photography management system",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Yoonjaespace Studio",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content={THEME_COLOR} />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <NextTopLoader color="hsl(var(--primary))" height={3} showSpinner={false} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
