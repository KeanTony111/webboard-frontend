"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobileMenu } from "@/hooks/use-mobile-menu"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

interface TopBarProps {
  showMenuButton?: boolean
}

export function TopBar({ showMenuButton = true }: TopBarProps) {
  const { setOpen } = useMobileMenu()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    // Check for username cookie on component mount and cookie changes
    const checkCookie = () => {
      const usernameFromCookie = Cookies.get('username')
      setUsername(usernameFromCookie || null)
    }

    checkCookie()
    // Set up an interval to check for cookie changes
    const interval = setInterval(checkCookie, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-[#1e3330] text-white h-16 flex items-center justify-between px-4">
      <Link href="/" className="text-xl italic font-medium">
        a Board
      </Link>

      <div className="flex items-center gap-2">
        {username ? (
          // Show user profile if logged in
          <div className="hidden md:flex items-center gap-2">
            <span>{username}</span>
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="User avatar"
              width={40}
              height={40}
              className="rounded-full border-2 border-white"
            />
          </div>
        ) : (
          // Show sign in button if not logged in
          <Link href="/sign-in" className="hidden md:block">
            <Button 
              className="bg-[#49A569] hover:bg-[#49A569]/90 text-white"
            >
              Sign In
            </Button>
          </Link>
        )}

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
