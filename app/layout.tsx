import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ModeToggle } from "@/components/layout/toggle-theme";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { shadesOfPurple, neobrutalism } from '@clerk/themes'

// Import the new Providers component
import { Providers } from "./Providers";

import {
  ClerkProvider,
} from '@clerk/nextjs'
import { ConditionalUI } from "@/components/layout/conditional-ui";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

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

  console.log("Client id : ", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    intent: "capture",
    components: "buttons",
    "data-csp-nonce": undefined,
    "data-user-id-token": undefined,
    vault: false
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen dark:bg-[#12141f] bg-gray-100 text-black dark:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="amplify-ai-theme"
          disableTransitionOnChange
        >
        <ClerkProvider appearance={{ baseTheme: shadesOfPurple }}>
          <ConvexClientProvider>
            <SidebarProvider>
              <AppSidebar />
              <ConditionalUI />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </SidebarProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </ThemeProvider>

    </body>
    </html >
  );
}