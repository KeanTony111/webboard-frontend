"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { useMobileMenu } from "@/app/hooks/use-mobile-menu"

interface TopBarProps {
  showMenuButton?: boolean
}

export function TopBar({ showMenuButton = true }: TopBarProps) {
  const { setOpen } = useMobileMenu()

  return (
    <header className="bg-[#1e3330] text-white h-16 flex items-center justify-between px-4">
      <Link href="/" className="text-xl italic font-medium">
        a Board
      </Link>

      <div className="flex items-center gap-2">
        {/* User profile on desktop */}
        <div className="hidden md:flex items-center gap-2">
          <span>Jassica</span>
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full border-2 border-white"
          />
        </div>

        {/* Show menu button on mobile */}
        {showMenuButton && (
          <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
      </div>
    </header>
  )
}
