"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  HelpCircle,
  CheckSquare,
  DoorOpen,
  FileText,
  MessageSquare,
  Sparkles,
  Bot,
  User,
  Search,
  ChevronDown,
  Lock,
  Crown,
  Shield,
} from "lucide-react";

interface FeatureGuide {
  id: string;
  name: string;
  category: string;
  icon: any;
  summary: string;
  route: string;
  steps: { title: string; explanation: string }[];
  proTip: string;
}

const FEATURE_GUIDES: FeatureGuide[] = [
  {
    id: "tasks",
    name: "Mural de Atividades & Prazos",
    category: "Prazos",
    icon: CheckSquare,
    summary: "Como acompanhar entregas da turma, alternar status de tarefas, e como administradores cadastram e editam prazos.",
    route: "/tasks",
    steps: [
      {
        title: "1. Como marcar uma entrega como concluída",
        explanation: "Na lista de tarefas, clique no quadrado de seleção à esquerda. Clicando uma vez, ela passa para 'Em Andamento'. Clicando novamente, ela é marcada como 'Concluída' com um visto verde e fica riscada.",
      },
      {
        title: "2. Quem pode adicionar e editar prazos?",
        explanation: "Apenas o Administrador da sala tem o botão de 'Adicionar Prazo (Admin)', 'Editar' (ícone de lápis) e 'Excluir' (ícone de lixeira). Membros comuns só visualizam e concluem suas partes.",
      },
      {
        title: "3. Como disparar alerta de e-mail para a turma (Resend)",
        explanation: "Ao lado de cada tarefa existe o botão com ícone de envelope ('Avisar Turma'). Clicando nele, o sistema aciona a rota gratuita do Resend que envia um e-mail formatado alertando sobre o prazo próximo.",
      },
    ],
    proTip: "Use os filtros ('Todas', 'Pendentes', 'Em Andamento', 'Concluídas') para focar no que precisa ser entregue primeiro.",
  },
  {
    id: "rooms",
    name: "Salas de Aula Privadas & Permissões de Admin",
    category: "Salas",
    icon: DoorOpen,
    summary: "Apenas quem cria a sala vira Admin. O criador pode promover outros membros, gerenciar o código de convite e banir quem atrapalhar.",
    route: "/rooms",
    steps: [
      {
        title: "1. Como entrar em uma sala usando o código",
        explanation: "Clique no botão 'Entrar por Código' (ou 'Código de Sala' no topo). Digite o código de convite (ex: TURMA-2026) e confirme. O acesso é liberado instantaneamente como membro comum.",
      },
      {
        title: "2. Como criar a sua própria sala e ser Admin",
        explanation: "Clique em '+ Criar Nova Sala'. Dê um nome para a turma, matéria e descrição. Você se torna o criador e Administrador exclusivo desta sala.",
      },
      {
        title: "3. Como promover colegas para Admin ou Moderador",
        explanation: "Abra a sala e clique no botão 'Painel do Admin 👑'. Na lista de participantes, você pode alterar o cargo de qualquer aluno para 'Administrador', 'Moderador' ou 'Membro Comum'.",
      },
    ],
    proTip: "Você pode clicar no código da sala a qualquer momento para copiá-lo e compartilhar com a sua turma.",
  },
  {
    id: "chat",
    name: "Chat da Turma & Chat PV (Privado 1-a-1)",
    category: "Chat & PV",
    icon: MessageSquare,
    summary: "Converse com todos na sala ou mande mensagens privadas diretamente no PV de qualquer colega de classe.",
    route: "/chat",
    steps: [
      {
        title: "1. Chat da Turma (Geral)",
        explanation: "Na aba '💬 Turma (Geral)', todas as mensagens enviadas ficam visíveis para todos os membros que estão na sala.",
      },
      {
        title: "2. Chat PV (Mensagens Particulares)",
        explanation: "Na aba '🔒 Mensagens Privadas (PV)', você vê a lista dos seus colegas de turma. Clique em um deles para abrir o bate-papo privado 1-a-1.",
      },
      {
        title: "3. Iniciar PV direto do chat público ou da lista de membros",
        explanation: "Ao lado de qualquer mensagem ou membro, basta clicar em 'Conversar no PV' para ir direto para a conversa particular com ele.",
      },
    ],
    proTip: "O Chat PV é perfeito para tirar dúvidas de exercícios sem poluir o canal geral da matéria.",
  },
  {
    id: "lumi",
    name: "Lumi IA (Assistente de Estudos Amigável)",
    category: "Lumi IA",
    icon: Bot,
    summary: "Uma inteligência artificial super amigável que explica qualquer conteúdo de forma simples, mastigada e sem enrolação.",
    route: "/lumi",
    steps: [
      {
        title: "1. Como fazer perguntas para a Lumi",
        explanation: "Digite qualquer dúvida na barra de conversa. Pode ser um conceito difícil de biologia, uma fórmula de matemática, ou como organizar uma semana de provas.",
      },
      {
        title: "2. Botões de atalho rápido",
        explanation: "Use botões como 'Explique Simples', 'Resumir Conteúdo' ou 'Organizar Tempo' para obter respostas práticas com um clique.",
      },
      {
        title: "3. Perfeita no Celular",
        explanation: "No smartphone, a Lumi fica disponível diretamente na barra inferior com ícone iluminado de fácil acesso.",
      },
    ],
    proTip: "A Lumi foi feita para falar de forma natural e acolhedora, como um amigo te explicando a matéria.",
  },
  {
    id: "avatars",
    name: "Catálogo de 40 Animais (Fundos de Cor Sólida)",
    category: "Avatares",
    icon: User,
    summary: "100% livre de fotos humanas: 40 avatares de bichinhos lindos com cores sólidas de alto contraste.",
    route: "/profile",
    steps: [
      {
        title: "1. Como escolher seu bichinho favorito",
        explanation: "Vá em 'Meu Perfil' ou clique no seu avatar no cabeçalho. Você verá o catálogo completo com 40 animais (Gatinho, Panda, Raposa, Coruja, etc.).",
      },
      {
        title: "2. Busca rápida de animais",
        explanation: "Digite o nome do animal no campo de busca para encontrar seu favorito em segundos.",
      },
      {
        title: "3. Fundo de cor sólida limpa",
        explanation: "Cada avatar tem um fundo liso e limpo que combina perfeitamente com os modos claro e escuro.",
      },
    ],
    proTip: "Seu avatar de animal acompanha seu nome no mural, no chat da sala e no PV.",
  },
  {
    id: "notes",
    name: "Caderno Pessoal (Bloco de Notas)",
    category: "Caderno",
    icon: FileText,
    summary: "Seu bloco de notas particular para registrar resumos, cronogramas e anotações que só você tem acesso.",
    route: "/notes",
    steps: [
      {
        title: "1. Como criar e editar notas",
        explanation: "Clique em '+ Nova Nota'. Digite suas anotações, use listas de tarefas com traços e personalize o emoji de capa.",
      },
      {
        title: "2. Privacidade garantida",
        explanation: "O caderno é particular do seu usuário. Nenhum colega de sala consegue ver o que você escreve nele.",
      },
    ],
    proTip: "Deixe um checklist de matérias da semana no seu caderno para nunca se perder nas revisões.",
  },
];

