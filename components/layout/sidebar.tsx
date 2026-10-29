"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DoorOpen,
  CheckSquare,
  FileText,
  MessageSquare,
  Sparkles,
  Palette,
  User,
  Shield,
  Layers,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { name: "Visão Geral", href: "/", icon: LayoutDashboard },
  { name: "Salas de Aula", href: "/rooms", icon: DoorOpen },
  { name: "Mural & Tarefas", href: "/tasks", icon: CheckSquare },
  { name: "Caderno (Notion)", href: "/notes", icon: FileText },
  { name: "Chat em Tempo Real", href: "/chat", icon: MessageSquare },
  { name: "Feed de Resumos", href: "/summaries", icon: Sparkles },
  { name: "Central Canva", href: "/canva", icon: Palette },
  { name: "Meu Perfil", href: "/profile", icon: User },
  { name: "Como Usar (Guia)", href: "/guide", icon: HelpCircle },
];

export function Sidebar({ mobileOpen = false, setMobileOpen }: { mobileOpen?: boolean; setMobileOpen?: (v: boolean) => void }) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 glass-panel border-r border-zinc-200/50 dark:border-zinc-800/60 p-5 flex flex-col justify-between apple-spring transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-6">
          {/* Logo Apple Aesthetic */}
          <Link
            href="/"
            onClick={() => setMobileOpen?.(false)}
            className="flex items-center gap-3 px-2 group cursor-pointer"
          >
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 apple-spring flex items-center justify-center text-white">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                Lumina
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  PRO
                </span>
              </span>
              <p className="text-[11px] text-zinc-400">Campus Colaborativo</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen?.(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium apple-spring transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 apple-spring",
                      isActive ? "text-white scale-110" : "text-zinc-400 group-hover:text-zinc-600"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card Apple Style */}
        <div className="pt-4 border-t border-zinc-300 dark:border-zinc-800">
          <Link
            href="/profile"
            onClick={() => setMobileOpen?.(false)}
            className="flex items-center gap-3 p-2 rounded-2xl glass-subtle border border-zinc-200 dark:border-zinc-800 hover:bg-white/80 dark:hover:bg-white/5 apple-spring"
          >
            <img
              src={user.avatar_url}
              alt={user.display_name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {user.display_name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Badge variant={user.role_color} size="sm">
                  <Shield className="h-2.5 w-2.5" />
                  {user.custom_role}
                </Badge>
              </div>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
