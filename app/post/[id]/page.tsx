"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TopBar } from "@/components/layout/top-bar"
import { Sidebar } from "@/components/layout/sidebar"
import { AuthorInfo } from "@/components/post/author-info"
import { CommentsSection } from "@/components/post/comments-section"

// Mock data for the post
const post = {
  id: "1",
  title: "The Big Short War",
  content:
    'Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. "I would\'ve lost it," Ackman concedes. He got a 780 on the verbal and a 750 on the math. "One wrong on the verbal, three wrong on the math," he muses. "I\'m still convinced some of the questions were wrong."',
  author: {
    name: "Zach",
    timestamp: "5mo. ago",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isOnline: true,
  },
  commentCount: 32,
  comments: [
    {
      id: "1",
      username: "Wittawat98",
      timestamp: "12h ago",
      content:
        "Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio iaculis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.",
      avatarUrl: "/placeholder.svg?height=36&width=36",
    },
    {
      id: "2",
      username: "Hawaii51",
      timestamp: "1mo. ago",
      content:
        "Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio iaculis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.",
      avatarUrl: "/placeholder.svg?height=36&width=36",
    },
    {
      id: "3",
      username: "Helo_re",
      timestamp: "3mo. ago",
      content:
        "Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio iaculis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.",
      avatarUrl: "/placeholder.svg?height=36&width=36",
    },
    {
      id: "4",
      username: "Azc123",
      timestamp: "4mo. ago",
      content:
        "Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio iaculis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.",
      avatarUrl: "/placeholder.svg?height=36&width=36",
    },
  ],
}

export default function PostDetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 pb-8">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="py-4">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </div>

            <div className="mt-4">
              <AuthorInfo
                name={post.author.name}
                timestamp={post.author.timestamp}
                avatarUrl={post.author.avatarUrl}
                isOnline={post.author.isOnline}
              />

              <div className="mt-1 text-gray-500 text-sm">History</div>

              <h1 className="text-3xl font-bold mt-4 mb-4">{post.title}</h1>

              <div className="prose max-w-none">
                <p>{post.content}</p>
              </div>

              <CommentsSection comments={post.comments} commentCount={post.commentCount} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
