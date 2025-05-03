import { Button } from "@/components/ui/button"
import { CommentItem } from "./comment-item"
import { MessageCircle} from "lucide-react"

interface Comment {
  id: string
  username: string
  timestamp: string
  content: string
  avatarUrl: string
}

interface CommentsSectionProps {
  comments: Comment[]
  commentCount: number
}

export function CommentsSection({ comments, commentCount }: CommentsSectionProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <MessageCircle className="h-5 w-5 pr-1 text-gray-500"/> <span className="text-gray-500">{commentCount} Comments</span>
      </div>

      <Button variant="outline" className="border-[#4CAF82] text-[#4CAF82] hover:bg-[#4CAF82]/10 mb-6">
        Add Comments
      </Button>

      <div className="space-y-1 divide-y divide-gray-100">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            username={comment.username}
            timestamp={comment.timestamp}
            content={comment.content}
            avatarUrl={comment.avatarUrl}
          />
        ))}
      </div>
    </div>
  )
}
