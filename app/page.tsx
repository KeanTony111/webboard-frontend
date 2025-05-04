"use client"

import type React from "react"
import type { Post } from "../components/post/post-card"
import type { Community } from "@/components/post/community-dropdown-with-api"

import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"
import { TopBar } from "@/components/layout/top-bar"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post/post-card"
import { Pagination } from "@/components/ui/pagination"
import { SearchBar } from "@/components/post/search-bar"
import CommunityDropdownWithAPI from "@/components/post/community-dropdown-with-api"
import { CreatePostDialog } from "@/components/post/create-post-dialog"
import { ENV } from "../lib/config/env"

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false) // Changed from isSearching
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null) // Store community ID
  const [communities, setCommunities] = useState<Community[]>([])
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Unified data fetching function
  const fetchData = async (page = 1, communityId: string | null = null, searchTerm = "") => {
    setIsLoading(true)
    try {
      let url = "";
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10", // Assuming limit is 10
      });

      if (searchTerm.length >= 2) {
        url = `${ENV.API_ENDPOINT}/search/posts`;
        params.set("searchTerm", searchTerm);
        if (communityId) {
          params.set("communityId", communityId);
        }
      } else {
        url = `${ENV.API_ENDPOINT}/search/posts`;
        if (communityId) {
          params.set("communityId", communityId);
        }
      }

      const response = await fetch(`${url}?${params.toString()}`);
      const data = await response.json();

      // Adjust based on actual API response structure for search vs. get all
      const fetchedPosts = data.posts || data; // Handle potential differences in response structure
      const total = data.total ?? fetchedPosts.length; // Adjust total based on response

      setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
      setTotalPosts(total);
      setTotalPages(Math.ceil(total / 10));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setPosts([]); // Clear posts on error
      setTotalPosts(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial posts and communities
    fetchData();

    const fetchCommunities = async () => {
      try {
        const response = await fetch(`${ENV.API_ENDPOINT}/communities`);
        const data = await response.json();
        setCommunities(data);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      }
    };
    fetchCommunities();
  }, []); // Run only on mount

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchData(1, selectedCommunityId, query); // Fetch page 1 with new search
    }, 500); // Debounce
  };

  // Filter posts by community
  const filterPostsByCommunity = (communityId: string | null) => {
    setSelectedCommunityId(communityId);
    fetchData(1, communityId, searchQuery); // Fetch page 1 with new filter
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchData(page, selectedCommunityId, searchQuery); // Fetch new page with current filters
  };

  // Handle create post (Placeholder - needs actual implementation)
  const handleCreatePost = (/* title: string, content: string, communityId: string */) => {
    console.log("Creating post...");
    setCreateDialogOpen(false);
    // TODO: Implement actual post creation API call and refresh data
    fetchData(currentPage, selectedCommunityId, searchQuery); // Refresh current view after potential post creation
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <TopBar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 pb-8">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 pt-4">
            {/* Search and filters - mobile */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <SearchBar value={searchQuery} onChange={handleSearchChange} className="max-w-[200px]" />

              <div className="flex items-center gap-2">
                <CommunityDropdownWithAPI
                  selectedCommunity={selectedCommunityId}
                  onSelect={filterPostsByCommunity}
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
                <CommunityDropdownWithAPI
                  selectedCommunity={selectedCommunityId}
                  onSelect={filterPostsByCommunity}
                />

                <Button className="bg-[#4CAF82] hover:bg-[#3d8c68]" onClick={() => setCreateDialogOpen(true)}>
                  Create <Plus className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="text-center py-4">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#4CAF82] border-r-transparent"></div>
                <p className="mt-2 text-gray-500">Loading...</p>
              </div>
            )}

            {/* Blog posts */}
            {!isLoading && (
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => <PostCard key={post.id} post={post} searchQuery={searchQuery} />)
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No posts found</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && posts.length > 0 && (
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
        // onSubmit prop is removed from CreatePostDialog, logic is internal now
      />
    </div>
  );
}
