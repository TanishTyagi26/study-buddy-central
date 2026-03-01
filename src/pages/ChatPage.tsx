import MainLayout from "@/components/layout/MainLayout";
import { chats } from "@/data/mockData";
import { Send, Smile, Paperclip, Search, MoreVertical, Phone, Video } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(chats[0].messages);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: String(prev.length + 1),
      from: "me",
      text: message,
      time: "Now",
    }]);
    setMessage("");
  };

  const handleSelectChat = (chat: typeof chats[0]) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
  };

  return (
    <MainLayout title="Messages" subtitle="Chat with friends and group members">
      <div className="flex h-full">
        {/* Chat list */}
        <div className="w-72 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search chats..." className="pl-9 bg-secondary border-0 text-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-border/50 ${
                  selectedChat.id === chat.id ? "bg-primary-light" : "hover:bg-secondary"
                }`}
                onClick={() => handleSelectChat(chat)}
              >
                <div className="relative shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: chat.user.color }}
                  >
                    {chat.user.avatar}
                  </div>
                  {chat.user.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium truncate ${selectedChat.id === chat.id ? "text-primary" : "text-foreground"}`}>
                      {chat.user.name}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 font-bold">
                    {chat.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="h-16 border-b border-border flex items-center px-6 gap-3 bg-card shrink-0">
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: selectedChat.user.color }}
              >
                {selectedChat.user.avatar}
              </div>
              {selectedChat.user.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-card rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">{selectedChat.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedChat.user.online ? "🟢 Online" : "Last seen recently"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon"><Phone className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                {msg.from !== "me" && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto shrink-0"
                    style={{ background: selectedChat.user.color }}
                  >
                    {selectedChat.user.avatar}
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-md ${msg.from === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.from === "me"
                        ? "gradient-primary text-white rounded-br-md"
                        : "bg-card border border-border text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="border-t border-border p-4 bg-card">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                className="flex-1 bg-secondary border-0 rounded-xl"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="button" variant="ghost" size="icon" className="shrink-0">
                <Smile className="w-5 h-5" />
              </Button>
              <Button type="submit" size="icon" className="gradient-primary text-white shrink-0 shadow-glow" disabled={!message.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
