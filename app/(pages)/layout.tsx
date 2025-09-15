import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ModeToggle } from "@/components/layout/toggle-theme";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { shadesOfPurple, neobrutalism } from '@clerk/themes'

// Import the new Providers component
import { Providers } from "@/app/Providers";

import {
    ClerkProvider,
} from '@clerk/nextjs'
import { ConditionalUI } from "@/components/layout/conditional-ui";

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
        <Providers>
            {children}
        </Providers>
    );
}