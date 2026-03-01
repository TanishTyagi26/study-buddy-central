import MainLayout from "@/components/layout/MainLayout";
import { notifications } from "@/data/mockData";
import { MessageCircle, Star, Upload, Heart, Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  comment: { icon: MessageCircle, color: "text-primary", bg: "bg-primary-light" },
  rating: { icon: Star, color: "text-accent", bg: "bg-accent-light" },
  upload: { icon: Upload, color: "text-teal", bg: "bg-teal-light" },
  message: { icon: MessageCircle, color: "text-success", bg: "bg-success-light" },
  like: { icon: Heart, color: "text-red-500", bg: "bg-red-50" },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notifications);
  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <MainLayout title="Notifications" subtitle={`${unreadCount} unread notifications`}>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header actions */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">{unreadCount} new</Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-primary gap-2" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
          </div>
        )}

        <div className="space-y-2">
          {notifs.map(notif => {
            const config = typeConfig[notif.type] || typeConfig.comment;
            const TypeIcon = config.icon;

            return (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-sm ${
                  notif.read
                    ? "bg-card border-border"
                    : "bg-primary-light/60 border-primary/20"
                }`}
                onClick={() => markRead(notif.id)}
              >
                {/* User avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: notif.user.color }}
                  >
                    {notif.user.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${config.bg} flex items-center justify-center border-2 border-background`}>
                    <TypeIcon className={`w-2.5 h-2.5 ${config.color}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{notif.user.name}</span>{" "}
                    {notif.message}
                    {notif.noteTitle && (
                      <span className="text-primary font-medium"> "{notif.noteTitle}"</span>
                    )}
                  </p>
                  {notif.detail && (
                    <p className="text-xs text-muted-foreground mt-1 bg-secondary px-2 py-1 rounded-lg inline-block">
                      "{notif.detail}"
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                </div>

                {/* Unread dot */}
                <div className="shrink-0 mt-1">
                  {!notif.read ? (
                    <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                  ) : (
                    <Check className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {notifs.every(n => n.read) && (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">You're all caught up!</p>
            <p className="text-sm mt-1">No new notifications</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
