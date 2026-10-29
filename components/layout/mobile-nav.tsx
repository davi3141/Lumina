"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, DoorOpen, CheckSquare, MessageSquare, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_TABS = [
  { name: "Início", href: "/", icon: LayoutDashboard },
  { name: "Salas", href: "/rooms", icon: DoorOpen },
  { name: "Prazos", href: "/tasks", icon: CheckSquare },
  { name: "Chat & PV", href: "/chat", icon: MessageSquare },
  { name: "Lumi IA", href: "/lumi", icon: Bot, highlight: true },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-panel border-t border-zinc-300 dark:border-zinc-800 shadow-xl backdrop-blur-xl bg-white/90 dark:bg-zinc-950/90 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {MOBILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 apple-spring transition-all active:scale-90",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center h-8 w-8 rounded-xl transition-all",
                  isActive
                    ? "bg-blue-600/15 dark:bg-blue-500/20"
                    : tab.highlight
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : ""
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "scale-110" : "")} />
                {tab.highlight && !isActive && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
