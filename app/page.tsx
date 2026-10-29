"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { NoticeBanner } from "@/components/dashboard/notice-banner";
import { DeadlineWidget } from "@/components/dashboard/deadline-widget";
import { InteractiveGuideModal } from "@/components/guide/interactive-guide-modal";
import { useUser } from "@/lib/user-context";
import {
  INITIAL_NOTICES,
  INITIAL_SUMMARIES,
} from "@/lib/mock-data";
import {
  Sparkles,
  Calendar,
  Users,
  Presentation,
  BookOpen,
  ArrowUpRight,
  MessageSquare,
  Shield,
  Layers,
  Copy,
  Check,
  HelpCircle,
  Lightbulb,
  DoorOpen,
} from "lucide-react";
import Link from "next/link";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user, selectedRoom, tasks, messages, setShowLoginModal } = useUser();
  const [copiedCode, setCopiedCode] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  const handleCopyCode = () => {
    if (!selectedRoom) return;
    navigator.clipboard.writeText(selectedRoom.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Apple-style Hero Section with High Contrast */}
        <section className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 lg:p-10 border border-zinc-300 dark:border-zinc-800 shadow-md">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={user.role_color} size="md">
                  <Shield className="h-3 w-3" />
                  {user.custom_role}
                </Badge>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                >
                  (Alterar seu nome / conta)
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Olá, {user.display_name}!
              </h1>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                Bem-vindo ao seu espaço de estudos. Você está na sala{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-bold">
                  {selectedRoom?.name || "Minha Turma"}
                </strong>
                . Clique no botão de acessar a sala para ver a visão completa com mural, chat e slides Canva.
              </p>

              {/* Invite Code Quick Pill */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <div className="px-3.5 py-2 rounded-2xl glass-subtle border border-zinc-300 dark:border-zinc-700 text-xs flex items-center gap-2">
                  <span className="text-zinc-600 dark:text-zinc-400 font-medium">Código da Sala:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {selectedRoom?.invite_code}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 hover:text-blue-600 apple-spring cursor-pointer"
                    title="Copiar código"
                  >
                    {copiedCode ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-zinc-500" />
                    )}
                  </button>
                </div>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {selectedRoom?.members_count || 1} participante(s)
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-row lg:flex-col gap-2.5 shrink-0">
              <Link href={`/rooms/${selectedRoom?.id || "sala-principal"}`}>
                <AppleButton variant="primary" size="md" className="w-full font-bold shadow-md">
                  <DoorOpen className="h-4 w-4" />
                  <span>Acessar Esta Sala (Ver Tudo)</span>
                </AppleButton>
              </Link>

              <Link href="/tasks">
                <AppleButton variant="glass" size="md" className="w-full">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Mural de Tarefas</span>
                </AppleButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Guide Quick Banner */}
        <section className="rounded-3xl glass-panel p-5 sm:p-6 border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Guia para Iniciantes
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold">
                  7 Ferramentas
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Aprenda a Usar Todas as Tarefas e Recursos da Plataforma
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Passo a passo simples de como marcar prazos, usar o Canva, entrar em salas e escrever no caderno Notion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <AppleButton
              variant="glass"
              size="sm"
              onClick={() => setGuideModalOpen(true)}
            >
              <span>Tour Rápido</span>
            </AppleButton>
            <Link href="/guide">
              <AppleButton variant="primary" size="sm">
                <span>Ver Manual Completo</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </AppleButton>
            </Link>
          </div>
        </section>

        {/* Notice Banner (Pinned Notices) */}
        <section>
          <NoticeBanner notices={INITIAL_NOTICES} />
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl glass-panel border flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Prazos Ativos</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {tasks.filter((t) => t.status !== "completed").length}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel border flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Presentation className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Slides Canva</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                3 Prontos
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel border flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Resumos no Feed</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {INITIAL_SUMMARIES.length}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel border flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Membros da Sala</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {selectedRoom?.members_count || 1}
              </h3>
            </div>
          </div>
        </section>

        {/* Two-Column Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Mural de Atividades e Prazos com Resend */}
          <div className="lg:col-span-7 space-y-6">
            <DeadlineWidget initialTasks={tasks} />
          </div>

          {/* Right: Canva Hub Preview & Chat Snippet */}
          <div className="lg:col-span-5 space-y-6">
            {/* Canva Highlight Card */}
            <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Presentation className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Canva da Sala
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Slides Oficiais da Turma
                    </p>
                  </div>
                </div>
                <Link href="/canva">
                  <AppleButton variant="glass" size="sm">
                    <span>Central</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </AppleButton>
                </Link>
              </div>

              {/* Mini iframe / visual preview */}
              <div className="rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-950">
                <div className="aspect-video w-full bg-zinc-900 flex items-center justify-center">
                  <iframe
                    src={selectedRoom?.canva_presentation_url || "https://www.canva.com/design/DAFv3sI7p9k/view?embed"}
                    title="Apresentação Canva"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-500 font-medium">Design Colaborativo</span>
                <a
                  href={selectedRoom?.canva_presentation_url?.replace("?embed", "") || "https://www.canva.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  Abrir no Canva ↗
                </a>
              </div>
            </div>

            {/* Chat em Tempo Real Teaser */}
            <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Chat da Sala
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Comunicação com a turma
                    </p>
                  </div>
                </div>
                <Link href="/chat">
                  <AppleButton variant="glass" size="sm">
                    <span>Abrir Chat</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </AppleButton>
                </Link>
              </div>

              <div className="space-y-2 pt-1">
                {(messages.length > 0 ? messages.slice(-2) : [
                  {
                    id: "msg-welcome",
                    room_id: selectedRoom?.id || "sala-principal",
                    user: user,
                    content: `Olá pessoal! Bem-vindos à sala ${selectedRoom?.name || "de estudos"}.`,
                    created_at: "2026-10-28T18:00:00Z",
                  }
                ]).map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 rounded-2xl glass-subtle border border-zinc-200 dark:border-zinc-800 text-xs flex items-start gap-2.5"
                  >
                    <img
                      src={msg.user.avatar_url}
                      alt={msg.user.display_name}
                      className="h-6 w-6 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          {msg.user.display_name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {msg.user.custom_role}
                        </span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 truncate mt-0.5">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Guide Tour Modal */}
        <InteractiveGuideModal
          isOpen={guideModalOpen}
          onClose={() => setGuideModalOpen(false)}
        />
      </div>
    </AppShell>
  );
}
