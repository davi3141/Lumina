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
  Palette,
  User,
  Mail,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GUIDE_SECTIONS = [
  {
    id: "tasks",
    title: "1. Mural de Tarefas & Prazos",
    icon: CheckSquare,
    badgeColor: "blue" as const,
    subtitle: "Organização estilo Notion + Teams",
    steps: [
      {
        title: "Marcar tarefa como concluída",
        desc: "Basta clicar no quadradinho ao lado da tarefa. Ela será riscada e o contador de pendências será atualizado na hora.",
      },
      {
        title: "Criar um novo prazo oficial",
        desc: "Clique no botão azul '+ Novo Prazo'. Digite o nome da matéria, a data e hora limite, e se quiser, cole um link de slides do Canva.",
      },
      {
        title: "Avisar a turma por e-mail (Resend)",
        desc: "Ao lado de qualquer tarefa, clique no ícone da cartinha (Mail). O sistema enviará um alerta de e-mail gratuito avisando que o prazo está chegando.",
      },
    ],
    actionLink: "/tasks",
    actionText: "Ir para o Mural de Tarefas",
  },
  {
    id: "rooms",
    title: "2. Salas Privadas & Códigos",
    icon: DoorOpen,
    badgeColor: "purple" as const,
    subtitle: "Acesso restrito para turmas e amigos",
    steps: [
      {
        title: "Entrar com Código Único",
        desc: "No topo da tela ou na aba 'Salas de Aula', clique em 'Código de Sala'. Digite códigos como LUMINA-7821 ou APPLE-4092 para entrar instantaneamente.",
      },
      {
        title: "Criar sua própria Sala",
        desc: "Clique em '+ Criar Nova Sala'. O sistema gera na hora um código de convite exclusivo para você passar aos seus colegas.",
      },
      {
        title: "Painel do Administrador",
        desc: "Na sua sala, clique na engrenagem (Settings). Você pode ver quem entrou, expulsar ou banir usuários indisciplinados e fixar avisos importantes.",
      },
    ],
    actionLink: "/rooms",
    actionText: "Explorar Salas de Aula",
  },
  {
    id: "notes",
    title: "3. Caderno Pessoal (Notion)",
    icon: FileText,
    badgeColor: "emerald" as const,
    subtitle: "Bloco de anotações privado e flexível",
    steps: [
      {
        title: "Criar e renomear páginas",
        desc: "Clique em '+ Nova Nota'. Clique diretamente no título grande para escrever o nome da sua aula ou assunto.",
      },
      {
        title: "Escolher o emoji de capa",
        desc: "Selecione entre 🍎, 📝, ⚡, 💡, 📐, 🔬 para personalizar o ícone visual da sua nota.",
      },
      {
        title: "Checklists e Resumos",
        desc: "Escreva resumos, fórmulas e listas de tarefas no formato que desejar. Tudo fica salvo e sincronizado.",
      },
    ],
    actionLink: "/notes",
    actionText: "Abrir Caderno Notion",
  },
  {
    id: "chat",
    title: "4. Chat em Tempo Real",
    icon: MessageSquare,
    badgeColor: "blue" as const,
    subtitle: "Tire dúvidas e converse com a turma",
    steps: [
      {
        title: "Envio instantâneo de mensagens",
        desc: "Digite no campo inferior e aperte Enter. As mensagens chegam instantaneamente para todos os alunos conectados à sala.",
      },
      {
        title: "Anexar apresentações do Canva",
        desc: "Clique no ícone de paleta de cores (🎨) ao lado do campo de texto, cole o link da sua apresentação e ela aparecerá com um botão de acesso direto no balão.",
      },
      {
        title: "Identificação por Cargos",
        desc: "Cada colega tem um selo visível (Administrador, Moderador, Aluno Destaque), facilitando identificar os monitores da matéria.",
      },
    ],
    actionLink: "/chat",
    actionText: "Ir para o Chat",
  },
  {
    id: "summaries",
    title: "5. Feed de Resumos (Knowunity)",
    icon: Sparkles,
    badgeColor: "amber" as const,
    subtitle: "Compartilhamento de materiais de estudo",
    steps: [
      {
        title: "Estudar resumos com 1 clique",
        desc: "Clique no botão 'Estudar' de qualquer cartão para abrir o visualizador de resumo ou apresentação completa incorporada.",
      },
      {
        title: "Curtir materiais dos colegas",
        desc: "Clique no coraçãozinho para dar like no resumo de quem ajudou nos estudos.",
      },
      {
        title: "Publicar o seu próprio material",
        desc: "Clique em '+ Publicar Resumo', escolha a matéria, digite a descrição e opcionalmente insira o link de embed do Canva.",
      },
    ],
    actionLink: "/summaries",
    actionText: "Ver Feed de Resumos",
  },
  {
    id: "canva",
    title: "6. Central Canva",
    icon: Palette,
    badgeColor: "purple" as const,
    subtitle: "Slides, cartazes e mapas mentais",
    steps: [
      {
        title: "Apresentações incorporadas",
        desc: "Você pode navegar pelos slides da turma diretamente dentro do Lumina sem precisar sair do site.",
      },
      {
        title: "Atalhos rápidos para criar",
        desc: "Use os botões do topo para abrir o Canva diretamente na tela de criar slides 16:9, cartazes A4 ou mapas mentais.",
      },
      {
        title: "Importar qualquer design do Canva",
        desc: "Cole qualquer link de apresentação no campo 'Cole aqui o link' e clique em 'Visualizar Embed' para testá-lo.",
      },
    ],
    actionLink: "/canva",
    actionText: "Abrir Central Canva",
  },
  {
    id: "profile",
    title: "7. Perfil & Cargos Personalizados",
    icon: User,
    badgeColor: "rose" as const,
    subtitle: "Identidade visual e reputação na sala",
    steps: [
      {
        title: "Escolher seu cargo visível",
        desc: "Escolha entre Administrador, Moderador, Aluno Destaque, Monitor Acadêmico ou Pesquisador.",
      },
      {
        title: "Mudar foto e bio",
        desc: "Clique em um dos avatares rápidos e escreva uma biografia que descreve seus objetivos acadêmicos.",
      },
    ],
    actionLink: "/profile",
    actionText: "Personalizar Perfil",
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
      title="Guia Completo: Como Usar Todas as Tarefas"
      description="Aprenda em segundos como tirar o máximo proveito de cada ferramenta da Lumina."
    >
      <div className="space-y-4">
        {/* Horizontal Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 -mx-2 px-2">
          {GUIDE_SECTIONS.map((section, idx) => {
            const isSelected = idx === activeTab;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 apple-spring cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "glass-subtle text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <span>{section.title.split(". ")[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Section Content Card */}
        <div className="p-5 rounded-2xl glass-subtle border border-zinc-200/50 dark:border-zinc-800/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {currentSection.title}
                </h4>
                <p className="text-[11px] text-zinc-400">
                  {currentSection.subtitle}
                </p>
              </div>
            </div>
            <Badge variant={currentSection.badgeColor} size="sm">
              Passo a Passo
            </Badge>
          </div>

          {/* Steps List */}
          <div className="space-y-3 pt-1">
            {currentSection.steps.map((st, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-zinc-800/40 border border-zinc-200/40 dark:border-zinc-700/40 text-xs"
              >
                <div className="h-5 w-5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  {i + 1}
                </div>
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block mb-0.5">
                    {st.title}
                  </strong>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action button to test directly */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">
              Passo {activeTab + 1} de {GUIDE_SECTIONS.length}
            </span>

            <div className="flex items-center gap-2">
              <Link href={currentSection.actionLink} onClick={onClose}>
                <AppleButton variant="primary" size="sm">
                  <span>{currentSection.actionText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </AppleButton>
              </Link>

              {activeTab < GUIDE_SECTIONS.length - 1 ? (
                <AppleButton
                  variant="glass"
                  size="sm"
                  onClick={() => setActiveTab(activeTab + 1)}
                >
                  <span>Próximo</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </AppleButton>
              ) : (
                <AppleButton variant="glass" size="sm" onClick={onClose}>
                  <span>Concluir</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </AppleButton>
              )}
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
          <Lightbulb className="h-4 w-4 shrink-0" />
          <span>
            <strong>Dica Rápida:</strong> Você também pode acessar a página completa do <strong>Guia & Central de Ajuda</strong> no menu lateral a qualquer momento!
          </span>
        </div>
      </div>
    </AppleModal>
  );
}
