"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createPost } from "@/lib/utils"
import type { Community } from "./community-dropdown"

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  communities: Community[]
}

export function CreatePostDialog({ open, onOpenChange, communities }: CreatePostDialogProps) {
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false)
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const router = useRouter()

  const handleCreatePostAttempt = async () => {
    const authToken = Cookies.get("authToken")

    if (!authToken) {
      setAlertMessage("You must be logged in to create a post.")
      setIsAlertOpen(true)
      return
    }

    if (selectedCommunity && postTitle.trim() && postContent.trim()) {
      try {
        const communityId = parseInt(selectedCommunity, 10)
        if (isNaN(communityId)) {
          console.error("Invalid community ID")
          return
        }
        await createPost(postTitle, postContent, communityId)
        console.log("Post created successfully!")
        resetForm()
        onOpenChange(false)
      } catch (error: any) {
        console.error("Failed to create post:", error)
        setAlertMessage(error.message || "Failed to create post. Please try again.")
        setIsAlertOpen(true)
      }
    }
  }

  const resetForm = () => {
    setPostTitle("")
    setPostContent("")
    setSelectedCommunity(null)
  }

  const handleLoginRedirect = () => {
    setIsAlertOpen(false)
    router.push("/sign-in")
  }

  return (
    <>
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
                    ? communities.find((community) => community.id.toString() === selectedCommunity)?.name
                    : "Choose a community"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="max-h-[300px] overflow-auto">
                  {communities.map((community) => (
                    <div
                      key={community.id}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-4 py-2.5 text-sm outline-none hover:bg-gray-100",
                        selectedCommunity === community.id.toString() ? "bg-[#E8F5E9] text-black" : "text-gray-700",
                      )}
                      onClick={() => {
                        setSelectedCommunity(community.id.toString())
                        setCommunityDropdownOpen(false)
                      }}
                    >
                      {community.name}
                      {selectedCommunity === community.id.toString() && <Check className="ml-auto h-4 w-4 text-[#4CAF82]" />}
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
              onClick={handleCreatePostAttempt}
              disabled={!selectedCommunity || !postTitle.trim() || !postContent.trim()}
            >
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoginRedirect}>
              Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
