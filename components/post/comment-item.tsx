import Image from "next/image"

interface CommentItemProps {
  username: string
  timestamp: string
  content: string
  avatarUrl: string
}

export function CommentItem({ username, timestamp, content, avatarUrl }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-4">
      <Image src={avatarUrl || "/placeholder.svg"} alt={username} width={36} height={36} className="rounded-full" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{username}</span>
          <span className="text-gray-500 text-sm">{timestamp}</span>
        </div>
        <p className="text-gray-700">{content}</p>
      </div>
    </div>
  )
}
