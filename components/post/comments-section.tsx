import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./comment-item";
import { MessageCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ENV } from "@/lib/config/env";

interface Comment {
  id: string;
  username: string;
  timestamp: string;
  content: string;
  avatarUrl: string;
}

interface CommentsSectionProps {
  comments: Comment[];
  commentCount: number;
  postId: number; // Add postId prop
  onCommentCreated?: () => void; // Optional callback when comment is created
}

export function CommentsSection({ comments, commentCount, postId, onCommentCreated }: CommentsSectionProps) {
  const [showInput, setShowInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCancel = () => {
    setShowInput(false);
    setCommentText("");
    setError(null);
  };

  const handleSave = async () => {
    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    const token = Cookies.get("authToken");
    if (!token) {
      // Redirect to sign in if no auth token
      router.push("/sign-in");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {      
      const response = await fetch(`${ENV.API_ENDPOINT}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          commentDetail: commentText,
          postId: postId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post comment");
      }
      setCommentText("");
      setShowInput(false);
      
      if (onCommentCreated) {
        onCommentCreated();
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <MessageCircle className="h-5 w-5 pr-1 text-gray-500" />{" "}
        <span className="text-gray-500">{commentCount} Comments</span>
      </div>

      {/* Mobile Add Comment Button */}
      <Button
        variant="outline"
        className="border-[#4CAF82] text-[#4CAF82] hover:bg-[#4CAF82]/10 mb-6 md:hidden"
        onClick={() => setShowInput(true)}
      >
        Add Comment
      </Button>

      {/* Comment Form */}
      <div className={`${showInput ? 'block' : 'hidden'} md:block mb-6`}>
        <Textarea
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="mb-2"
          rows={3}
          disabled={isSubmitting}
        />
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#4CAF82] hover:bg-[#4CAF82]/90 text-white"
            onClick={handleSave}
            disabled={isSubmitting || !commentText.trim()}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-1 divide-y divide-gray-100">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              username={comment.username}
              timestamp={comment.timestamp}
              content={comment.content}
              avatarUrl={comment.avatarUrl}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm py-4">No comments yet.</p>
        )}
      </div>
    </div>
  );
}

