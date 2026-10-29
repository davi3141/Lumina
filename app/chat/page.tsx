"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RoomChat } from "@/components/chat/room-chat";
import { MessageSquare, Users, DoorOpen } from "lucide-react";
import { useUser } from "@/lib/user-context";
import Link from "next/link";
import { AppleButton } from "@/components/ui/apple-button";

export default function ChatPage() {
  const { selectedRoom, rooms, setSelectedRoom } = useUser();

  const currentRoom = selectedRoom || rooms[0];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <MessageSquare className="h-4 w-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Chat em Tempo Real: {currentRoom?.name || "Minha Sala"}
              </h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Converse com a turma, tire dúvidas e compartilhe links de apresentações do Canva.
            </p>
          </div>

          {/* Quick Room Switcher Pill */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {rooms.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRoom(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold apple-spring cursor-pointer shrink-0 ${
                  r.id === currentRoom?.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "glass-subtle text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {currentRoom && <RoomChat room={currentRoom} />}
      </div>
    </AppShell>
  );
}
