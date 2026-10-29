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
  Bot,
  ArrowUpRight,
  MessageSquare,
  Shield,
  Copy,
  Check,
  HelpCircle,
  DoorOpen,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user, selectedRoom, tasks, messages, pvMessages, setShowLoginModal } = useUser();
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
                  (Alterar seu nome ou avatar animal)
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
                . Acompanhe os prazos definidos pelo Admin no mural, converse com os colegas na sala ou no PV e tire dúvidas com a Lumi IA.
              </p>

              {/* Invite Code Quick Pill */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <div className="px-3.5 py-2 rounded-2xl glass-subtle border border-zinc-300 dark:border-zinc-700 text-xs flex items-center gap-2">
                  <span className="text-zinc-600 dark:text-zinc-400 font-medium">Código de Convite:</span>
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
                <AppleButton variant="primary" size="md" className="w-full font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white">
                  <DoorOpen className="h-4 w-4" />
                  <span>Acessar Sala (Ver Tudo)</span>
                </AppleButton>
              </Link>

              <Link href="/tasks">
                <AppleButton variant="glass" size="md" className="w-full">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span>Mural de Prazos</span>
                </AppleButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Guide Quick Banner */}
        <section className="rounded-3xl glass-panel p-5 sm:p-6 border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Guia do Usuário
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold">
                  Simples & Direto
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                Como Usar Todas as Funções do Lumina
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Saiba como funciona a permissão de administrador, prazos do mural, chat privado e a Lumi IA.
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
          <div className="p-5 rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 flex items-center gap-4 shadow-2xs">
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">Prazos no Mural</p>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {tasks.filter((t) => t.status !== "completed").length}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 flex items-center gap-4 shadow-2xs">
            <div className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">Lumi IA</p>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                Online
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 flex items-center gap-4 shadow-2xs">
            <div className="h-11 w-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">Chat PV</p>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {pvMessages.length} msg
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 flex items-center gap-4 shadow-2xs">
            <div className="h-11 w-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">Membros na Sala</p>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
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

          {/* Right: Lumi IA Preview & Chat Snippet */}
          <div className="lg:col-span-5 space-y-6">
            {/* Lumi IA Showcase Card */}
            <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Lumi IA • Tira-Dúvidas
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Explicações fáceis e sem termos difíceis
                    </p>
                  </div>
                </div>
                <Link href="/lumi">
                  <AppleButton variant="glass" size="sm">
                    <span>Conversar</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </AppleButton>
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
                🐾 <em>"Precisa de ajuda com alguma matéria ou não sabe como começar a estudar? Me pergunte qualquer coisa que eu explico bem mastigadinho!"</em>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <Link
                  href="/lumi"
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 transition-all shrink-0 border border-zinc-200 dark:border-zinc-700"
                >
                  💡 Como dividir meu tempo?
                </Link>
                <Link
                  href="/lumi"
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 transition-all shrink-0 border border-zinc-200 dark:border-zinc-700"
                >
                  📝 Dica para resumir
                </Link>
              </div>
            </div>

            {/* Chat em Tempo Real & PV Teaser */}
            <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Chat da Sala & PV
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Mensagens com a turma e 1-a-1
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
                    content: `Olá pessoal! Bem-vindos ao mural e chat da sala.`,
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
                      className="h-7 w-7 rounded-xl object-cover shrink-0 shadow-2xs"
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
