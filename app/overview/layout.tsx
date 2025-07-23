"use client"
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
        <div className="">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className={`transition-all duration-300 ${sidebarCollapsed ? "ml-14" : "ml-64"}`}>
            <div className="flex h-full">
              {children}
            </div>
          </main>
        </div>
  );
}
