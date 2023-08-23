import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import { ThemeProvider, ToastProvider } from "../providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clerk Auth",
  description: "Testing to see if abandoning Firebase Auth is worth it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Disable sign up option using Clerk authentication?
    // https://stackoverflow.com/a/76427062
    <ClerkProvider
      appearance={{
        elements: {
          footer: "hidden",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} grid grid-rows-layout min-h-screen`}
        >
          <ThemeProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <ToastProvider />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
