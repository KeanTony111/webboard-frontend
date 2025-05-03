"use client"

import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2 ,MessageCircle} from "lucide-react"

interface Author {
  name: string
  avatarUrl: string
  isCurrentUser: boolean
}

export interface Post {
  id: string
  title: string
  content: string
  category: string
  commentCount: number
  author: Author
}

interface PostCardProps {
  post: Post
  searchQuery?: string
  onEditClick?: (post: Post) => void
  onDeleteClick?: (post: Post) => void
}

export function PostCard({ post, searchQuery = "", onEditClick, onDeleteClick }: PostCardProps) {
  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query || query.length < 2) return text

    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={post.author.avatarUrl || "/placeholder.svg"}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-medium">{post.author.name}</span>
        </div>

        {post.author.isCurrentUser && onEditClick && onDeleteClick && (
          <div className="flex items-center gap-2">
            <button onClick={() => onEditClick(post)} className="p-1 text-gray-500 hover:text-gray-700">
              <Edit className="h-5 w-5" />
            </button>
            <button onClick={() => onDeleteClick(post)} className="p-1 text-gray-500 hover:text-gray-700">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-1 text-gray-500 text-sm">{post.category}</div>

      <Link href={`/post/${post.id}`}>
        <h2 className="text-xl font-bold mt-2 hover:text-[#4CAF82]">
          {searchQuery.length >= 2 ? highlightText(post.title, searchQuery) : post.title}
        </h2>
      </Link>

      <p className="mt-2 text-gray-700 line-clamp-3">{post.content}</p>

      <div className="mt-4 flex items-center text-gray-500">
       <MessageCircle className="h-5 w-5 pr-1"/> <span>{post.commentCount} Comments</span>
      </div>
    </div>
  )
}
