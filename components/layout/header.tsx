"use client";

import React, { useState } from "react";
import {
  Menu,
  KeyRound,
  Bell,
  ChevronDown,
  Sparkles,
  Check,
} from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { JoinRoomModal } from "@/components/rooms/join-room-modal";
import { INITIAL_ROOMS, CURRENT_USER, Room } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onToggleMobileMenu: () => void;
  selectedRoom: Room;
  onSelectRoom: (room: Room) => void;
}

export function Header({
  onToggleMobileMenu,
  selectedRoom,
  onSelectRoom,
}: HeaderProps) {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 glass-panel border-b border-zinc-200/50 dark:border-zinc-800/60 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile Toggle & Room Selector */}
        <div className="flex items-center gap-3">
          <AppleButton
            variant="ghost"
            size="icon"
            onClick={onToggleMobileMenu}
            className="md:hidden"
            aria-label="Abrir Menu Lateral"
          >
            <Menu className="h-5 w-5" />
          </AppleButton>

          {/* Room Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoomDropdownOpen(!roomDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-subtle hover:bg-white/80 dark:hover:bg-white/10 apple-spring cursor-pointer text-left"
            >
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="hidden sm:block">
                <span className="text-xs text-zinc-400 block font-normal leading-tight">
                  Sala Ativa
                </span>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[180px] block">
                  {selectedRoom.name}
                </span>
              </div>
              <span className="sm:hidden text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">
                {selectedRoom.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 ml-1" />
            </button>

            {roomDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoomDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-72 glass-dropdown rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-3 py-1.5">
                    Minhas Salas de Aula
                  </p>
                  <div className="space-y-1">
                    {INITIAL_ROOMS.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => {
                          onSelectRoom(room);
                          setRoomDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70 apple-spring text-left cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {room.name}
                          </p>
                          <span className="text-[10px] text-zinc-400">
                            Código: {room.invite_code} • {room.members_count} alunos
                          </span>
                        </div>
                        {selectedRoom.id === room.id && (
                          <Check className="h-4 w-4 text-blue-500 shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions, Theme, Notifications, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Join with Code Button */}
          <AppleButton
            variant="glass"
            size="sm"
            onClick={() => setJoinModalOpen(true)}
            className="hidden sm:inline-flex"
          >
            <KeyRound className="h-3.5 w-3.5 text-blue-500" />
            <span>Código de Sala</span>
          </AppleButton>

          {/* Notification Bell */}
          <div className="relative">
            <AppleButton
              variant="glass"
              size="icon"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative"
              aria-label="Notificações"
            >
              <Bell className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
            </AppleButton>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-3xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/50 dark:border-zinc-800/60">
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Notificações do Sistema
                    </h4>
                    <span className="text-[10px] text-blue-500 font-medium cursor-pointer">
                      Marcar lidas
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                      <p className="font-medium text-blue-600 dark:text-blue-400">
                        ⏰ Prazo Iminente
                      </p>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">
                        Apresentação no Canva vence em 48 horas.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-2xl glass-subtle">
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">
                        🎉 Novo Material no Feed
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Helena Duarte publicou o resumo de Clean Architecture.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* User mini status */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-zinc-200/50 dark:border-zinc-800/60">
            <Badge variant={CURRENT_USER.role_color} size="sm">
              <Sparkles className="h-2.5 w-2.5" />
              {CURRENT_USER.custom_role}
            </Badge>
          </div>
        </div>
      </header>

      {/* Join Room Modal */}
      <JoinRoomModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoinSuccess={(name) => {
          alert(`Você agora é membro da sala: ${name}!`);
        }}
      />
    </>
  );
}
