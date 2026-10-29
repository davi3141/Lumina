"use client";

import React, { useState } from "react";
import { Room } from "@/lib/mock-data";
import { Users, Copy, Check, Settings, ArrowRight, Crown } from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AdminModal } from "./admin-modal";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";

interface RoomCardProps {
  room: Room;
  onSelect?: (room: Room) => void;
  isActive?: boolean;
}

export function RoomCard({ room, onSelect, isActive }: RoomCardProps) {
  const router = useRouter();
  const { isRoomAdmin } = useUser();
  const [copied, setCopied] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const isAdmin = isRoomAdmin(room.id);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(room.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenAdmin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdminOpen(true);
  };

  const handleCardClick = () => {
    onSelect?.(room);
    router.push(`/rooms/${room.id}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 flex flex-col justify-between cursor-pointer apple-spring transition-all group relative overflow-hidden shadow-sm ${
          isActive
            ? "ring-2 ring-blue-500 shadow-md shadow-blue-500/15"
            : "hover:shadow-lg hover:border-blue-400/50 hover:scale-[1.01]"
        }`}
      >
        {/* 1. Tirinha Superior Personalizada da Sala (Personalizada pelo Admin) */}
        <div
          className="h-3 w-full transition-all"
          style={{ backgroundColor: room.strip_hex || "#3b82f6" }}
        />

        {/* 2. Mini-Banner da Sala com Gradiente Exclusivo e Figurinha */}
        <div
          className={`p-4 sm:p-5 bg-gradient-to-r ${
            room.banner_gradient || "from-blue-600 to-indigo-700"
          } text-white relative flex items-start justify-between gap-3`}
        >
          {/* Sticker / Figurinha e Matéria */}
          <div className="flex items-center gap-2.5">
            <span className="text-3xl p-1.5 rounded-2xl bg-black/20 backdrop-blur-sm shadow-xs border border-white/20 select-none">
              {room.sticker || "📚"}
            </span>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-sm text-white/90 uppercase tracking-wider border border-white/10">
                {room.subject}
              </span>
              {isAdmin && (
                <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold mt-1 drop-shadow-xs">
                  <Crown className="h-3 w-3" />
                  <span>Admin</span>
                </div>
              )}
            </div>
          </div>

          {/* Código de Convite & Admin */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-xl bg-black/30 hover:bg-black/45 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold text-white transition-all flex items-center gap-1 cursor-pointer"
              title="Copiar código de convite da sala"
            >
              <span>{room.invite_code}</span>
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3 text-white/80" />
              )}
            </button>

            <button
              onClick={handleOpenAdmin}
              title="Painel de Administração da Sala"
              className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white/80 hover:text-white transition-all"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Corpo do Card */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 apple-spring line-clamp-1">
              {room.name}
            </h3>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1.5 line-clamp-2 leading-relaxed font-medium">
              {room.description}
            </p>
          </div>

          {/* 4. Rodapé do Card */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-semibold">{room.members_count} estudantes</span>
            </div>

            <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 group-hover:translate-x-1 apple-spring">
              <span>Entrar na Sala</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        room={room}
      />
    </>
  );
}
