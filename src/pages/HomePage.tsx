import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import NoteCard, { NoteWithProfile } from "@/components/notes/NoteCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Upload, Users, ArrowRight, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [recentNotes, setRecentNotes] = useState<NoteWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalNotes: 0, totalUsers: 0 });

  useEffect(() => { fetchNotes(); fetchStats(); }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("notes")
      .select("*, profiles:user_id(full_name, avatar_url, username, role)")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setRecentNotes(data as unknown as NoteWithProfile[]);
    setLoading(false);
  };

  const fetchStats = async () => {
    const [n, u] = await Promise.all([
      supabase.from("notes").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]);
    setStats({ totalNotes: n.count || 0, totalUsers: u.count || 0 });
  };

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <MainLayout showSearch>
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 pb-20 md:pb-6">
        <div className="rounded-2xl gradient-hero p-5 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
          </div>
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm">Good day 👋</p>
              <h2 className="text-xl md:text-2xl font-bold mt-1">Welcome back, {firstName}!</h2>
              <p className="text-white/70 text-sm mt-1">Discover and share study notes</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="text-center"><p className="text-lg font-bold">{stats.totalNotes}</p><p className="text-white/60 text-xs">Total Notes</p></div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center"><p className="text-lg font-bold">{stats.totalUsers}</p><p className="text-white/60 text-xs">Students</p></div>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 shrink-0 hidden sm:flex" onClick={() => navigate("/upload")}>
              <Upload className="w-4 h-4 mr-1.5" /> Upload Notes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Upload, label: "Upload Note", path: "/upload", color: "bg-primary-light text-primary" },
            { icon: TrendingUp, label: "Browse All", path: "/search", color: "bg-teal-light text-teal" },
            { icon: BookOpen, label: "Saved Notes", path: "/bookmarks", color: "bg-accent-light text-accent" },
            { icon: Users, label: "Groups", path: "/groups", color: "bg-success-light text-success" },
          ].map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="bg-card rounded-2xl border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 hover:shadow-md transition-all text-center group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-foreground">{item.label}</p>
            </button>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Recently Uploaded</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-primary gap-1 text-xs" onClick={() => navigate("/search")}>
              See all <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-4 space-y-3">
                  <div className="flex items-center gap-2"><Skeleton className="w-8 h-8 rounded-full" /><div className="space-y-1"><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-16" /></div></div>
                  <Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : recentNotes.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="font-medium text-foreground mb-1">No notes yet</p>
              <p className="text-sm text-muted-foreground mb-4">Be the first to upload study materials!</p>
              <Button className="gradient-primary text-white" onClick={() => navigate("/upload")}><Upload className="w-4 h-4 mr-2" />Upload a Note</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {recentNotes.map(note => <NoteCard key={note.id} note={note} onDelete={fetchNotes} />)}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
