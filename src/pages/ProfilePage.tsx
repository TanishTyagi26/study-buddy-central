import MainLayout from "@/components/layout/MainLayout";
import { currentUser, notes } from "@/data/mockData";
import { Star, Download, Upload, TrendingUp, Users, Edit, BookmarkCheck, Clock, Award, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoteCard from "@/components/notes/NoteCard";

const StatBadge = ({ icon: Icon, value, label, color }: { icon: typeof Star; value: string | number; label: string; color: string }) => (
  <div className="bg-card rounded-2xl border border-border p-4 text-center">
    <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
  </div>
);

export default function ProfilePage() {
  const bookmarkedNotes = notes.filter(n => n.isBookmarked);
  const uploadedNotes = notes.slice(0, 3);
  const downloadedNotes = notes.slice(1, 4);

  const engagementLevel =
    currentUser.stats.engagement >= 80 ? "Expert" :
    currentUser.stats.engagement >= 60 ? "Active" : "Learner";

  return (
    <MainLayout title="Profile" subtitle="Your personal stats and activity">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Profile header */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Banner */}
          <div className="h-24 gradient-hero relative">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-2 right-8 w-24 h-24 rounded-full bg-white/20 blur-2xl" />
            </div>
          </div>
          {/* Info */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div
                className="w-16 h-16 rounded-2xl border-4 border-card flex items-center justify-center text-white text-xl font-bold shadow-lg"
                style={{ background: currentUser.avatarColor }}
              >
                {currentUser.avatar}
              </div>
              <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary-light">
                <Edit className="w-3.5 h-3.5" />
                Edit Profile
              </Button>
            </div>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
                <p className="text-muted-foreground text-sm">@{currentUser.username}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary">{currentUser.department}</Badge>
                  <Badge variant="secondary">{currentUser.year}</Badge>
                  <Badge variant="secondary">{currentUser.university}</Badge>
                  <Badge className="bg-accent-light text-accent-foreground border-accent/20">
                    <Award className="w-3 h-3 mr-1" />
                    {engagementLevel}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-3 max-w-md">{currentUser.bio}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{currentUser.stats.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{currentUser.stats.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBadge icon={Upload} value={currentUser.stats.uploads} label="Notes Uploaded" color="bg-primary-light text-primary" />
          <StatBadge icon={Download} value={currentUser.stats.downloads} label="Total Downloads" color="bg-teal-light text-teal" />
          <StatBadge icon={Star} value={currentUser.stats.ratingsReceived} label="Avg Rating" color="bg-accent-light text-accent" />
          <StatBadge icon={TrendingUp} value={`${currentUser.stats.engagement}%`} label="Engagement" color="bg-success-light text-success" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="uploads">
          <TabsList className="bg-secondary rounded-xl p-1 w-full grid grid-cols-4">
            <TabsTrigger value="uploads" className="rounded-lg text-xs sm:text-sm">
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Uploads
            </TabsTrigger>
            <TabsTrigger value="downloads" className="rounded-lg text-xs sm:text-sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Downloads
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="rounded-lg text-xs sm:text-sm">
              <BookmarkCheck className="w-3.5 h-3.5 mr-1.5" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg text-xs sm:text-sm">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="uploads" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {uploadedNotes.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {downloadedNotes.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
          </TabsContent>

          <TabsContent value="bookmarks" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {bookmarkedNotes.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
            {bookmarkedNotes.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <BookmarkCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No bookmarked notes yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Activity Overview
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Notes Uploaded This Month", value: 8, max: 20, color: "bg-primary" },
                  { label: "Downloads Received", value: 68, max: 100, color: "bg-teal" },
                  { label: "Comments Given", value: 24, max: 50, color: "bg-accent" },
                  { label: "Engagement Score", value: currentUser.stats.engagement, max: 100, color: "bg-success" },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-foreground font-medium">{item.label}</span>
                      <span className="text-muted-foreground">{item.value}/{item.max}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${(item.value / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
