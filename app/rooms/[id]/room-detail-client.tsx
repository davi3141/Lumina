"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useUser } from "@/lib/user-context";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AdminModal } from "@/components/rooms/admin-modal";
import { DeadlineWidget } from "@/components/dashboard/deadline-widget";
import { UnifiedChat } from "@/components/chat/unified-chat";
import {
  Users,
  Copy,
  Check,
  Settings,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Share2,
  Lock,
  Crown,
  Shield,
} from "lucide-react";
import Link from "next/link";

interface RoomDetailClientProps {
  roomId: string;
}

export default function RoomDetailClient({ roomId }: RoomDetailClientProps) {
  const { rooms, user, tasks, isRoomAdmin, roomMembers } = useUser();

  const [activeTab, setActiveTab] = useState<"all" | "tasks" | "chat" | "pv" | "members">("all");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [targetPvUser, setTargetPvUser] = useState<string | undefined>(undefined);

  // Encontra a sala atual nos dados do usuário ou usa a primeira disponível
  const room = rooms.find((r) => r.id === roomId) || rooms[0];

  const handleCopyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!room) {
    return (
      <AppShell>
        <div className="text-center py-20 space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Sala não encontrada
          </h2>
          <Link href="/rooms">
            <AppleButton variant="primary" size="md">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para as Salas</span>
            </AppleButton>
          </Link>
        </div>
      </AppShell>
    );
  }

  const isAdmin = isRoomAdmin(room.id);
  // Tarefas desta sala específica
  const roomTasks = tasks.filter((t) => t.room_id === room.id || room.id === "sala-principal");

  const startPvWith = (memberId: string) => {
    setTargetPvUser(memberId);
    setActiveTab("pv");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back navigation & Room Header Banner */}
        <div className="flex items-center justify-between">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 apple-spring"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para todas as salas</span>
          </Link>

          <div className="flex items-center gap-2">
            <AppleButton
              variant="glass"
              size="sm"
              onClick={handleCopyCode}
              className="text-xs font-semibold"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-blue-500" />
                  <span>Código: <strong className="font-mono text-blue-600 dark:text-blue-400">{room.invite_code}</strong></span>
                </>
              )}
            </AppleButton>

            {/* Botão Admin com destaque */}
            <AppleButton
              variant={isAdmin ? "primary" : "glass"}
              size="sm"
              onClick={() => setIsAdminOpen(true)}
              title="Configurações e Gestão da Sala"
              className={isAdmin ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
            >
              {isAdmin ? <Crown className="h-3.5 w-3.5" /> : <Settings className="h-3.5 w-3.5" />}
              <span>{isAdmin ? "Painel do Admin 👑" : "Ver Admin"}</span>
            </AppleButton>
          </div>
        </div>

        {/* Room Main Card Banner (High Contrast) */}
        <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-zinc-300 dark:border-zinc-800 shadow-md">
          <div className={`absolute top-0 right-0 left-0 h-3 bg-gradient-to-r ${room.banner_gradient || "from-blue-600 to-purple-600"}`} />

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="blue" size="md">
                  {room.subject}
                </Badge>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
                  {room.members_count} aluno(s) na turma
                </span>
                {isAdmin && (
                  <Badge variant="purple" size="sm">
                    <Crown className="h-3 w-3" /> Você é o Criador / Admin
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                {room.name}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Quick stats / Share pill */}
            <div className="p-4 rounded-2xl glass-subtle border border-zinc-300 dark:border-zinc-700 shrink-0 text-center space-y-1">
              <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block uppercase tracking-wider">
                Código de Entrada
              </span>
              <p className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">
                {room.invite_code}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                Passe aos colegas para entrarem
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs to Switch Views */}
        <div className="flex rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/80 p-1.5 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 ${
              activeTab === "all"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Visão Geral Completa
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "tasks"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Mural de Prazos ({roomTasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "chat"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat da Turma</span>
          </button>
          <button
            onClick={() => setActiveTab("pv")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "pv"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Lock className="h-3.5 w-3.5 text-purple-500" />
            <span>Mensagens Privadas (PV)</span>
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "members"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Colegas & Cargos ({roomMembers.length + 1})</span>
          </button>
        </div>

        {/* Tab Content: All-in-one Overview */}
        {(activeTab === "all" || activeTab === "tasks") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={activeTab === "tasks" ? "lg:col-span-12" : "lg:col-span-7"}>
              <DeadlineWidget initialTasks={roomTasks} />
            </div>

            {activeTab === "all" && (
              <div className="lg:col-span-5 space-y-6">
                {/* Chat Sneak Peek Box */}
                <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Chat da Turma & PV
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("chat")}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Abrir Completo ↗
                    </button>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Converse com os outros alunos ou inicie um chat privado direto no PV com qualquer colega.
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <AppleButton
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveTab("chat")}
                      className="justify-center text-xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chat Geral</span>
                    </AppleButton>

                    <AppleButton
                      variant="glass"
                      size="sm"
                      onClick={() => setActiveTab("pv")}
                      className="justify-center text-xs text-purple-600 dark:text-purple-400"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Chat PV (Privado)</span>
                    </AppleButton>
                  </div>
                </div>

                {/* Colegas Rápidos */}
                <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-3 shadow-xs">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                    <span>Colegas na Sala</span>
                    <button
                      onClick={() => setActiveTab("members")}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Ver Todos
                    </button>
                  </h3>

                  <div className="space-y-2">
                    {roomMembers.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={m.avatar_url}
                            alt={m.name}
                            className="h-8 w-8 rounded-lg object-cover shadow-2xs"
                          />
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            {m.name}
                          </span>
                        </div>
                        <button
                          onClick={() => startPvWith(m.id)}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Lock className="h-2.5 w-2.5" />
                          PV
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Dedicated Chat (Geral) */}
        {activeTab === "chat" && (
          <UnifiedChat room={room} defaultTab="room" />
        )}

        {/* Tab Content: Dedicated Chat (PV) */}
        {activeTab === "pv" && (
          <UnifiedChat room={room} defaultTab="pv" targetUserId={targetPvUser} />
        )}

        {/* Tab Content: Members & PV trigger */}
        {activeTab === "members" && (
          <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Participantes & Cargos da Sala
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Clique em "Conversar no PV" para abrir um chat particular com qualquer colega.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <AppleButton
                    variant="primary"
                    size="sm"
                    onClick={() => setIsAdminOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    <span>Gerenciar Cargos (Admin)</span>
                  </AppleButton>
                )}
                <AppleButton variant="glass" size="sm" onClick={handleCopyCode}>
                  <Share2 className="h-3.5 w-3.5 text-blue-500" />
                  <span>Código de Convite</span>
                </AppleButton>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {/* O usuário atual */}
              <div className="p-3.5 rounded-2xl glass-subtle border border-zinc-300 dark:border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-500 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-zinc-900 dark:text-zinc-100">
                        {user.display_name}
                      </strong>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 font-bold">
                        (Você)
                      </span>
                      {isAdmin && (
                        <Badge variant="purple" size="sm">
                          <Crown className="h-2.5 w-2.5" /> Admin da Sala
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      {user.email} • {user.custom_role}
                    </span>
                  </div>
                </div>

                <Badge variant={user.role_color} size="sm">
                  {user.custom_role}
                </Badge>
              </div>

              {/* Colegas da turma */}
              {roomMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-2xl glass-subtle border border-zinc-200 dark:border-zinc-800 flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="h-10 w-10 rounded-xl object-cover shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-zinc-900 dark:text-zinc-100">
                          {member.name}
                        </strong>
                        <Badge
                          variant={
                            member.role === "admin"
                              ? "purple"
                              : member.role === "moderator"
                              ? "emerald"
                              : "zinc"
                          }
                          size="sm"
                        >
                          {member.role === "admin"
                            ? "Administrador"
                            : member.role === "moderator"
                            ? "Moderador"
                            : "Membro"}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {member.bio}
                      </span>
                    </div>
                  </div>

                  <AppleButton
                    variant="glass"
                    size="sm"
                    onClick={() => startPvWith(member.id)}
                    className="text-purple-600 dark:text-purple-400 font-bold"
                  >
                    <Lock className="h-3 w-3" />
                    <span>Conversar no PV</span>
                  </AppleButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Modal */}
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          room={room}
        />
      </div>
    </AppShell>
  );
}
