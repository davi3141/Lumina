"use client";

import React, { useState } from "react";
import {
  Menu,
  KeyRound,
  Bell,
  ChevronDown,
  Sparkles,
  Check,
  HelpCircle,
  Bot,
} from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { JoinRoomModal } from "@/components/rooms/join-room-modal";
import { InteractiveGuideModal } from "@/components/guide/interactive-guide-modal";
import { Room } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/user-context";
import Link from "next/link";

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
  const { rooms, user, setShowLoginModal } = useUser();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 glass-panel border-b border-zinc-300 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between">
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-subtle border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 apple-spring cursor-pointer text-left"
            >
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="hidden sm:block">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-normal leading-tight">
                  Sala Selecionada
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[180px] block">
                  {selectedRoom.name}
                </span>
              </div>
              <span className="sm:hidden text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">
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
                <div className="absolute left-0 mt-2 w-72 glass-dropdown rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 border border-zinc-300 dark:border-zinc-700">
                  <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-3 py-1.5">
                    Minhas Salas de Aula
                  </p>
                  <div className="space-y-1">
                    {rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => {
                          onSelectRoom(room);
                          setRoomDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 apple-spring text-left cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {room.name}
                          </p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400">
                            Código: {room.invite_code} • {room.members_count} alunos
                          </span>
                        </div>
                        {selectedRoom?.id === room.id && (
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
          {/* Lumi IA Link */}
          <Link
            href="/lumi"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold apple-spring transition-all"
          >
            <Bot className="h-3.5 w-3.5 text-amber-500" />
            <span>Lumi IA</span>
          </Link>

          {/* Guide Quick Button */}
          <AppleButton
            variant="glass"
            size="sm"
            onClick={() => setGuideModalOpen(true)}
            className="hidden sm:inline-flex"
            title="Como usar todas as tarefas"
          >
            <HelpCircle className="h-3.5 w-3.5 text-purple-500" />
            <span>Como Usar</span>
          </AppleButton>

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
              <Bell className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
            </AppleButton>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-3xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 border border-zinc-300 dark:border-zinc-700">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Notificações do Mural
                    </h4>
                    <span className="text-[10px] text-blue-500 font-medium cursor-pointer">
                      Marcar lidas
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        ⏰ Prazo Iminente
                      </p>
                      <p className="text-[11px] text-zinc-700 dark:text-zinc-300 mt-0.5">
                        Entrega do Trabalho Bimestral vence em breve.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-2xl glass-subtle border border-zinc-200 dark:border-zinc-800">
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">
                        💬 Nova Mensagem no Chat
                      </p>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                        Mariana Costa enviou uma mensagem na sua turma.
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
          <div
            onClick={() => setShowLoginModal(true)}
            className="flex items-center gap-2 pl-2 border-l border-zinc-300 dark:border-zinc-800 cursor-pointer"
            title="Clique para editar seu perfil ou trocar de avatar animal"
          >
            <img
              src={user.avatar_url}
              alt={user.display_name}
              className="h-8 w-8 rounded-xl object-cover ring-2 ring-blue-500/30 shadow-xs"
            />
            <div className="text-left hidden lg:block">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block leading-tight truncate max-w-[110px]">
                {user.display_name}
              </span>
              <Badge variant={user.role_color} size="sm">
                <Sparkles className="h-2 w-2" />
                {user.custom_role}
              </Badge>
            </div>
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

      {/* Interactive Guide Modal */}
      <InteractiveGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </>
  );
}
