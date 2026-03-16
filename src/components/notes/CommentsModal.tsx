import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentsModalProps {
  noteId: string;
  noteTitle: string;
  onClose: () => void;
}

interface CommentProfile {
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: CommentProfile | null;
}

export default function CommentsModal({ noteId, noteTitle, onClose }: CommentsModalProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchComments();
    const channel = supabase
      .channel(`comments:${noteId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comments", filter: `note_id=eq.${noteId}` }, () => {
        fetchComments();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [noteId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select(`
        id, content, created_at, user_id,
        profiles:user_id(full_name, avatar_url, username)
      `)
      .eq("note_id", noteId)
      .order("created_at", { ascending: true });
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setComments(data as unknown as Comment[]);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    setLoading(true);
    await supabase.from("comments").insert({
      note_id: noteId,
      user_id: user.id,
      content: newComment.trim(),
    });
    setNewComment("");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Comments</h3>
            <p className="text-xs text-muted-foreground truncate max-w-xs">{noteTitle}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {comments.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">Be the first to comment!</p>
          )}
          {comments.map(comment => {
            const name = comment.profiles?.full_name || comment.profiles?.username || "User";
            const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={comment.id} className="flex gap-2.5">
                {comment.profiles?.avatar_url ? (
                  <img src={comment.profiles.avatar_url} alt={name} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                ) : (
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                    {initials}
                  </div>
                )}
                <div className="bg-secondary rounded-xl px-3 py-2 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-foreground">{name}</span>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                  </div>
                  <p className="text-sm text-foreground mt-0.5">{comment.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {user && (
          <form onSubmit={submitComment} className="p-4 border-t border-border flex gap-2">
            <Input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button type="submit" disabled={loading || !newComment.trim()} size="icon" className="gradient-primary text-white shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
