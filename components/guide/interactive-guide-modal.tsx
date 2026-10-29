"use client";

import React, { useState } from "react";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckSquare,
  DoorOpen,
  FileText,
  MessageSquare,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ChevronRight,
  Shield,
  Lock,
} from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GUIDE_SECTIONS = [
  {
    id: "tasks",
    title: "1. Mural de Prazos & Entregas",
    icon: CheckSquare,
    badgeColor: "emerald" as const,
    subtitle: "Prazos definidos pelo Admin com aviso por e-mail",
    steps: [
      {
        title: "Quem define os prazos?",
        desc: "Apenas o Administrador (quem criou a sala ou foi promovido) pode adicionar, editar ou excluir as entregas oficiais do mural.",
      },
      {
        title: "Como os alunos concluem tarefas?",
        desc: "Cada aluno clica no quadradinho ao lado da entrega para marcar como feita. Ela fica riscada e concluída para seu controle pessoal.",
      },
      {
        title: "Avisar a turma por e-mail (Resend)",
        desc: "Ao lado de qualquer entrega, clique na cartinha (Mail). O sistema envia um alerta gratuito avisando que o prazo está chegando.",
      },
    ],
    actionLink: "/tasks",
    actionText: "Ir para o Mural de Prazos",
  },
  {
    id: "rooms",
    title: "2. Salas Privadas & Permissões",
    icon: DoorOpen,
    badgeColor: "purple" as const,
    subtitle: "Acesso por código único e gestão rigorosa de Admin",
    steps: [
      {
        title: "Somente o criador é Admin",
        desc: "Quem cria a sala vira Admin automaticamente. Ninguém entra como admin por padrão.",
      },
      {
        title: "Promover colegas a Admin ou Moderador",
        desc: "No Painel do Admin, o criador pode escolher quem vira Administrador ou Moderador, ou remover participantes.",
      },
      {
        title: "Entrar com Código Único",
        desc: "Qualquer aluno com o código (ex: TURMA-2026) pode ingressar instantaneamente como membro participante.",
      },
    ],
    actionLink: "/rooms",
    actionText: "Explorar Salas de Aula",
  },
  {
    id: "pv",
    title: "3. Chat da Turma & Chat PV (Privado)",
    icon: MessageSquare,
    badgeColor: "blue" as const,
    subtitle: "Conversas em grupo e 1-a-1 com colegas",
    steps: [
      {
        title: "Chat da Turma (Geral)",
        desc: "Canal aberto em tempo real para toda a sala tirar dúvidas gerais e alinhar atividades.",
      },
      {
        title: "Chat PV (Mensagens 1-a-1)",
        desc: "Acesse a aba 'Mensagens Privadas (PV)' ou clique no botão 'Conversar no PV' ao lado de qualquer colega para falar em particular.",
      },
      {
        title: "Histórico salvo e seguro",
        desc: "Suas conversas particulares ficam salvas e organizadas por colega de turma.",
      },
    ],
    actionLink: "/chat",
    actionText: "Abrir Chat & PV",
  },
  {
    id: "lumi",
    title: "4. Lumi IA (Tira-Dúvidas Amigável)",
    icon: Bot,
    badgeColor: "amber" as const,
    subtitle: "Assistente inteligente simples e sem termos difíceis",
    steps: [
      {
        title: "Linguagem simples e direta",
        desc: "A Lumi não usa palavras difíceis ou jargões chatos. Ela explica qualquer matéria de forma mastigada e gostosa de ler.",
      },
      {
        title: "Sugestões de estudo com 1 toque",
        desc: "Use botões como 'Explique Simples', 'Como Organizar meu Tempo' ou 'Dica para Memorizar' para obter conselhos na hora.",
      },
      {
        title: "Disponível no celular",
        desc: "Acesse pelo menu inferior do smartphone com apenas um toque na aba Lumi IA.",
      },
    ],
    actionLink: "/lumi",
    actionText: "Falar com a Lumi IA",
  },
  {
    id: "avatars",
    title: "5. Catálogo de 40 Animais (Sem Fotos)",
    icon: User,
    badgeColor: "rose" as const,
    subtitle: "Avatares animais com fundos em cores sólidas",
    steps: [
      {
        title: "Sem fotos reais de pessoas",
        desc: "Para garantir privacidade e um design lindo, o Lumina usa avatares exclusivos de animais (Gatinho, Panda, Raposa, Coruja, etc.).",
      },
      {
        title: "Fundos com uma cor sólida",
        desc: "Cada animal possui um fundo em cor lisa e alto contraste, sem poluição visual.",
      },
      {
        title: "Troque quando quiser",
        desc: "Acesse 'Meu Perfil' ou clique no seu nome no topo para escolher qualquer um dos 40 animais.",
      },
    ],
    actionLink: "/profile",
    actionText: "Escolher Avatar Animal",
  },
  {
    id: "notes",
    title: "6. Caderno Pessoal de Anotações",
    icon: FileText,
    badgeColor: "emerald" as const,
    subtitle: "Bloco de notas privado para seus resumos",
    steps: [
      {
        title: "Seu espaço particular",
        desc: "Apenas você vê as suas notas. Perfeito para rascunhos, resumos de aulas e cronogramas pessoais.",
      },
      {
        title: "Checklists interativos",
        desc: "Crie listas de pendências e marque o que já concluiu ao longo da semana.",
      },
    ],
    actionLink: "/notes",
    actionText: "Abrir Caderno Pessoal",
  },
];

export function InteractiveGuideModal({ isOpen, onClose }: GuideModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  const currentSection = GUIDE_SECTIONS[activeTab];
  const Icon = currentSection.icon;

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="📖 Guia Rápido do Lumina"
      description="Veja como funcionam as salas, permissões de admin, chat no PV, Lumi IA e o catálogo de 40 animais."
    >
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left: Section Navigation Pills */}
        <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 md:w-56 shrink-0 no-scrollbar">
          {GUIDE_SECTIONS.map((section, idx) => {
            const SIcon = section.icon;
            const isSelected = activeTab === idx;

            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center justify-between p-2.5 rounded-2xl text-left apple-spring cursor-pointer transition-all shrink-0 md:shrink ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "glass-subtle text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SIcon
                    className={`h-4 w-4 shrink-0 ${
                      isSelected ? "text-white" : "text-blue-500"
                    }`}
                  />
                  <span className="text-xs font-bold truncate">
                    {section.title.split(". ")[1]}
                  </span>
                </div>
                <ChevronRight
                  className={`h-3 w-3 shrink-0 hidden md:block ${
                    isSelected ? "text-white" : "text-zinc-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: Active Section Content */}
        <div className="flex-1 space-y-4 rounded-3xl glass-subtle p-5 border border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {currentSection.title}
              </h3>
              <Badge variant={currentSection.badgeColor} size="sm">
                Passo a Passo
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {currentSection.subtitle}
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {currentSection.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {step.title}
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 pl-7 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-[10px] text-zinc-400 font-semibold">
              {activeTab + 1} de {GUIDE_SECTIONS.length}
            </span>

            <Link href={currentSection.actionLink} onClick={onClose}>
              <AppleButton variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <span>{currentSection.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </AppleButton>
            </Link>
          </div>
        </div>
      </div>
    </AppleModal>
  );
}
