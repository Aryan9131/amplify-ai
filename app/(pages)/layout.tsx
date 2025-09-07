import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/toggle-theme";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
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
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 overflow-auto">
                <SidebarTrigger />
                <ModeToggle />
                {children}
            </main>
        </SidebarProvider>
    );
}