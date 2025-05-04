"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center mt-8 gap-2">
      <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        // Show pages around current page
        let pageNum = i + 1
        if (totalPages > 5) {
          if (currentPage > 3) {
            pageNum = currentPage - 3 + i
          }
          if (currentPage > totalPages - 2) {
            pageNum = totalPages - 5 + i + 1
          }
        }

        return (
          <Button
            key={i}
            variant={currentPage === pageNum ? "default" : "outline"}
            className={cn(currentPage === pageNum ? "bg-[#4CAF82] hover:bg-[#3d8c68]" : "")}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export const PaginationContent = () => null
export const PaginationItem = () => null
export const PaginationLink = () => null
export const PaginationEllipsis = () => null
export const PaginationPrevious = () => null
export const PaginationNext = () => null
