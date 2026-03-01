import { Star, Download, Heart, MessageCircle, Bookmark, BookmarkCheck, FileText, Presentation, File, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const fileTypeConfig: Record<string, { icon: typeof FileText; color: string; bg: string; label: string }> = {
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50", label: "PDF" },
  pptx: { icon: Presentation, color: "text-orange-500", bg: "bg-orange-50", label: "PPT" },
  docx: { icon: File, color: "text-blue-500", bg: "bg-blue-50", label: "DOC" },
  image: { icon: Image, color: "text-green-500", bg: "bg-green-50", label: "IMG" },
};

interface Note {
  id: string;
  title: string;
  subject: string;
  author: { name: string; avatar: string; color: string };
  type: string;
  size: string;
  pages: number;
  rating: number;
  ratingCount: number;
  downloads: number;
  likes: number;
  comments: number;
  isBookmarked: boolean;
  isTrending: boolean;
  uploadedAt: string;
  tags: string[];
  preview: string;
}

interface NoteCardProps {
  note: Note;
  compact?: boolean;
}

export default function NoteCard({ note, compact = false }: NoteCardProps) {
  const [bookmarked, setBookmarked] = useState(note.isBookmarked);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(note.likes);

  const fileType = fileTypeConfig[note.type] || fileTypeConfig.pdf;
  const FileIcon = fileType.icon;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-card transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer animate-fade-in">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-xl ${fileType.bg} flex items-center justify-center shrink-0`}>
              <FileIcon className={`w-5 h-5 ${fileType.color}`} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {note.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">{note.subject}</Badge>
                {note.isTrending && (
                  <Badge className="text-xs px-1.5 py-0 h-4 bg-accent/10 text-accent-foreground border-accent/20">
                    🔥 Trending
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 shrink-0"
            onClick={handleBookmark}
          >
            {bookmarked
              ? <BookmarkCheck className="w-4 h-4 text-primary" />
              : <Bookmark className="w-4 h-4 text-muted-foreground" />
            }
          </Button>
        </div>

        {/* Preview text */}
        {!compact && (
          <p className="text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed">
            {note.preview}
          </p>
        )}

        {/* Tags */}
        {!compact && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
              <span className="text-xs font-semibold text-foreground">{note.rating}</span>
              <span className="text-xs text-muted-foreground">({note.ratingCount})</span>
            </div>
            {/* Downloads */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download className="w-3.5 h-3.5" />
              <span className="text-xs">{note.downloads}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                liked ? "text-red-500 bg-red-50" : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500" : ""}`} />
              {likeCount}
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary-light transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              {note.comments}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: note.author.color }}
            >
              {note.author.avatar}
            </div>
            <span className="text-xs text-muted-foreground">{note.author.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{fileType.label}</span>
            <span>•</span>
            <span>{note.size}</span>
            <span>•</span>
            <span>{note.uploadedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
