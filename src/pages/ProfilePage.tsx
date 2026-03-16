import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoteCard, { NoteWithProfile } from "@/components/notes/NoteCard";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Upload, Download, BookmarkCheck, Camera, MessageCircle } from "lucide-react";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const targetId = userId || user?.id;
  const isOwn = !userId || userId === user?.id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [notes, setNotes] = useState<NoteWithProfile[]>([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", bio: "", role: "student" });
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [stats, setStats] = useState({ uploads: 0, totalDownloads: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (targetId) { fetchProfile(targetId); fetchNotes(targetId); }
  }, [targetId]);

  const fetchProfile = async (id: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (data) { setProfile(data); setEditForm({ full_name: data.full_name || "", bio: data.bio || "", role: data.role }); }
  };

  const fetchNotes = async (id: string) => {
    const { data, count } = await supabase
      .from("notes").select("*, profiles:user_id(full_name, avatar_url, username, role)", { count: "exact" })
      .eq("user_id", id).order("created_at", { ascending: false });
    if (data) {
      setNotes(data as unknown as NoteWithProfile[]);
      setStats({ uploads: count || 0, totalDownloads: data.reduce((s, n) => s + (n.download_count || 0), 0) });
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: editForm.full_name, bio: editForm.bio, role: editForm.role }).eq("id", user.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Profile updated!" }); fetchProfile(user.id); setEditing(false); }
    setSaving(false);
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setAvatarUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { data, error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(data.path);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      fetchProfile(user.id);
      toast({ title: "Profile picture updated!" });
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setAvatarUploading(false); }
  };

  const avatarInitials = profile?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "WN";

  return (
    <MainLayout title="Profile">
      <div className="p-4 md:p-6 max-w-4xl mx-auto pb-20 md:pb-6 space-y-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="h-24 gradient-hero relative">
            <div className="absolute inset-0 opacity-20"><div className="absolute top-2 right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" /></div>
          </div>
          <div className="px-5 pb-5">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="relative group">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name || "User"} className="w-16 h-16 rounded-2xl border-4 border-card object-cover shadow-lg" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl border-4 border-card gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-lg">{avatarInitials}</div>
                )}
                {isOwn && (
                  <>
                    <button onClick={() => fileInputRef.current?.click()} disabled={avatarUploading}
                      className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {!isOwn && (
                  <Button size="sm" className="gradient-primary text-white gap-1.5" onClick={() => navigate(`/chat/${targetId}`)}>
                    <MessageCircle className="w-3.5 h-3.5" /> Message
                  </Button>
                )}
                {isOwn && !editing && (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5 border-primary/30 text-primary">
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </Button>
                )}
              </div>
            </div>
            {editing ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} className="bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary" />
                </div>
                <div className="space-y-1">
                  <Label>Bio</Label>
                  <Textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} rows={2} className="bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary resize-none" />
                </div>
                <div className="space-y-1">
                  <Label>Role</Label>
                  <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveProfile} disabled={saving} size="sm" className="gradient-primary text-white">{saving ? "Saving..." : "Save"}</Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-foreground">{profile?.full_name || "Anonymous"}</h2>
                <p className="text-muted-foreground text-sm">@{profile?.username || "user"}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="capitalize">{profile?.role || "student"}</Badge>
                </div>
                {profile?.bio && <p className="text-sm text-muted-foreground mt-3 max-w-md">{profile.bio}</p>}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Upload, value: stats.uploads, label: "Notes Uploaded", color: "bg-primary-light text-primary" },
            { icon: Download, value: stats.totalDownloads, label: "Total Downloads", color: "bg-teal-light text-teal" },
            { icon: BookmarkCheck, value: notes.length, label: "Total Notes", color: "bg-accent-light text-accent" },
            { icon: BookmarkCheck, value: profile?.role === "staff" ? "Staff" : "Student", label: "Role", color: "bg-success-light text-success" },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4 text-center">
              <div className={`w-9 h-9 rounded-xl mx-auto flex items-center justify-center mb-2 ${s.color}`}><s.icon className="w-4 h-4" /></div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="uploads">
          <TabsList className="bg-secondary rounded-xl p-1 w-full grid grid-cols-2">
            <TabsTrigger value="uploads" className="rounded-lg"><Upload className="w-3.5 h-3.5 mr-1.5" />Uploads ({stats.uploads})</TabsTrigger>
            <TabsTrigger value="info" className="rounded-lg">Info</TabsTrigger>
          </TabsList>
          <TabsContent value="uploads" className="mt-4">
            {notes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><Upload className="w-10 h-10 mx-auto mb-2 opacity-20" /><p>No notes uploaded yet</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {notes.map(note => <NoteCard key={note.id} note={note} onDelete={() => fetchNotes(targetId!)} />)}
              </div>
            )}
          </TabsContent>
          <TabsContent value="info" className="mt-4">
            <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
              <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Username</p><p className="text-foreground">@{profile?.username || "–"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Role</p><Badge variant="secondary" className="capitalize">{profile?.role || "student"}</Badge></div>
              {profile?.bio && <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Bio</p><p className="text-foreground text-sm">{profile.bio}</p></div>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
