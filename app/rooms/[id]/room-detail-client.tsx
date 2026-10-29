"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useUser } from "@/lib/user-context";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AdminModal } from "@/components/rooms/admin-modal";
import { DeadlineWidget } from "@/components/dashboard/deadline-widget";
import { RoomChat } from "@/components/chat/room-chat";
import {
  Users,
  Copy,
  Check,
  Settings,
  Calendar,
  MessageSquare,
  Presentation,
  ArrowLeft,
  ExternalLink,
  Share2,
} from "lucide-react";
import Link from "next/link";

interface RoomDetailClientProps {
  roomId: string;
}

export default function RoomDetailClient({ roomId }: RoomDetailClientProps) {
  const { rooms, user, tasks, messages } = useUser();

  const [activeTab, setActiveTab] = useState<"all" | "tasks" | "chat" | "canva" | "members">("all");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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

  // Tarefas desta sala específica
  const roomTasks = tasks.filter((t) => t.room_id === room.id || room.id === "sala-principal");
  // Mensagens do chat desta sala
  const roomMessages = messages.filter((m) => m.room_id === room.id);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back navigation & Room Header Banner */}
        <div className="flex items-center justify-between">
          <Link href="/rooms" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 apple-spring">
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

            <AppleButton
              variant="glass"
              size="sm"
              onClick={() => setIsAdminOpen(true)}
              title="Configurações & Painel Administrativo"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Admin da Sala</span>
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
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {room.members_count} participante(s) cadastrado(s)
                </span>
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
              <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block uppercase tracking-wider">
                Convide seus Amigos
              </span>
              <p className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">
                {room.invite_code}
              </p>
              <p className="text-[10px] text-zinc-500">
                Qualquer um com esse código entra na sala
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs to Switch Views */}
        <div className="flex rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/80 p-1.5 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 ${
              activeTab === "all"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Visão Geral Completa
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "tasks"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
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
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat da Turma</span>
          </button>
          <button
            onClick={() => setActiveTab("canva")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "canva"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Presentation className="h-3.5 w-3.5 text-purple-500" />
            <span>Slides Canva</span>
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "members"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Membros</span>
          </button>
        </div>

        {/* Tab Content: All-in-one Overview */}
        {(activeTab === "all" || activeTab === "tasks") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Mural de Tarefas desta Sala */}
            <div className={activeTab === "tasks" ? "lg:col-span-12" : "lg:col-span-7"}>
              <DeadlineWidget initialTasks={roomTasks} />
            </div>

            {/* Right: Canva Presentation & Chat Sneak Peek */}
            {activeTab === "all" && (
              <div className="lg:col-span-5 space-y-6">
                {/* Canva Embed Card */}
                <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Presentation className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          Apresentação da Sala
                        </h3>
                        <p className="text-[11px] text-zinc-500">
                          Canva Slides Oficial
                        </p>
                      </div>
                    </div>

                    <a
                      href={room.canva_presentation_url?.replace("?embed", "") || "https://canva.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-950">
                    <div className="aspect-video w-full bg-zinc-900 flex items-center justify-center">
                      <iframe
                        src={room.canva_presentation_url || "https://www.canva.com/design/DAFv3sI7p9k/view?embed"}
                        title="Apresentação Canva"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Chat Box */}
                <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Chat da Sala
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("chat")}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Abrir Tela Cheia ↗
                    </button>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Converse com os outros alunos cadastrados na sala <strong>{room.name}</strong>.
                  </p>

                  <AppleButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Participar do Chat da Turma</span>
                  </AppleButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Dedicated Chat */}
        {activeTab === "chat" && (
          <RoomChat room={room} initialMessages={roomMessages} />
        )}

        {/* Tab Content: Dedicated Canva */}
        {activeTab === "canva" && (
          <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Slides & Apresentações do Canva
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Visualização ao vivo dos materiais criados no Canva para a turma.
                </p>
              </div>

              <a
                href={room.canva_presentation_url?.replace("?embed", "") || "https://canva.com"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppleButton variant="primary" size="md">
                  <span>Editar no Canva</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </AppleButton>
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-950 shadow-inner">
              <div className="aspect-video w-full bg-zinc-900 flex items-center justify-center">
                <iframe
                  src={room.canva_presentation_url || "https://www.canva.com/design/DAFv3sI7p9k/view?embed"}
                  title="Apresentação Canva"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Members */}
        {activeTab === "members" && (
          <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Participantes da Sala
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Alunos que ingressaram nesta sala com o código <strong>{room.invite_code}</strong>.
                </p>
              </div>

              <AppleButton variant="glass" size="sm" onClick={handleCopyCode}>
                <Share2 className="h-3.5 w-3.5 text-blue-500" />
                <span>Compartilhar Código</span>
              </AppleButton>
            </div>

            <div className="space-y-2 pt-2">
              <div className="p-3.5 rounded-2xl glass-subtle border border-zinc-300 dark:border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-zinc-900 dark:text-zinc-100">
                        {user.display_name}
                      </strong>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 font-bold">
                        (Você)
                      </span>
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
