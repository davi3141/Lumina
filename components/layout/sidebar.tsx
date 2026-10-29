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
  Bot,
  User,
  Shield,
  Layers,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { name: "Início", href: "/", icon: LayoutDashboard, color: "text-blue-500 bg-blue-500/10" },
  { name: "Salas de Aula", href: "/rooms", icon: DoorOpen, color: "text-indigo-500 bg-indigo-500/10" },
  { name: "Mural de Prazos", href: "/tasks", icon: CheckSquare, color: "text-emerald-500 bg-emerald-500/10" },
  { name: "Chat & PV", href: "/chat", icon: MessageSquare, color: "text-sky-500 bg-sky-500/10" },
  { name: "Lumi IA (Tira-Dúvidas)", href: "/lumi", icon: Bot, color: "text-amber-500 bg-amber-500/10", badge: "IA" },
  { name: "Caderno Pessoal", href: "/notes", icon: FileText, color: "text-purple-500 bg-purple-500/10" },
  { name: "Feed de Resumos", href: "/summaries", icon: Sparkles, color: "text-rose-500 bg-rose-500/10" },
  { name: "Meu Perfil", href: "/profile", icon: User, color: "text-zinc-500 bg-zinc-500/10" },
  { name: "Como Usar (Guia)", href: "/guide", icon: HelpCircle, color: "text-teal-500 bg-teal-500/10" },
];

export function Sidebar({ mobileOpen = false, setMobileOpen }: { mobileOpen?: boolean; setMobileOpen?: (v: boolean) => void }) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 glass-panel border-r border-zinc-300 dark:border-zinc-800 p-5 flex flex-col justify-between apple-spring transition-transform md:translate-x-0 shadow-lg md:shadow-none",
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
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-blue-500/25 group-hover:scale-105 apple-spring flex items-center justify-center text-white">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                Lumina
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  ESTUDOS
                </span>
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Campus Colaborativo</p>
            </div>
          </Link>

          {/* Navigation Links with vibrant icon badges */}
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen?.(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold apple-spring transition-all group",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        isActive ? "bg-white/20 text-white" : item.color
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                        isActive
                          ? "bg-white text-blue-600"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
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
            className="flex items-center gap-3 p-2.5 rounded-2xl glass-subtle border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 apple-spring"
          >
            <img
              src={user.avatar_url}
              alt={user.display_name}
              className="h-10 w-10 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-xs"
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
