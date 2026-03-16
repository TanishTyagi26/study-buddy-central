import { Search, Bell, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export default function TopBar({ title, subtitle, showSearch = true }: TopBarProps) {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const avatarInitials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "WN";

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-4 md:px-6 gap-4 shrink-0">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-foreground">WizNotes</span>
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <div>
            <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        {showSearch && !title && (
          <div className="relative max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes, users, subjects..."
              className="pl-9 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
              onClick={() => navigate("/search")}
              readOnly
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="gradient-primary text-white gap-2 shadow-glow hidden sm:flex"
          onClick={() => navigate("/upload")}
        >
          <Plus className="w-4 h-4" />
          Upload
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="w-5 h-5" />
        </Button>

        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden"
          onClick={() => navigate("/profile")}
          style={{ background: profile?.avatar_url ? "transparent" : undefined }}
        >
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full gradient-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">{avatarInitials}</span>
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
