"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface MobileMenuContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined)

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return <MobileMenuContext.Provider value={{ open, setOpen }}>{children}</MobileMenuContext.Provider>
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext)
  if (context === undefined) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider")
  }
  return context
}
