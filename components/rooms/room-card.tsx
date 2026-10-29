"use client";

import React, { useState } from "react";
import { Room } from "@/lib/mock-data";
import { Users, Copy, Check, Settings, ArrowRight } from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AdminModal } from "./admin-modal";
import { useRouter } from "next/navigation";

interface RoomCardProps {
  room: Room;
  onSelect?: (room: Room) => void;
  isActive?: boolean;
}

export function RoomCard({ room, onSelect, isActive }: RoomCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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
        className={`rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 flex flex-col justify-between cursor-pointer apple-spring transition-all group relative overflow-hidden shadow-sm ${
          isActive
            ? "ring-2 ring-blue-500 shadow-md shadow-blue-500/15"
            : "hover:shadow-lg hover:border-blue-400/50 hover:scale-[1.01]"
        }`}
      >
        {/* Subtle ambient banner tint */}
        <div
          className={`absolute top-0 right-0 left-0 h-2.5 bg-gradient-to-r ${room.banner_gradient || "from-blue-600 to-purple-600"}`}
        />

        <div className="pt-1">
          {/* Top Info */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <Badge variant="blue" size="sm">
              {room.subject}
            </Badge>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-xl glass-subtle border border-zinc-300 dark:border-zinc-700 text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 apple-spring flex items-center gap-1 cursor-pointer"
                title="Copiar código de convite da sala"
              >
                <span>{room.invite_code}</span>
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3 text-zinc-500" />
                )}
              </button>

              <AppleButton
                variant="ghost"
                size="icon"
                onClick={handleOpenAdmin}
                title="Painel de Administração"
                className="h-7 w-7"
              >
                <Settings className="h-3.5 w-3.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
              </AppleButton>
            </div>
          </div>

          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 apple-spring line-clamp-1">
            {room.name}
          </h3>

          <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-2 line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-zinc-500" />
            <span className="font-medium">{room.members_count} estudantes</span>
          </div>

          <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 group-hover:translate-x-1 apple-spring">
            <span>Acessar Sala</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
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
