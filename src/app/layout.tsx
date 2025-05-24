import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientAuthWrapper from "@/components/auth-wrapper";
import Layout from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SeToRan",
};

const PUBLIC_ROUTES = ['/signup', '/login', '/signin']

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientAuthWrapper>
          <Layout noLayout={PUBLIC_ROUTES}>
            {children}
          </Layout>
        </ClientAuthWrapper>
      </body>
    </html>
  );
}
