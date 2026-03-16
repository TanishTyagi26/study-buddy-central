import MainLayout from "@/components/layout/MainLayout";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, Trash2, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { signOut, profile } = useAuth();

  return (
    <MainLayout title="Settings" subtitle="Manage your preferences">
      <div className="p-4 md:p-6 max-w-2xl mx-auto pb-20 md:pb-6 space-y-4">
        {/* Appearance */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sun className="w-4 h-4 text-accent" />
            Appearance
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  theme === "light" ? "border-primary bg-primary-light" : "border-border hover:border-primary/30"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center">
                  <Sun className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Light</p>
                  <p className="text-xs text-muted-foreground">Bright & clean</p>
                </div>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  theme === "dark" ? "border-primary bg-primary-light" : "border-border hover:border-primary/30"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-slate-300" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Dark</p>
                  <p className="text-xs text-muted-foreground">Easy on the eyes</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Notifications
          </h3>
          <div className="space-y-3">
            {[
              { label: "Likes on your notes", desc: "Get notified when someone likes your note" },
              { label: "Comments", desc: "Get notified about new comments" },
              { label: "New messages", desc: "Get notified about new chat messages" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            Account
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
              <div>
                <p className="text-sm font-medium text-foreground">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">{profile?.role || "student"} · @{profile?.username}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={signOut}
              className="w-full gap-2 text-muted-foreground hover:text-destructive hover:border-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* About */}
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold">W</span>
          </div>
          <p className="font-bold text-foreground">WizNotes</p>
          <p className="text-xs text-muted-foreground mt-1">The smart platform for sharing study notes</p>
          <p className="text-xs text-muted-foreground mt-1">v1.0.0</p>
        </div>
      </div>
    </MainLayout>
  );
}
