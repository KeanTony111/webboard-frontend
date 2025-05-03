"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { cn } from "@/app/lib/utils"
import type { Community } from "./community-dropdown"

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  communities: Community[]
  onSubmit: (title: string, content: string, community: string) => void
}

export function CreatePostDialog({ open, onOpenChange, communities, onSubmit }: CreatePostDialogProps) {
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false)
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")

  const handleSubmit = () => {
    if (selectedCommunity && postTitle.trim() && postContent.trim()) {
      onSubmit(postTitle, postContent, selectedCommunity)
      resetForm()
    }
  }

  const resetForm = () => {
    setPostTitle("")
    setPostContent("")
    setSelectedCommunity(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Post</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Popover open={communityDropdownOpen} onOpenChange={setCommunityDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={communityDropdownOpen}
                className="w-full justify-between border-[#4CAF82] text-[#4CAF82]"
              >
                {selectedCommunity
                  ? communities.find((community) => community.value === selectedCommunity)?.label
                  : "Choose a community"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <div className="max-h-[300px] overflow-auto">
                {communities.map((community) => (
                  <div
                    key={community.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-4 py-2.5 text-sm outline-none hover:bg-gray-100",
                      selectedCommunity === community.value ? "bg-[#E8F5E9] text-black" : "text-gray-700",
                    )}
                    onClick={() => {
                      setSelectedCommunity(community.value)
                      setCommunityDropdownOpen(false)
                    }}
                  >
                    {community.label}
                    {selectedCommunity === community.value && <Check className="ml-auto h-4 w-4 text-[#4CAF82]" />}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="Title" />

          <Textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind..."
            className="min-h-[150px]"
          />
        </div>

        <DialogFooter className="flex sm:justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button
            className="bg-[#4CAF82] hover:bg-[#3d8c68] flex-1 sm:flex-none"
            onClick={handleSubmit}
            disabled={!selectedCommunity || !postTitle.trim() || !postContent.trim()}
          >
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
