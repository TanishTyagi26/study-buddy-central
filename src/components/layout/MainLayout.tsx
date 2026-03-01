import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export default function MainLayout({ children, title, subtitle, showSearch }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar title={title} subtitle={subtitle} showSearch={showSearch} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
