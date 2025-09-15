'use client'

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ConditionalUI } from "@/components/layout/conditional-ui";
import { ClerkProvider } from '@clerk/nextjs'
import { shadesOfPurple } from '@clerk/themes'
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
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
        <PayPalScriptProvider options={paypalOptions}>
            {children}
        </PayPalScriptProvider>
    );
}