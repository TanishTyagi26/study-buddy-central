import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, MessageCircle, Bookmark, Star, Download, Trash2, MoreVertical, FileText, ImageIcon, FileIcon, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import CommentsModal from "./CommentsModal";

export interface NoteWithProfile {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  file_url: string;
  file_type: string;
  file_name: string;
  file_size: number | null;
  download_count: number | null;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
    role: string;
  } | null;
}

interface NoteCardProps {
  note: NoteWithProfile;
  onDelete?: () => void;
  compact?: boolean;
}

const getFileIcon = (type: string) => {
  if (type.includes("pdf")) return FileText;
  if (type.includes("image")) return ImageIcon;
  if (type.includes("video")) return Video;
  return FileIcon;
};

const getFileBadgeClass = (type: string) => {
  if (type.includes("pdf")) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (type.includes("image")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  if (type.includes("video")) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
};

export default function NoteCard({ note, onDelete, compact = false }: NoteCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchInteractions(); }, [note.id, user?.id]);

  const fetchInteractions = async () => {
    const [likesRes, bookmarkRes, ratingsRes, commentsRes, userLikeRes, userRatingRes] = await Promise.all([
      supabase.from("likes").select("id", { count: "exact" }).eq("note_id", note.id),
      user ? supabase.from("bookmarks").select("id").eq("note_id", note.id).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
      supabase.from("ratings").select("rating").eq("note_id", note.id),
      supabase.from("comments").select("id", { count: "exact" }).eq("note_id", note.id),
      user ? supabase.from("likes").select("id").eq("note_id", note.id).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
      user ? supabase.from("ratings").select("rating").eq("note_id", note.id).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
    ]);
    setLikeCount(likesRes.count || 0);
    setBookmarked(!!bookmarkRes.data);
    setLiked(!!userLikeRes.data);
    const ratings = ratingsRes.data || [];
    if (ratings.length) setAvgRating(ratings.reduce((a, b) => a + b.rating, 0) / ratings.length);
    setCommentCount(commentsRes.count || 0);
    if (userRatingRes.data) setUserRating((userRatingRes.data as { rating: number }).rating);
  };

  const toggleLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from("likes").delete().eq("note_id", note.id).eq("user_id", user.id);
      setLiked(false); setLikeCount(c => c - 1);
    } else {
      await supabase.from("likes").insert({ note_id: note.id, user_id: user.id });
      setLiked(true); setLikeCount(c => c + 1);
    }
  };

  const toggleBookmark = async () => {
    if (!user) return;
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("note_id", note.id).eq("user_id", user.id);
      setBookmarked(false);
      toast({ title: "Removed from saved" });
    } else {
      await supabase.from("bookmarks").insert({ note_id: note.id, user_id: user.id });
      setBookmarked(true);
      toast({ title: "Saved!", description: "Added to your bookmarks." });
    }
  };

  const submitRating = async (val: number) => {
    if (!user) return;
    await supabase.from("ratings").upsert({ note_id: note.id, user_id: user.id, rating: val });
    setUserRating(val);
    fetchInteractions();
  };

  const handleDownload = async () => {
    await supabase.from("notes").update({ download_count: (note.download_count || 0) + 1 }).eq("id", note.id);
    window.open(note.file_url, "_blank");
  };

  const handleDelete = async () => {
    if (!user || user.id !== note.user_id) return;
    setDeleting(true);
    const { error } = await supabase.from("notes").delete().eq("id", note.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Note deleted" }); onDelete?.(); }
    setDeleting(false);
  };

  const authorName = note.profiles?.full_name || note.profiles?.username || "Anonymous";
  const authorInitials = authorName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const timeAgo = formatDistanceToNow(new Date(note.created_at), { addSuffix: true });
  const fileExt = note.file_name?.split(".").pop()?.toUpperCase() || "FILE";
  const FileTypeIcon = getFileIcon(note.file_type);

  if (compact) {
    return (
      <div className="bg-card rounded-xl border border-border p-3 flex items-center gap-3 hover:border-primary/30 transition-colors">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${getFileBadgeClass(note.file_type)}`}>
          <FileTypeIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{note.title}</p>
          <p className="text-xs text-muted-foreground">{authorName} · {timeAgo}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          {likeCount}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-2xl border border-border p-4 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {note.profiles?.avatar_url ? (
              <img src={note.profiles.avatar_url} alt={authorName} className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                {authorInitials}
              </div>
            )}
            <div className="min-w-0">
              <Link to={`/profile/${note.user_id}`} className="text-sm font-medium text-foreground hover:text-primary truncate block">
                {authorName}
              </Link>
              <div className="flex items-center gap-1">
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4 capitalize">{note.profiles?.role || "student"}</Badge>
              </div>
            </div>
          </div>
          {user?.id === note.user_id && (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="text-muted-foreground hover:text-foreground p-1 rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 bg-popover border border-border rounded-xl shadow-lg z-10 min-w-32 overflow-hidden">
                  <button
                    onClick={() => { setShowMenu(false); handleDelete(); }}
                    disabled={deleting}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-3">
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{note.title}</h3>
          {note.description && <p className="text-sm text-muted-foreground line-clamp-2">{note.description}</p>}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg font-medium ${getFileBadgeClass(note.file_type)}`}>
            <FileTypeIcon className="w-3 h-3" />
            {fileExt}
          </span>
          {note.subject && <Badge variant="secondary" className="text-xs">{note.subject}</Badge>}
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {[1,2,3,4,5].map(star => (
            <button key={star} onClick={() => submitRating(star)} className={`transition-transform hover:scale-110 ${star <= (userRating || avgRating) ? "text-amber-400" : "text-muted-foreground/30"}`}>
              <Star className={`w-3.5 h-3.5 ${star <= (userRating || avgRating) ? "fill-current" : ""}`} />
            </button>
          ))}
          {avgRating > 0 && <span className="text-xs text-muted-foreground ml-1">{avgRating.toFixed(1)}</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 border-t border-border">
          <Button variant="ghost" size="sm" onClick={toggleLike} className={`gap-1.5 text-xs h-7 px-2 ${liked ? "text-red-500" : "text-muted-foreground"}`}>
            <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} /> {likeCount}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments(true)} className="gap-1.5 text-xs h-7 px-2 text-muted-foreground">
            <MessageCircle className="w-3.5 h-3.5" /> {commentCount}
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleBookmark} className={`gap-1.5 text-xs h-7 px-2 ${bookmarked ? "text-primary" : "text-muted-foreground"}`}>
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-1.5 text-xs h-7 px-2 text-muted-foreground hover:text-primary">
            <Download className="w-3.5 h-3.5" /> {note.download_count || 0}
          </Button>
          <a href={note.file_url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-primary">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      </div>

      {showComments && <CommentsModal noteId={note.id} noteTitle={note.title} onClose={() => setShowComments(false)} />}
    </>
  );
}
