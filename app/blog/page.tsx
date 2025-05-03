"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Plus } from "lucide-react"
import { TopBar } from "@/components/layout/top-bar"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PostCard, type Post } from "@/components/post/post-card"
import { Pagination } from "@/components/ui/pagination"
import { SearchBar } from "@/components/post/search-bar"
import { CreatePostDialog } from "@/components/post/create-post-dialog"
import type { Community } from "@/components/post/community-dropdown"

// Mock data for posts
const allPosts = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
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
  content:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, quod, voluptatibus, quae voluptatem quas voluptatum quibusdam quidem voluptas quia nesciunt. Quisquam, quae. Quisquam voluptates, quod, voluptatibus.",
  category: ["History", "Food", "Pets", "Health", "Fashion", "Exercise", "Others"][i % 7],
  commentCount: Math.floor(Math.random() * 50),
  author: {
    name: ["Jassica", "John", "Emma", "Michael", "Sophia"][i % 5],
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isCurrentUser: i % 5 === 0,
  },
}))

// Community categories
const communities: Community[] = [
  { value: "history", label: "History" },
  { value: "food", label: "Food" },
  { value: "pets", label: "Pets" },
  { value: "health", label: "Health" },
  { value: "fashion", label: "Fashion" },
  { value: "exercise", label: "Exercise" },
  { value: "others", label: "Others" },
]

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(allPosts.slice(0, 10))
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.ceil(allPosts.length / 10))
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [editedCategory, setEditedCategory] = useState("")
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Only search if query is 2 or more characters
    if (query.length >= 2) {
      setIsSearching(true)

      // Debounce search to avoid too many API calls
      searchTimeoutRef.current = setTimeout(() => {
        searchPosts(query)
      }, 300)
    } else if (query.length === 0) {
      // Reset to first page of all posts
      setPosts(allPosts.slice(0, 10))
      setCurrentPage(1)
      setTotalPages(Math.ceil(allPosts.length / 10))
      setIsSearching(false)
    }
  }

  // Mock API call for searching posts
  const searchPosts = async (query: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll filter the mock data
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const results = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase()),
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

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)

    // In a real app, this would be an API call with pagination params
    // For demo purposes, we'll slice the mock data
    const startIndex = (page - 1) * 10
    setPosts(allPosts.slice(startIndex, startIndex + 10))
  }

  // Open delete dialog
  const handleDeleteClick = (post: Post) => {
    setSelectedPost(post)
    setDeleteDialogOpen(true)
  }

  // Open edit dialog
  const handleEditClick = (post: Post) => {
    setSelectedPost(post)
    setEditedTitle(post.title)
    setEditedContent(post.content)
    setEditedCategory(post.category)
    setEditDialogOpen(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    // Here you would implement the actual delete functionality
    console.log("Deleting post:", selectedPost?.id)
    setDeleteDialogOpen(false)
    setSelectedPost(null)
  }

  // Handle edit confirmation
  const handleEditConfirm = () => {
    // Here you would implement the actual edit functionality
    console.log("Editing post:", {
      id: selectedPost?.id,
      title: editedTitle,
      content: editedContent,
      category: editedCategory,
    })
    setEditDialogOpen(false)
    setSelectedPost(null)
  }

  // Handle create post
  const handleCreatePost = (title: string, content: string, category: string) => {
    // In a real app, this would be an API call
    console.log("Creating post:", { title, content, category })
    setCreateDialogOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <TopBar />

      <div className="flex flex-1">
        {/* Sidebar - visible only on desktop */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 pb-8">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 pt-4">
            {/* Search and filters - mobile */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <SearchBar value={searchQuery} onChange={handleSearchChange} className="max-w-[200px]" />

              <Button className="bg-[#4CAF82] hover:bg-[#3d8c68]" onClick={() => setCreateDialogOpen(true)}>
                Create <Plus className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Search and filters - desktop */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />

              <Button className="bg-[#4CAF82] hover:bg-[#3d8c68]" onClick={() => setCreateDialogOpen(true)}>
                Create <Plus className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Loading indicator */}
            {isSearching && (
              <div className="text-center py-4">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#4CAF82] border-r-transparent"></div>
                <p className="mt-2 text-gray-500">Searching...</p>
              </div>
            )}

            {/* Blog posts */}
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    searchQuery={searchQuery}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
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

      {/* Create post dialog */}
      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        communities={communities}
        onSubmit={handleCreatePost}
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
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF82]"
            >
              {communities.map((community) => (
                <option key={community.value} value={community.value}>
                  {community.label}
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
            <Button className="bg-[#4CAF82] hover:bg-[#3d8c68]" onClick={handleEditConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
