import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { currentUser } from "@/data/mockData";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export default function TopBar({ title, subtitle, showSearch = true }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1 min-w-0">
        {title && (
          <div>
            <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        {showSearch && !title && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes, subjects, topics..."
              className="pl-9 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
              onClick={() => navigate("/search")}
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
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </Button>

        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ background: currentUser.avatarColor }}
          onClick={() => navigate("/profile")}
        >
          {currentUser.avatar}
        </button>
      </div>
    </header>
  );
}
