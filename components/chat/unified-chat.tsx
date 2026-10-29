"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Room, PvMessage } from "@/lib/mock-data";
import { Send, Shield, Lock, Users, MessageSquare, ChevronRight, ArrowLeft } from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { cn, formatTimeAgo } from "@/lib/utils";
import { useUser, RoomMemberContact } from "@/lib/user-context";

interface UnifiedChatProps {
  room: Room;
  initialMessages?: ChatMessage[];
  defaultTab?: "room" | "pv";
  targetUserId?: string;
}

export function UnifiedChat({ room, initialMessages = [], defaultTab = "room", targetUserId }: UnifiedChatProps) {
  const {
    user,
    messages: contextMessages,
    sendMessage,
    roomMembers,
    pvMessages,
    sendPvMessage,
    getConversationWith,
  } = useUser();

  const [activeTab, setActiveTab] = useState<"room" | "pv">(defaultTab);
  const [selectedContact, setSelectedContact] = useState<RoomMemberContact | null>(null);

  // Estados de Input
  const [roomInput, setRoomInput] = useState("");
  const [pvInput, setPvInput] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const pvEndRef = useRef<HTMLDivElement>(null);

  // Inicializar contato se fornecido via targetUserId
  useEffect(() => {
    if (targetUserId) {
      const found = roomMembers.find((m) => m.id === targetUserId);
      if (found) {
        setSelectedContact(found);
        setActiveTab("pv");
      }
    } else if (roomMembers.length > 0 && !selectedContact) {
      setSelectedContact(roomMembers[0]);
    }
  }, [targetUserId, roomMembers]);

  // Mensagens da sala
  const activeRoomMessages = contextMessages.filter((m) => m.room_id === room.id);
  const displayRoomMessages = activeRoomMessages.length > 0 ? activeRoomMessages : initialMessages;

  // Mensagens privadas com o contato selecionado
  const activePvMessages = selectedContact ? getConversationWith(selectedContact.id) : [];

  useEffect(() => {
    if (activeTab === "room") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      pvEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab, displayRoomMessages, activePvMessages]);

  const handleSendRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomInput.trim()) return;
    sendMessage(room.id, roomInput.trim());
    setRoomInput("");
  };

  const handleSendPv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pvInput.trim() || !selectedContact) return;
    sendPvMessage(
      selectedContact.id,
      selectedContact.name,
      selectedContact.avatar_url,
      pvInput.trim()
    );
    setPvInput("");
  };

  return (
    <div className="rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 flex flex-col h-[650px] overflow-hidden shadow-sm">
      {/* Header com Segmented Control Apple */}
      <div className="p-3 sm:p-4 border-b border-zinc-300 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-2xl bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
            <button
              onClick={() => setActiveTab("room")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                activeTab === "room"
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Users className="h-3.5 w-3.5" />
              <span>💬 Turma (Geral)</span>
            </button>

            <button
              onClick={() => setActiveTab("pv")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                activeTab === "pv"
                  ? "bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>🔒 Mensagens Privadas (PV)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "room" ? (
            <Badge variant="blue" size="sm">
              Sala: {room.name}
            </Badge>
          ) : (
            <Badge variant="purple" size="sm">
              Conversas 1-a-1
            </Badge>
          )}
        </div>
      </div>

      {/* ABA 1: CHAT DA TURMA (GERAL) */}
      {activeTab === "room" && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {displayRoomMessages.map((msg) => {
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
                    className="h-8 w-8 rounded-xl object-cover shrink-0 ring-1 ring-zinc-300 dark:ring-zinc-700 shadow-xs"
                  />

                  <div className="flex flex-col gap-1">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-[11px]",
                        isCurrentUser ? "justify-end" : ""
                      )}
                    >
                      <span className="font-bold text-zinc-900 dark:text-zinc-200">
                        {msg.user.display_name}
                      </span>
                      <Badge variant={msg.user.role_color} size="sm">
                        {msg.user.custom_role}
                      </Badge>
                      <span className="text-zinc-600 dark:text-zinc-400 text-[10px]">
                        {formatTimeAgo(msg.created_at)}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "p-3 rounded-2xl text-xs leading-relaxed shadow-xs",
                        isCurrentUser
                          ? "bg-blue-600 text-white rounded-tr-none font-medium"
                          : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-tl-none font-medium"
                      )}
                    >
                      <p>{msg.content}</p>
                    </div>

                    {/* Botão para chamar no PV direto do chat público */}
                    {!isCurrentUser && (
                      <button
                        onClick={() => {
                          const contact = roomMembers.find((m) => m.name === msg.user.display_name) || {
                            id: msg.user.id,
                            name: msg.user.display_name,
                            email: msg.user.email,
                            avatar_url: msg.user.avatar_url,
                            role: "membro",
                            bio: "Colega da sala",
                          };
                          setSelectedContact(contact);
                          setActiveTab("pv");
                        }}
                        className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold mt-0.5"
                      >
                        <Lock className="h-2.5 w-2.5" />
                        Conversar no PV
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Form Room Chat */}
          <form
            onSubmit={handleSendRoom}
            className="p-3 sm:p-4 bg-white/80 dark:bg-zinc-900/80 border-t border-zinc-300 dark:border-zinc-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder={`Enviar mensagem para todos em ${room.name}...`}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm font-medium"
            />
            <AppleButton type="submit" variant="primary" size="md" disabled={!roomInput.trim()}>
              <Send className="h-4 w-4" />
            </AppleButton>
          </form>
        </div>
      )}

      {/* ABA 2: CHAT PV (MENSAGENS PRIVADAS 1-A-1) */}
      {activeTab === "pv" && (
        <div className="flex-1 flex overflow-hidden">
          {/* Contatos / Membros da Turma (Sidebar ou lista) */}
          <div
            className={cn(
              "w-full sm:w-64 border-r border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col shrink-0",
              selectedContact ? "hidden sm:flex" : "flex"
            )}
          >
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Colegas de Turma (PV)
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {roomMembers.map((member) => {
                const isSelected = selectedContact?.id === member.id;
                const contactMessages = getConversationWith(member.id);
                const lastMsg = contactMessages[contactMessages.length - 1];

                return (
                  <button
                    key={member.id}
                    onClick={() => setSelectedContact(member)}
                    className={cn(
                      "w-full flex items-center gap-2.5 p-2.5 rounded-2xl text-left apple-spring transition-all cursor-pointer",
                      isSelected
                        ? "bg-purple-600 text-white shadow-xs"
                        : "hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    )}
                  >
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="h-9 w-9 rounded-xl object-cover shrink-0 shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{member.name}</span>
                        {lastMsg && (
                          <span
                            className={cn(
                              "text-[9px]",
                              isSelected ? "text-purple-200" : "text-zinc-400"
                            )}
                          >
                            {formatTimeAgo(lastMsg.created_at)}
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-[10px] truncate",
                          isSelected ? "text-purple-100" : "text-zinc-500 dark:text-zinc-400"
                        )}
                      >
                        {lastMsg ? lastMsg.content : member.bio}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área de Conversa PV com o contato selecionado */}
          {selectedContact ? (
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header do PV */}
              <div className="p-3 px-4 border-b border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="sm:hidden p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <img
                    src={selectedContact.avatar_url}
                    alt={selectedContact.name}
                    className="h-8 w-8 rounded-xl object-cover shadow-2xs"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedContact.name}
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Conversa Privada 1-a-1
                    </span>
                  </div>
                </div>

                <Badge variant="purple" size="sm">
                  Privado
                </Badge>
              </div>

              {/* Mensagens do PV */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activePvMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                    <Lock className="h-8 w-8 text-purple-400 mb-2 opacity-60" />
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Nenhuma mensagem enviada ainda
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Envie um "Oi" para iniciar sua conversa privada com {selectedContact.name}!
                    </p>
                  </div>
                ) : (
                  activePvMessages.map((m) => {
                    const isMe = m.sender_id === user.id;
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%]",
                          isMe ? "ml-auto flex-row-reverse" : ""
                        )}
                      >
                        <img
                          src={isMe ? user.avatar_url : selectedContact.avatar_url}
                          alt="Avatar"
                          className="h-7 w-7 rounded-lg object-cover shrink-0 shadow-2xs"
                        />
                        <div className="space-y-0.5">
                          <div
                            className={cn(
                              "p-3 rounded-2xl text-xs leading-relaxed font-medium shadow-xs",
                              isMe
                                ? "bg-purple-600 text-white rounded-tr-none"
                                : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-tl-none"
                            )}
                          >
                            {m.content}
                          </div>
                          <p
                            className={cn(
                              "text-[9px] text-zinc-400 px-1",
                              isMe ? "text-right" : "text-left"
                            )}
                          >
                            {formatTimeAgo(m.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={pvEndRef} />
              </div>

              {/* Input do PV */}
              <form
                onSubmit={handleSendPv}
                className="p-3 sm:p-4 bg-white/80 dark:bg-zinc-900/80 border-t border-zinc-300 dark:border-zinc-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={pvInput}
                  onChange={(e) => setPvInput(e.target.value)}
                  placeholder={`Mensagem privada para ${selectedContact.name}...`}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm font-medium"
                />
                <AppleButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!pvInput.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </AppleButton>
              </form>
            </div>
          ) : (
            <div className="hidden sm:flex flex-1 items-center justify-center text-zinc-400 text-xs">
              Selecione um colega de turma para abrir o chat privado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
