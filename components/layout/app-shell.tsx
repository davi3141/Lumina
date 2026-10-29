"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useUser } from "@/lib/user-context";
import { UserOnboardingModal } from "@/components/auth/user-onboarding-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { selectedRoom, setSelectedRoom } = useUser();

  return (
    <div className="min-h-screen flex flex-col md:pl-64 apple-spring">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8 animate-in fade-in duration-300">
          {children}
        </main>
      </div>

      {/* iOS-style Bottom Navigation for Mobile */}
      <MobileNav />

      {/* Onboarding Modal for Custom Profile */}
      <UserOnboardingModal />
    </div>
  );
}
