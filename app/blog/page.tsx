"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"
import { TopBar } from "@/components/layout/top-bar"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PostCard } from "@/components/post/post-card"
import { Pagination } from "@/components/ui/pagination"
import { SearchBar } from "@/components/post/search-bar"
import { CreatePostDialog } from "@/components/post/create-post-dialog"
import type { Post, Community } from "@/types"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

// Mock communities data with proper type
const communities: Community[] = [
  {
    id: 1,
    name: "History",
    description: "History community",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Food",
    description: "Food community",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Pets",
    description: "Pets community",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Health",
    description: "Health community",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Fashion",
    description: "Fashion community",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Exercise",
    description: "Exercise community",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Others",
    description: "Other topics community",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock posts data with proper type
const allPosts: Post[] = Array.from({ length: 50 }, (_, i) => {
  const userId = Math.floor(i / 10) + 1;
  const communityId = (i % communities.length) + 1;
  return {
    id: i + 1,
    title: `Post ${i + 1}: ${
      [
        "The Future of AI",
        "Cooking Tips for Beginners",
        "Pet Care Essentials",
        "Health and Wellness",
        "Fashion Trends",
        "Exercise Routines",
        "Travel Destinations",
      ][i % 7]
    }`,
    detail: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    user: {
      id: userId,
      username: ["Jassica", "John", "Emma", "Michael", "Sophia"][i % 5],
      avatarUrl: "/placeholder.svg?height=40&width=40",
      isCurrentUser: i % 5 === 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    community: communities[i % communities.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    commentCount: Math.floor(Math.random() * 50),
    userId: userId,
    communityId: communityId,
  };
})

export default function BlogPage() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check for username cookie and filter posts
  useEffect(() => {
    const currentUsername = Cookies.get('username')
    if (!currentUsername) {
      // Redirect to sign in if no username found
      router.push('/sign-in')
      return
    }

    setUsername(currentUsername)
    // Filter posts for the current user
    const userPosts = allPosts.filter(post => post.user.username === currentUsername)
    setPosts(userPosts.slice(0, 10))
    setTotalPages(Math.ceil(userPosts.length / 10))
  }, [router])

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (query.length >= 2) {
      setIsSearching(true)
      searchTimeoutRef.current = setTimeout(() => {
        searchUserPosts(query)
      }, 300)
    } else if (query.length === 0) {
      // Reset to first page of user's posts
      const userPosts = allPosts.filter(post => post.user.username === username)
      setPosts(userPosts.slice(0, 10))
      setCurrentPage(1)
      setTotalPages(Math.ceil(userPosts.length / 10))
      setIsSearching(false)
    }
  }

  // Search only within user's posts
  const searchUserPosts = async (query: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const userPosts = allPosts.filter(post => post.user.username === username)
      const results = userPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.detail.toLowerCase().includes(query.toLowerCase())
      )

      setPosts(results.slice(0, 10))
      setTotalPages(Math.ceil(results.length / 10))
      setCurrentPage(1)
      setIsSearching(false)
    } catch (error) {
      console.error("Search failed:", error)
      setIsSearching(false)
    }
  }

  // Handle pagination within user's posts
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const userPosts = allPosts.filter(post => post.user.username === username)
    const startIndex = (page - 1) * 10
    setPosts(userPosts.slice(startIndex, startIndex + 10))
  }

  // Handle edit click
  const handleEditClick = (post: Post) => {
    setSelectedPost(post)
    setEditedTitle(post.title)
    setEditedContent(post.detail)
    setSelectedCommunity(post.community)
    setEditDialogOpen(true)
  }

  // Handle delete click
  const handleDeleteClick = (post: Post) => {
    setSelectedPost(post)
    setDeleteDialogOpen(true)
  }

  // Handle edit confirmation
  const handleEditConfirm = () => {
    if (!selectedPost || !selectedCommunity) return

    // Here you would implement the actual edit functionality
    console.log("Editing post:", {
      id: selectedPost.id,
      title: editedTitle,
      detail: editedContent,
      communityId: selectedCommunity.id,
    })
    setEditDialogOpen(false)
    setSelectedPost(null)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!selectedPost) return

    // Here you would implement the actual delete functionality
    console.log("Deleting post:", selectedPost.id)
    setDeleteDialogOpen(false)
    setSelectedPost(null)
  }

  // Handle create post
  const handleCreatePost = (data: { title: string; content: string; communityId: number }) => {
    // In a real app, this would be an API call
    console.log("Creating post:", { ...data, username })
    setCreateDialogOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <TopBar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 pb-8">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 pt-4">
            {/* Page Title */}
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Posts</h1>

            {/* Search and Create - Mobile */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <SearchBar value={searchQuery} onChange={handleSearchChange} className="max-w-[200px]" />
              <Button className="bg-[#4CAF82] hover:bg-[#3d8c68]" onClick={() => setCreateDialogOpen(true)}>
                Create <Plus className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Search and Create - Desktop */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
              <Button className="bg-[#4CAF82] hover:bg-[#3d8c68]" onClick={() => setCreateDialogOpen(true)}>
                Create <Plus className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className="text-center py-4">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#4CAF82] border-r-transparent"></div>
                <p className="mt-2 text-gray-500">Searching...</p>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    searchQuery={searchQuery}
                    onEditClick={() => handleEditClick(post)}
                    onDeleteClick={() => handleDeleteClick(post)}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {posts.length > 0 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        </main>
      </div>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        communities={communities}
        onCreatePost={handleCreatePost}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Please confirm if you wish to delete the post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-500">
              Are you sure you want to delete the post?
              <br />
              Once deleted, it cannot be recovered.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-col gap-2">
            <Button variant="destructive" className="w-full" onClick={handleDeleteConfirm}>
              Delete
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit post dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Post</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <select
              value={selectedCommunity?.id}
              onChange={(e) => {
                const community = communities.find(c => c.id === Number(e.target.value))
                if (community) setSelectedCommunity(community)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF82]"
            >
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>

            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Post title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF82]"
            />

            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Post content"
              className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF82]"
            />
          </div>
          <DialogFooter className="flex sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#4CAF82] hover:bg-[#3d8c68]" 
              onClick={handleEditConfirm}
              disabled={!editedTitle.trim() || !editedContent.trim() || !selectedCommunity}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
