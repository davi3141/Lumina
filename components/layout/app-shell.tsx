"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Room, INITIAL_ROOMS } from "@/lib/mock-data";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room>(INITIAL_ROOMS[0]);

  return (
    <div className="min-h-screen flex flex-col md:pl-64 apple-spring">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
