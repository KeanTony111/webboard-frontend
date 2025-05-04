import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MobileMenuProvider } from "@/hooks/use-mobile-menu"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "a Board",
  description: "A community board application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MobileMenuProvider>
          <MobileSidebar />
          {children}
        </MobileMenuProvider>
      </body>
    </html>
  )
}
