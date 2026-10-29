"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Room } from "@/lib/mock-data";
import { Send, Image, ExternalLink, Smile, Shield } from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { cn, formatTimeAgo } from "@/lib/utils";
import { useUser } from "@/lib/user-context";

interface RoomChatProps {
  room: Room;
  initialMessages?: ChatMessage[];
}

export function RoomChat({ room, initialMessages = [] }: RoomChatProps) {
  const { user, messages: contextMessages, sendMessage } = useUser();
  const [inputContent, setInputContent] = useState("");
  const [canvaLink, setCanvaLink] = useState("");
  const [showCanvaInput, setShowCanvaInput] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filtra as mensagens pertencentes a esta sala
  const activeRoomMessages = contextMessages.filter((m) => m.room_id === room.id);
  const displayMessages = activeRoomMessages.length > 0 ? activeRoomMessages : initialMessages;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    sendMessage(room.id, inputContent.trim(), canvaLink.trim() || undefined);
    setInputContent("");
    setCanvaLink("");
    setShowCanvaInput(false);
  };

  return (
    <div className="rounded-3xl glass-panel border flex flex-col h-[650px] overflow-hidden">
      {/* Chat Room Header */}
      <div className="p-4 sm:px-6 border-b border-zinc-200/50 dark:border-zinc-800/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Chat: {room.name}
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Canal em tempo real • {displayMessages.length} mensagens
          </p>
        </div>

        <Badge variant="purple" size="sm">
          Supabase Realtime Ativo
        </Badge>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {displayMessages.map((msg) => {
          const isCurrentUser = msg.user.id === user.id;

          return (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3 max-w-[85%] sm:max-w-[70%]",
                isCurrentUser ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <img
                src={msg.user.avatar_url}
                alt={msg.user.display_name}
                className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-zinc-300 dark:ring-zinc-700"
              />

              <div className="flex flex-col gap-1">
                {/* Meta header */}
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-[11px]",
                    isCurrentUser ? "justify-end" : ""
                  )}
                >
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                    {msg.user.display_name}
                  </span>
                  <Badge variant={msg.user.role_color} size="sm">
                    {msg.user.custom_role}
                  </Badge>
                  <span className="text-zinc-400 text-[10px]">
                    {formatTimeAgo(msg.created_at)}
                  </span>
                </div>

                {/* Speech Bubble Apple-style */}
                <div
                  className={cn(
                    "p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed apple-spring shadow-sm",
                    isCurrentUser
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "glass-subtle text-zinc-800 dark:text-zinc-200 rounded-tl-sm border"
                  )}
                >
                  <p>{msg.content}</p>

                  {/* Canva attachment if present */}
                  {msg.canva_attachment_url && (
                    <a
                      href={msg.canva_attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border apple-spring",
                        isCurrentUser
                          ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
                          : "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20"
                      )}
                    >
                      <span className="font-bold">Canva:</span> Abrir Apresentação
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Canva Link input accordion */}
      {showCanvaInput && (
        <div className="px-4 py-2 border-t border-zinc-200/50 dark:border-zinc-800/60 glass-subtle flex items-center gap-2">
          <input
            type="url"
            value={canvaLink}
            onChange={(e) => setCanvaLink(e.target.value)}
            placeholder="Cole o link do design ou apresentação do Canva..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <AppleButton
            variant="ghost"
            size="sm"
            onClick={() => setShowCanvaInput(false)}
          >
            Cancelar
          </AppleButton>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 border-t border-zinc-200/50 dark:border-zinc-800/60 glass-panel flex items-center gap-2"
      >
        <AppleButton
          type="button"
          variant="glass"
          size="icon"
          onClick={() => setShowCanvaInput(!showCanvaInput)}
          title="Anexar link do Canva"
          className="shrink-0 text-purple-500 hover:text-purple-600"
        >
          <span className="text-xs font-bold font-sans">🎨</span>
        </AppleButton>

        <input
          type="text"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="Tire uma dúvida com a turma..."
          className="flex-1 px-4 py-2.5 rounded-2xl glass-subtle text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />

        <AppleButton
          type="submit"
          variant="primary"
          size="icon"
          disabled={!inputContent.trim()}
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </AppleButton>
      </form>
    </div>
  );
}
