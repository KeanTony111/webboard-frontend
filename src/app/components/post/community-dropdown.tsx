"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { cn } from "@/app/lib/utils"

export interface Community {
  value: string
  label: string
}

interface CommunityDropdownProps {
  communities: Community[]
  selectedCommunity: string | null
  onSelect: (community: string | null) => void
  className?: string
  buttonText?: string
}

export function CommunityDropdown({
  communities,
  selectedCommunity,
  onSelect,
  className = "",
  buttonText = "Community",
}: CommunityDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-1 bg-white border-[#4CAF82] text-[#4CAF82] ${className}`}
        >
          {selectedCommunity ? communities.find((c) => c.value === selectedCommunity.toLowerCase())?.label : buttonText}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <div className="max-h-[300px] overflow-auto">
          <div
            className={cn(
              "relative flex cursor-pointer select-none items-center rounded-sm px-4 py-2.5 text-sm outline-none hover:bg-gray-100",
              !selectedCommunity ? "bg-[#E8F5E9] text-black" : "text-gray-700",
            )}
            onClick={() => onSelect(null)}
          >
            All Communities
            {!selectedCommunity && <Check className="ml-auto h-4 w-4 text-[#4CAF82]" />}
          </div>
          {communities.map((community) => (
            <div
              key={community.value}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-4 py-2.5 text-sm outline-none hover:bg-gray-100",
                selectedCommunity === community.value ? "bg-[#E8F5E9] text-black" : "text-gray-700",
              )}
              onClick={() => onSelect(community.value)}
            >
              {community.label}
              {selectedCommunity === community.value && <Check className="ml-auto h-4 w-4 text-[#4CAF82]" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
