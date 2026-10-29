"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { NoticeBanner } from "@/components/dashboard/notice-banner";
import { DeadlineWidget } from "@/components/dashboard/deadline-widget";
import {
  CURRENT_USER,
  INITIAL_ROOMS,
  INITIAL_NOTICES,
  INITIAL_TASKS,
  INITIAL_MESSAGES,
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
} from "lucide-react";
import Link from "next/link";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [activeRoom, setActiveRoom] = useState(INITIAL_ROOMS[0]);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeRoom.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Apple-style Hero Section */}
        <section className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 lg:p-10 border shadow-sm">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={CURRENT_USER.role_color} size="md">
                  <Shield className="h-3 w-3" />
                  {CURRENT_USER.custom_role}
                </Badge>
                <span className="text-xs text-zinc-400">
                  Semestre 2026.2 • Sala Principal
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Olá, {CURRENT_USER.display_name.split(" ")[0]}!
              </h1>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
                Bem-vindo ao seu espaço integrado de estudos. Você está conectado à sala{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  {activeRoom.name}
                </strong>
                . Acompanhe os prazos da semana, faça anotações no seu caderno Notion e colabore no Canva.
              </p>

              {/* Invite Code Quick Pill */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <div className="px-3 py-1.5 rounded-2xl glass-subtle border text-xs flex items-center gap-2">
                  <span className="text-zinc-400">Código de Acesso da Sala:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {activeRoom.invite_code}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 hover:text-blue-500 apple-spring cursor-pointer"
                    title="Copiar código"
                  >
                    {copiedCode ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-zinc-400" />
                    )}
                  </button>
                </div>
                <span className="text-xs text-zinc-400">
                  {activeRoom.members_count} colegas ativos
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-row lg:flex-col gap-2.5 shrink-0">
              <Link href="/tasks">
                <AppleButton variant="primary" size="md" className="w-full">
                  <Calendar className="h-4 w-4" />
                  <span>Mural de Tarefas</span>
                </AppleButton>
              </Link>

              <Link href="/canva">
                <AppleButton variant="glass" size="md" className="w-full">
                  <Presentation className="h-4 w-4 text-purple-500" />
                  <span>Central Canva</span>
                </AppleButton>
              </Link>
            </div>
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
              <p className="text-xs text-zinc-400 font-medium">Prazos Ativos</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {INITIAL_TASKS.filter((t) => t.status !== "completed").length}
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
              <p className="text-xs text-zinc-400 font-medium">Membros da Sala</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {activeRoom.members_count}
              </h3>
            </div>
          </div>
        </section>

        {/* Two-Column Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Mural de Atividades e Prazos com Resend */}
          <div className="lg:col-span-7 space-y-6">
            <DeadlineWidget initialTasks={INITIAL_TASKS} />
          </div>

          {/* Right: Canva Hub Preview & Chat Snippet */}
          <div className="lg:col-span-5 space-y-6">
            {/* Canva Highlight Card */}
            <div className="rounded-3xl glass-panel p-6 border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Presentation className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Canva da Sala
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Slides do Seminário Final
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
              <div className="rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/60 bg-zinc-950">
                <div className="aspect-video w-full bg-zinc-900 flex items-center justify-center">
                  <iframe
                    src={activeRoom.canva_presentation_url || "https://www.canva.com/design/DAFv3sI7p9k/view?embed"}
                    title="Apresentação Canva"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-400">Design Colaborativo</span>
                <a
                  href="https://www.canva.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 font-semibold hover:underline"
                >
                  Abrir no Canva ↗
                </a>
              </div>
            </div>

            {/* Chat em Tempo Real Teaser */}
            <div className="rounded-3xl glass-panel p-6 border space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Chat em Tempo Real
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Últimas mensagens da turma
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
                {INITIAL_MESSAGES.slice(-2).map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 rounded-2xl glass-subtle border text-xs flex items-start gap-2.5"
                  >
                    <img
                      src={msg.user.avatar_url}
                      alt={msg.user.display_name}
                      className="h-6 w-6 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {msg.user.display_name}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {msg.user.custom_role}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-300 truncate mt-0.5">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
