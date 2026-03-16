import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import NoteCard, { NoteWithProfile } from "@/components/notes/NoteCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BookmarkCheck } from "lucide-react";

export default function BookmarksPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<NoteWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookmarks(); }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("bookmarks")
      .select(`note_id, notes:note_id(*, profiles:user_id(full_name, avatar_url, username, role))`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) {
      const notesList = data.map((b) => (b as unknown as { notes: NoteWithProfile }).notes).filter(Boolean);
      setNotes(notesList);
    }
    setLoading(false);
  };

  return (
    <MainLayout title="Saved Notes" subtitle="Your bookmarked study materials">
      <div className="p-4 md:p-6 max-w-6xl mx-auto pb-20 md:pb-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-card rounded-2xl border border-border h-48 animate-pulse" />)}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkCheck className="w-14 h-14 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="font-semibold text-foreground mb-2">No saved notes yet</h3>
            <p className="text-muted-foreground text-sm">Bookmark notes to find them quickly here</p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-4">{notes.length} saved note{notes.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {notes.map(note => <NoteCard key={note.id} note={note} onDelete={fetchBookmarks} />)}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
