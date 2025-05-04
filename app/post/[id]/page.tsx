"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TopBar } from "@/components/layout/top-bar"
import { Sidebar } from "@/components/layout/sidebar"
import { AuthorInfo } from "@/components/post/author-info"
import { CommentsSection } from "@/components/post/comments-section"
import { ENV } from "@/lib/config/env"
import type { Post } from "@/components/post/post-card" 

interface Comment {
  id: number
  commentDetail: string
  user: {
    id: number
    username: string
    avatarUrl?: string
  }
  createdAt: string
  updatedAt: string
  postId: number
  userId: number
}

export default function PostDetailPage() {
  const params = useParams()
  const postId = params?.id as string 
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPostAndComments = async () => {
    if (!postId) return
    setIsLoading(true)
    setError(null)
    try {
      // Fetch Post Details
      const postRes = await fetch(`${ENV.API_ENDPOINT}/posts/${postId}`)
      if (!postRes.ok) {
        throw new Error(`Failed to fetch post: ${postRes.statusText}`)
      }
      const postData = await postRes.json()
      setPost(postData)

      // Fetch Comments
      const commentsRes = await fetch(`${ENV.API_ENDPOINT}/comments/${postId}`)
      if (!commentsRes.ok) {

        console.warn(`Failed to fetch comments: ${commentsRes.statusText}`)
        setComments([]) 
      } else {
        const commentsData = await commentsRes.json()
        setComments(commentsData)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to load post details.")
      setPost(null)
      setComments([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPostAndComments()
  }, [postId]) // Refetch if postId changes

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4CAF82] border-r-transparent"></div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-red-500">Error: {error}</p>
          </main>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Post not found.</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pb-8">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="py-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-500 hover:bg-gray-200">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </div>
            <div className="mt-4">
              <AuthorInfo
                name={post.user.username} 
                timestamp={new Date(post.createdAt).toLocaleDateString()} 
                avatarUrl={post.user.avatarUrl || "/placeholder.svg"} 
              />
              <div className="mt-1 text-gray-500 text-sm">
                {post.community.name} {/* Display community name */}
              </div>
              <h1 className="text-3xl font-bold mt-4 mb-4">{post.title}</h1>
              <div className="prose max-w-none">
                <p>{post.detail}</p> {/* Use detail field */}
              </div>
              <CommentsSection
                comments={comments.map((c) => ({
                  id: String(c.id),
                  username: c.user.username,
                  timestamp: new Date(c.createdAt).toLocaleDateString(),
                  commentDetail: c.commentDetail, // Map content to commentDetail
                  avatarUrl: c.user.avatarUrl || "/placeholder.svg",
                }))}
                commentCount={comments.length}
                postId={post.id}
                onCommentCreated={fetchPostAndComments} // Add callback to refresh comments
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
