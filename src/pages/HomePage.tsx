import MainLayout from "@/components/layout/MainLayout";
import NoteCard from "@/components/notes/NoteCard";
import { notes, groups, currentUser } from "@/data/mockData";
import { TrendingUp, Clock, Star, BookOpen, Users, ArrowRight, Flame, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const StatCard = ({ icon: Icon, label, value, color }: { icon: typeof TrendingUp; label: string; value: string | number; color: string }) => (
  <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const trendingNotes = notes.filter(n => n.isTrending);
  const recentNotes = [...notes].slice(0, 3);
  const joinedGroups = groups.filter(g => g.isJoined);

  return (
    <MainLayout showSearch>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Welcome banner */}
        <div className="rounded-2xl gradient-hero p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute bottom-2 right-32 w-20 h-20 rounded-full bg-white/10 blur-xl" />
          </div>
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Good morning 👋</p>
                <h2 className="text-2xl font-bold mt-1">Welcome back, {currentUser.name.split(" ")[0]}!</h2>
                <p className="text-white/70 text-sm mt-1">{currentUser.department} · {currentUser.year} · {currentUser.university}</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{currentUser.stats.uploads}</p>
                    <p className="text-white/60 text-xs">Uploads</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <p className="text-xl font-bold">{currentUser.stats.downloads}</p>
                    <p className="text-white/60 text-xs">Downloads</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <p className="text-xl font-bold">{currentUser.stats.ratingsReceived}⭐</p>
                    <p className="text-white/60 text-xs">Avg Rating</p>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 hidden sm:flex"
                onClick={() => navigate("/upload")}
              >
                + Upload Notes
              </Button>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={TrendingUp} label="This week's uploads" value="8" color="bg-primary-light text-primary" />
          <StatCard icon={Download} label="Total downloads" value={currentUser.stats.downloads} color="bg-teal-light text-teal" />
          <StatCard icon={Star} label="Notes bookmarked" value="12" color="bg-accent-light text-accent" />
          <StatCard icon={Users} label="Groups joined" value={joinedGroups.length} color="bg-success-light text-success" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending notes */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">Trending Notes</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-primary gap-1" onClick={() => navigate("/search")}>
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trendingNotes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </section>

            {/* Recently uploaded */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Recently Uploaded</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-primary gap-1" onClick={() => navigate("/search")}>
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="space-y-3">
                {recentNotes.map(note => (
                  <NoteCard key={note.id} note={note} compact />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Followed groups */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  My Groups
                </h3>
                <Button variant="ghost" size="sm" className="text-primary text-xs gap-1" onClick={() => navigate("/groups")}>
                  All <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {joinedGroups.map(group => (
                  <div key={group.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: group.color + "22" }}>
                      {group.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{group.name}</p>
                      <p className="text-xs text-muted-foreground">{group.members} members · {group.recentUpload}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">{group.notes}</Badge>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 text-primary border-primary/30 hover:bg-primary-light"
                onClick={() => navigate("/groups")}
              >
                Discover more groups
              </Button>
            </div>

            {/* Recommended */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-teal" />
                Recommended for You
              </h3>
              <div className="space-y-3">
                {notes.slice(3, 6).map(note => (
                  <div key={note.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground line-clamp-2">{note.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-accent fill-accent" />
                        <span className="text-xs text-muted-foreground">{note.rating}</span>
                        <span className="text-xs text-muted-foreground">· {note.downloads} dl</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
