import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/toggle-theme";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { shadesOfPurple, neobrutalism} from '@clerk/themes'

import {
  ClerkProvider,
} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amplify AI",
  description: "Amplify Your Creative Vision with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen dark:bg-[#12141f] bg-gray-100 text-black dark:text-white`}
      >
        <ClerkProvider appearance={{
          baseTheme: shadesOfPurple
        }}>

          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"  // Changed to dark as default since you want the blueish theme
              storageKey="amplify-ai-theme"
              disableTransitionOnChange
            >
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>

      </body>
    </html>
  );
}