export default function GuidePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [expandedId, setExpandedId] = useState<string | null>("tasks");

  const categories = ["Todas", "Prazos", "Salas", "Chat & PV", "Lumi IA", "Avatares", "Caderno"];

  const filteredGuides = FEATURE_GUIDES.filter((guide) => {
    const matchesCategory =
      selectedCategory === "Todas" || guide.category === selectedCategory;
    const matchesSearch =
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.steps.some(
        (s) =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.explanation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Apple-style Hero Header */}
        <section className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-zinc-300 dark:border-zinc-800 shadow-sm">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="blue" size="md">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Manual Interativo
                </Badge>
                <span className="text-xs text-zinc-500">Guia Fácil do Usuário</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Como Usar Todas as Funções do Lumina
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mt-1 leading-relaxed">
                Tudo explicado de forma simples: permissões de administrador, mural de prazos, chat particular (PV), Lumi IA e os avatares de animais.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <AppleButton variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Voltar ao Início
                </AppleButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Search & Category Filter */}
        <div className="space-y-4">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por funcionalidade ou dúvida..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold apple-spring cursor-pointer shrink-0 transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "glass-subtle text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Features Accordion List */}
        <div className="space-y-4">
          {filteredGuides.map((guide) => {
            const GIcon = guide.icon;
            const isExpanded = expandedId === guide.id;

            return (
              <div
                key={guide.id}
                className="rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 overflow-hidden shadow-xs transition-all"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : guide.id)}
                  className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 apple-spring"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <GIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {guide.name}
                        </h3>
                        <Badge variant="blue" size="sm">
                          {guide.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                        {guide.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <ChevronDown
                      className={`h-5 w-5 text-zinc-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-blue-500" : ""
                      }`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-200 dark:border-zinc-800/60 space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-3">
                      {guide.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1"
                        >
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {step.title}
                          </h4>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                            {step.explanation}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                      💡 <strong>Dica Pro:</strong> {guide.proTip}
                    </div>

                    <div className="flex justify-end pt-1">
                      <Link href={guide.route}>
                        <AppleButton variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <span>Acessar {guide.name}</span>
                        </AppleButton>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
