"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/layout/toggle-theme";

export function ConditionalUI() {
 
  const pathname = usePathname();
  const isAuthPath = pathname.includes('/sign-in') || pathname.includes('/sign-up');
  const isLandingPage = pathname=="" || pathname=="/"
  
  if (isAuthPath) {
    return null;
  }

  return (
    <>
      {!isLandingPage && <SidebarTrigger />}
      <ModeToggle />
    </>
  );
}