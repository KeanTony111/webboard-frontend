"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Input } from "@/app/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export function SearchBar({ value, onChange, className = "" }: SearchBarProps) {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input type="search" placeholder="Search" className="pl-10 bg-white" value={value} onChange={onChange} />
    </div>
  )
}
