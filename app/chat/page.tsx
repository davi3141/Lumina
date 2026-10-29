"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RoomChat } from "@/components/chat/room-chat";
import { INITIAL_ROOMS, INITIAL_MESSAGES, Room } from "@/lib/mock-data";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  const [activeRoom, setActiveRoom] = useState<Room>(INITIAL_ROOMS[0]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Chat em Tempo Real da Turma
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Espaço para tirar dúvidas, debater questões e compartilhar designs do Canva instantaneamente.
          </p>
        </div>

        <RoomChat room={activeRoom} initialMessages={INITIAL_MESSAGES} />
      </div>
    </AppShell>
  );
}
