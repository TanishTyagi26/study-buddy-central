import MainLayout from "@/components/layout/MainLayout";
import { notes } from "@/data/mockData";
import NoteCard from "@/components/notes/NoteCard";
import { BookmarkCheck } from "lucide-react";

export default function BookmarksPage() {
  const bookmarkedNotes = notes.filter(n => n.isBookmarked);

  return (
    <MainLayout title="Bookmarks" subtitle="Your saved notes for quick access">
      <div className="p-6 max-w-6xl mx-auto">
        {bookmarkedNotes.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">{bookmarkedNotes.length}</span> saved notes
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {bookmarkedNotes.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-24 text-muted-foreground">
            <BookmarkCheck className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-semibold">No bookmarks yet</p>
            <p className="text-sm mt-2">Save notes by clicking the bookmark icon on any note card</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
