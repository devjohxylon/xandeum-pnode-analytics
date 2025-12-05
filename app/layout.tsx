import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xandeum pNode Analytics | Network Performance Dashboard",
  description: "Real-time analytics and monitoring platform for Xandeum storage nodes. Compare performance, track metrics, and make informed delegation decisions.",
  keywords: ["Xandeum", "pNode", "analytics", "blockchain", "storage", "delegation"],
  authors: [{ name: "Xandeum Analytics" }],
  openGraph: {
    title: "Xandeum pNode Analytics",
    description: "Comprehensive analytics platform for Xandeum pNodes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

