import MainLayout from "@/components/layout/MainLayout";
import { groups } from "@/data/mockData";
import { Users, BookOpen, Plus, Search, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import NoteCard from "@/components/notes/NoteCard";
import { notes } from "@/data/mockData";

const activityColors: Record<string, string> = {
  "Very Active": "bg-success-light text-success",
  "Active": "bg-primary-light text-primary",
  "Moderate": "bg-accent-light text-accent-foreground",
};

export default function GroupsPage() {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [joinedState, setJoinedState] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map(g => [g.id, g.isJoined]))
  );
  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.subject.toLowerCase().includes(search.toLowerCase())
  );
  const groupNotes = notes.filter(n => n.groupId === selectedGroup.id);

  return (
    <MainLayout title="Groups" subtitle="Discover and join subject groups">
      <div className="flex h-full">
        {/* Groups sidebar */}
        <div className="w-72 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                className="pl-9 bg-secondary border-0 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
            {filtered.map(group => (
              <div
                key={group.id}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  selectedGroup.id === group.id
                    ? "bg-primary-light border border-primary/20"
                    : "hover:bg-secondary"
                }`}
                onClick={() => setSelectedGroup(group)}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: group.color + "22" }}>
                  {group.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${selectedGroup.id === group.id ? "text-primary" : "text-foreground"}`}>
                    {group.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{group.members}</span>
                    <span className="text-xs text-muted-foreground">· {group.notes} notes</span>
                  </div>
                </div>
                {joinedState[group.id] && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Group content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Group header */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: selectedGroup.color + "22" }}>
                  {selectedGroup.emoji}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedGroup.name}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{selectedGroup.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{selectedGroup.members} members</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      <span>{selectedGroup.notes} notes</span>
                    </div>
                    <Badge className={`text-xs ${activityColors[selectedGroup.activity] || "bg-muted text-muted-foreground"}`}>
                      {selectedGroup.activity}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant={joinedState[selectedGroup.id] ? "outline" : "default"}
                className={joinedState[selectedGroup.id] ? "border-primary/30 text-primary" : "gradient-primary text-white shadow-glow"}
                onClick={() => setJoinedState(s => ({ ...s, [selectedGroup.id]: !s[selectedGroup.id] }))}
              >
                {joinedState[selectedGroup.id] ? "✓ Joined" : <><Plus className="w-4 h-4 mr-1" /> Join Group</>}
              </Button>
            </div>
          </div>

          {/* Notes feed */}
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Notes in this Group</h3>
            <Badge variant="secondary">{groupNotes.length || notes.length}</Badge>
          </div>

          {groupNotes.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {groupNotes.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {notes.slice(0, 4).map(note => <NoteCard key={note.id} note={note} />)}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
