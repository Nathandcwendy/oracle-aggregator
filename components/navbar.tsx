"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "./darkmode-toggle"


export function NavBar() {
  return (
    <NavigationMenu className="py-2 px-4 flex justify-between min-w-full text-white bg-gray-900 sticky top-0">
      <NavigationMenuList>
        <NavigationMenuItem className="rounded-lglg hover:bg-gray-500 hover:bg-opacity-50  dark:hover:bg-gray-800">
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <ModeToggle />
    </NavigationMenu>
  )
}

