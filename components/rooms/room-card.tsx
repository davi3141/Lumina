"use client";

import React, { useState } from "react";
import { Room } from "@/lib/mock-data";
import { Users, Copy, Check, Settings, ArrowRight, BookOpen } from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AdminModal } from "./admin-modal";

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
  isActive?: boolean;
}

export function RoomCard({ room, onSelect, isActive }: RoomCardProps) {
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

  return (
    <>
      <div
        onClick={() => onSelect(room)}
        className={`rounded-3xl glass-panel p-6 border flex flex-col justify-between cursor-pointer apple-spring transition-all group relative overflow-hidden ${
          isActive
            ? "ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10"
            : "hover:shadow-md hover:scale-[1.01]"
        }`}
      >
        {/* Subtle ambient banner tint */}
        <div
          className={`absolute top-0 right-0 left-0 h-2 bg-gradient-to-r ${room.banner_gradient}`}
        />

        <div>
          {/* Top Info */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <Badge variant="blue" size="sm">
              {room.subject}
            </Badge>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-xl glass-subtle text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 hover:text-blue-500 apple-spring flex items-center gap-1 cursor-pointer"
                title="Copiar código de convite da sala"
              >
                <span>{room.invite_code}</span>
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3 text-zinc-400" />
                )}
              </button>

              <AppleButton
                variant="ghost"
                size="icon"
                onClick={handleOpenAdmin}
                title="Painel de Administração"
                className="h-7 w-7"
              >
                <Settings className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
              </AppleButton>
            </div>
          </div>

          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 apple-spring line-clamp-1">
            {room.name}
          </h3>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-200/50 dark:border-zinc-800/60 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{room.members_count} estudantes</span>
          </div>

          <span className="text-blue-500 font-medium flex items-center gap-1 group-hover:translate-x-1 apple-spring">
            <span>Acessar</span>
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
