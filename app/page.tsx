"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"
import { TopBar } from "@/components/layout/top-bar"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { PostCard, type Post } from "@/components/post/post-card"
import { Pagination } from "@/components/ui/pagination"
import { SearchBar } from "@/components/post/search-bar"
import { CommunityDropdown, type Community } from "@/components/post/community-dropdown"
import { CreatePostDialog } from "@/components/post/create-post-dialog"
import { ENV } from "../lib/config/env"

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

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [communities, setCommunities] = useState<Community[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.ceil(allPosts.length / 10))
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${ENV.API_ENDPOINT}/posts`)
        const data = await response.json()
        console.log("Fetched posts:", data)
        setPosts(data.posts)
        setTotalPosts(data.total)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      }
    }

    const fetchCommunities = async () => {
      try {
        const response = await fetch(`${ENV.API_ENDPOINT}/communities`)
        const data = await response.json()
        setCommunities(data)
      } catch (error) {
        console.error("Failed to fetch communities:", error)
      }
    }

    fetchPosts()
    fetchCommunities()
  }, [])

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
        searchPosts(query, selectedFilter)
      }, 300)
    } else if (query.length === 0) {
      // Reset to first page of all posts or filtered posts
      filterPosts(selectedFilter)
      setIsSearching(false)
    }
  }

  // Filter posts by category
  const filterPosts = (category: string | null) => {
    setSelectedFilter(category)
    setCurrentPage(1)

    if (!category) {
      // No filter, show all posts
      setPosts(allPosts.slice(0, 10))
      setTotalPages(Math.ceil(allPosts.length / 10))
      return
    }

    // Filter posts by category
    const filtered = allPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase())

    setPosts(filtered.slice(0, 10))
    setTotalPages(Math.ceil(filtered.length / 10))
  }

  // Mock API call for searching posts
  const searchPosts = async (query: string, category: string | null = null) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll filter the mock data
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      let results = allPosts

      // Apply category filter if selected
      if (category) {
        results = results.filter((post) => post.category.toLowerCase() === category.toLowerCase())
      }

      // Apply search query
      results = results.filter(
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
    let filteredPosts = allPosts

    // Apply category filter if selected
    if (selectedFilter) {
      filteredPosts = filteredPosts.filter((post) => post.category.toLowerCase() === selectedFilter.toLowerCase())
    }

    // Apply search filter if present
    if (searchQuery.length >= 2) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    const startIndex = (page - 1) * 10
    setPosts(filteredPosts.slice(startIndex, startIndex + 10))
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

              <div className="flex items-center gap-2">
                <CommunityDropdown
                  communities={communities}
                  selectedCommunity={selectedFilter}
                  onSelect={filterPosts}
                />

                <Button className="bg-[#4CAF82] hover:bg-[#3d8c68]" onClick={() => setCreateDialogOpen(true)}>
                  Create <Plus className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Search and filters - desktop */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />

              <div className="flex items-center gap-3">
                <CommunityDropdown
                  communities={communities}
                  selectedCommunity={selectedFilter}
                  onSelect={filterPosts}
                />

                <Button className="bg-[#4CAF82] hover:bg-[#3d8c68]" onClick={() => setCreateDialogOpen(true)}>
                  Create <Plus className="h-4 w-4 ml-1" />
                </Button>
              </div>
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
                posts.map((post) => <PostCard key={post.id} post={post} searchQuery={searchQuery} />)
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
    </div>
  )
}
