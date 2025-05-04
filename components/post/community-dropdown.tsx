"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Community {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  value?: string  
  label?: string 
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
  // Updated logic to handle type mismatches
  const updatedCommunities = communities.map((community) => ({
    ...community,
    value: community.id.toString(), // Convert id to string for compatibility
    label: community.name,
  }))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-1 bg-white border-[#4CAF82] text-[#4CAF82] ${className}`}
        >
          {selectedCommunity ? updatedCommunities.find((c) => c.id === Number(selectedCommunity))?.name : buttonText}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
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
              key={community.id} // Updated to use `id` instead of `value` for the key
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-4 py-2.5 text-sm outline-none hover:bg-gray-100",
                selectedCommunity === community.id.toString() ? "bg-[#E8F5E9] text-black" : "text-gray-700",
              )}
              onClick={() => onSelect(community.id.toString())} // Ensure `id` is converted to string for comparison
            >
              {community.name}
              {selectedCommunity === community.id.toString() && <Check className="ml-auto h-4 w-4 text-[#4CAF82]" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
