import React from 'react'
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { SignOutButton } from '@clerk/nextjs'

const Setting = () => {
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>
                    <Settings className="h-4 w-4" />
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <SignOutButton/>
                    </MenubarItem>
                    {/* <MenubarItem>New Window</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Share</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Print</MenubarItem> */}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}

export default Setting