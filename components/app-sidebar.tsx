'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, HelpCircle } from "lucide-react"

import {
  Calendar,
  Inbox,
  Search,
  Settings,
  Home,
  Sparkles,
  FolderOpen,
  CreditCard,
  User,
  ChevronRight,
  LogOut
} from "lucide-react";

import Image from "next/image"
import logo from '@/assets/creative-guru-logo.png'
import { usePathname } from "next/navigation";
import { ModeToggle } from "./toggle-theme";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

// Menu items.
const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Creative Tools",
    icon: Sparkles,
    isExpandable: true,
    subItems: [
      { title: "Product Studio", url: "/product-studio" },
      { title: "YouTube Creator", url: "#", disabled: true },
      { title: "Story Generator", url: "#", disabled: true },
      { title: "Smart Editor", url: "#", disabled: true },
    ]
  },
  {
    title: "My Assets",
    url: "/assets",
    icon: FolderOpen,
  },
  {
    title: "Upgrade",
    url: "/upgrade",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const url = usePathname();
  console.log("Current URL:", url);
  return (
    <Sidebar >
      <SidebarHeader className="flex justify-between items-center p-4">
        <Image src={logo} alt="Logo" width={32} height={32} />
        <div>
          <h2 className="text-lg font-semibold">AMPLIFY-AI</h2>
          <p className="text-sm text-muted-foreground">AI Content Studio</p>
        </div>
      </SidebarHeader>
      <SidebarContent >
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.isExpandable ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                          <div className="flex items-center gap-2 text-md font-medium">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>
                      <CollapsibleContent>
                        <SidebarGroupContent className="pl-6">
                          <SidebarMenu>
                            {item.subItems?.map((subItem) => (
                              <SidebarMenuItem key={subItem.title} >
                                <SidebarMenuButton asChild disabled={subItem.disabled} className={subItem.disabled ? "text-gray-500 cursor-not-allowed font-semibold gap-4" : "font-semibold hover:text-sidebar-accent-foreground rounded-md"}>
                                  <a href={subItem.disabled ? "#" : subItem.url}>
                                    <span>{subItem.title}</span>
                                    {subItem.disabled && (
                                      <span className="text-xs bg-[#F66E28]/20 text-[#F66E28] border border-[#F66E28]/30 opacity-60 italic px-3 py-1 rounded-sm">
                                        Soon
                                      </span>
                                    )}
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild className={url === item.url ? "text-blue-600 hover:text-blue-700 bg-blue-50 dark:text-blue-800 dark:bg-sidebar-accent rounded-md font-semibold" : "font-medium hover:text-sidebar-accent-foreground rounded-md"}>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto border-t pt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {/* User Profile Row */}
              <SignedIn>
                <SidebarMenuItem>
                  <div className="flex items-center justify-between w-full px-2 py-2 rounded-md hover:bg-sidebar-accent">
                    {/* Avatar and User Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <UserButton />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">John Doe</p>
                        <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                      </div>
                    </div>
                    {/* Settings Icon */}
                    <SidebarMenuButton asChild size="sm" variant="outline" className="h-8 w-8 p-0">
                      <a href="/settings">
                        <Settings className="h-4 w-4" />
                      </a>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              </SignedIn>

              {/* Sign Out Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="w-full flex items-center justify-center font-medium">
                  <SignedOut>
                    <SignInButton >
                      <Button className="bg-[#6c47ff] hover:bg-[#6c55ff] text-white rounded-lg font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        <LogOut/> Sign In
                      </Button>
                    </SignInButton>
                  </SignedOut>

                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}