"use client"

import Link from "next/link"
import { Home, FileText } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useMobileMenu } from "@/hooks/use-mobile-menu"

export function MobileSidebar() {
  const { open, setOpen } = useMobileMenu()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[270px] bg-gray-200 p-0">
        <nav className="p-4 space-y-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setOpen(false)}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span>Our Blog</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
