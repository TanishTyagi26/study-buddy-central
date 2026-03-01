import MainLayout from "@/components/layout/MainLayout";
import { notes } from "@/data/mockData";
import { Search, Filter, SlidersHorizontal, FileText, Presentation, File, Image, Video, Star, Download, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import NoteCard from "@/components/notes/NoteCard";

const fileTypes = [
  { label: "All", value: "all" },
  { label: "PDF", value: "pdf", icon: FileText },
  { label: "PPT", value: "pptx", icon: Presentation },
  { label: "DOC", value: "docx", icon: File },
  { label: "Image", value: "image", icon: Image },
  { label: "Video", value: "video", icon: Video },
];

const sortOptions = [
  { label: "Trending", value: "trending", icon: TrendingUp },
  { label: "Top Rated", value: "rated", icon: Star },
  { label: "Most Downloaded", value: "downloads", icon: Download },
  { label: "Latest", value: "latest", icon: Clock },
];

const subjects = ["All", "Data Structures", "Artificial Intelligence", "Mathematics", "Operating Systems", "Database Systems", "Computer Networks"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [fileType, setFileType] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [subject, setSubject] = useState("All");

  const filtered = notes.filter(note => {
    const matchesQuery = !query || 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.subject.toLowerCase().includes(query.toLowerCase()) ||
      note.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
    const matchesType = fileType === "all" || note.type === fileType;
    const matchesSubject = subject === "All" || note.subject === subject;
    return matchesQuery && matchesType && matchesSubject;
  }).sort((a, b) => {
    if (sortBy === "rated") return b.rating - a.rating;
    if (sortBy === "downloads") return b.downloads - a.downloads;
    return 0;
  });

  return (
    <MainLayout title="Search" subtitle="Find notes, subjects, and topics">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search notes, subjects, topics, keywords..."
            className="pl-12 pr-4 h-12 text-base bg-card border-border rounded-2xl shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
          {/* File type */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">File Type</p>
            <div className="flex flex-wrap gap-2">
              {fileTypes.map(ft => (
                <button
                  key={ft.value}
                  onClick={() => setFileType(ft.value)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    fileType === ft.value
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-secondary text-foreground hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          </div>
          {/* Sort */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sort By</p>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all ${
                    sortBy === opt.value
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-secondary text-foreground hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  <opt.icon className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {/* Subject */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Subject</p>
            <div className="flex flex-wrap gap-2">
              {subjects.map(s => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    subject === s
                      ? "bg-teal text-white"
                      : "bg-secondary text-foreground hover:bg-teal-light hover:text-teal"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> results found
              {query && <span> for "<span className="text-primary font-medium">{query}</span>"</span>}
            </p>
          </div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm mt-1">Try different keywords or filters</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
