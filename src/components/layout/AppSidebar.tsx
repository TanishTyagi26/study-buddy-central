import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home, Users, Upload, MessageCircle, Bell, User,
  BookOpen, Star, Search, ChevronLeft, ChevronRight,
  Layers, GraduationCap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { currentUser } from "@/data/mockData";

const navItems = [
  { icon: Home, label: "Home", path: "/", exact: true },
  { icon: Users, label: "Groups", path: "/groups" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: Upload, label: "Upload", path: "/upload" },
  { icon: MessageCircle, label: "Chat", path: "/chat", badge: 3 },
  { icon: Bell, label: "Notifications", path: "/notifications", badge: 3 },
  { icon: Star, label: "Bookmarks", path: "/bookmarks" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } shrink-0 relative`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sidebar-accent-foreground font-bold text-base leading-none">NoteShare</p>
            <p className="text-sidebar-foreground text-xs mt-0.5 opacity-70">Study Together</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-sidebar-primary" : ""}`} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                {item.badge && !collapsed && (
                  <Badge className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0 min-w-[1.2rem] h-5 flex items-center justify-center">
                    {item.badge}
                  </Badge>
                )}
                {item.badge && collapsed && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className={`border-t border-sidebar-border p-3 ${collapsed ? "flex justify-center" : ""}`}>
        <NavLink to="/profile" className={`flex items-center gap-3 rounded-xl p-2 hover:bg-sidebar-accent/50 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: currentUser.avatarColor }}
          >
            {currentUser.avatar}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-accent-foreground text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-sidebar-foreground text-xs opacity-70 truncate">{currentUser.department}</p>
            </div>
          )}
        </NavLink>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar-accent border border-sidebar-border rounded-full flex items-center justify-center text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
