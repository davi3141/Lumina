"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { UnifiedChat } from "@/components/chat/unified-chat";
import { MessageSquare } from "lucide-react";
import { useUser } from "@/lib/user-context";

export default function ChatPage() {
  const { selectedRoom, rooms, setSelectedRoom } = useUser();
  const currentRoom = selectedRoom || rooms[0];

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20 shadow-xs">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Chat & Mensagens Privadas (PV)
              </h1>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Converse com toda a turma ou mande mensagem direta 1-a-1 no PV de qualquer colega.
            </p>
          </div>

          {/* Quick Room Switcher Pill */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {rooms.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRoom(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold apple-spring cursor-pointer shrink-0 transition-all ${
                  r.id === currentRoom?.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "glass-subtle text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {currentRoom ? (
          <UnifiedChat room={currentRoom} />
        ) : (
          <div className="p-8 text-center text-zinc-500 text-sm">
            Nenhuma sala selecionada.
          </div>
        )}
      </div>
    </AppShell>
  );
}
