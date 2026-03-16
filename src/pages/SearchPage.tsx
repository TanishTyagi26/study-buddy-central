import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import NoteCard, { NoteWithProfile } from "@/components/notes/NoteCard";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, FileText, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

interface ProfileResult {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string;
}

const FILE_TYPES = ["All", "PDF", "Image", "Video", "Document"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<NoteWithProfile[]>([]);
  const [profiles, setProfiles] = useState<ProfileResult[]>([]);
  const [fileType, setFileType] = useState("All");
  const [sortBy, setSortBy] = useState("created_at");
  const [tab, setTab] = useState<"notes" | "people">("notes");
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => { doSearch(); }, [debouncedQuery, fileType, sortBy, tab]);

  const doSearch = async () => {
    setLoading(true);
    if (tab === "notes") {
      let q = supabase.from("notes").select("*, profiles:user_id(full_name, avatar_url, username, role)").order(sortBy, { ascending: false }).limit(30);
      if (debouncedQuery) q = q.or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%,subject.ilike.%${debouncedQuery}%`);
      if (fileType !== "All") {
        const typeMap: Record<string, string> = { "PDF": "application/pdf", "Image": "image", "Video": "video", "Document": "application/vnd" };
        q = q.ilike("file_type", `${typeMap[fileType]}%`);
      }
      const { data } = await q;
      setNotes((data as unknown as NoteWithProfile[]) || []);
    } else {
      let q = supabase.from("profiles").select("id, full_name, username, avatar_url, role").limit(20);
      if (debouncedQuery) q = q.or(`full_name.ilike.%${debouncedQuery}%,username.ilike.%${debouncedQuery}%`);
      const { data } = await q;
      setProfiles(data || []);
    }
    setLoading(false);
  };

  return (
    <MainLayout title="Search" subtitle="Find notes and people">
      <div className="p-4 md:p-6 max-w-6xl mx-auto pb-20 md:pb-6 space-y-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search notes, subjects, people..." value={query} onChange={e => setQuery(e.target.value)}
            className="pl-9 pr-9 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary h-11" autoFocus />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-secondary rounded-xl p-1 gap-1">
            {(["notes", "people"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {t === "notes" ? <FileText className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          {tab === "notes" && (
            <>
              <div className="flex gap-1 flex-wrap">
                {FILE_TYPES.map(t => (
                  <Button key={t} variant={fileType === t ? "default" : "outline"} size="sm" onClick={() => setFileType(t)}
                    className={`h-8 text-xs ${fileType === t ? "gradient-primary text-white border-0" : ""}`}>{t}</Button>
                ))}
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="ml-auto h-8 px-2 rounded-lg bg-secondary text-foreground text-xs border-0 focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="created_at">Newest</option>
                <option value="download_count">Most Downloaded</option>
              </select>
            </>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-card rounded-2xl border border-border h-48 animate-pulse" />)}
          </div>
        ) : tab === "notes" ? (
          notes.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground"><Search className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>No notes found</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {notes.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
          )
        ) : (
          profiles.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground"><User className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>No users found</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {profiles.map(p => {
                const initials = (p.full_name || p.username || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <Link key={p.id} to={`/profile/${p.id}`} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-md transition-all">
                    {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" /> :
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold shrink-0">{initials}</div>}
                    <div>
                      <p className="font-medium text-foreground">{p.full_name || p.username}</p>
                      <p className="text-xs text-muted-foreground">@{p.username}</p>
                      <Badge variant="secondary" className="text-xs mt-1 capitalize">{p.role}</Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}

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
