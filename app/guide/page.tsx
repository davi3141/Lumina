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
  Palette,
  User,
  Search,
  ExternalLink,
  ChevronDown,
  PlayCircle,
  Lightbulb,
  Check,
  Mail,
  Zap,
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
    category: "Produtividade",
    icon: CheckSquare,
    summary: "Como acompanhar entregas da turma, alternar status de tarefas, anexar links de slides do Canva e notificar colegas via e-mail.",
    route: "/tasks",
    steps: [
      {
        title: "1. Como marcar uma tarefa como feita ou em andamento",
        explanation: "Na lista de tarefas, clique no quadrado de seleção à esquerda. Clicando uma vez, ela passa para 'Em Andamento' com um ponto azul pulsante. Clicando novamente, ela é marcada como 'Concluída' com um visto verde e fica riscada.",
      },
      {
        title: "2. Como cadastrar um novo prazo oficial",
        explanation: "Clique no botão azul '+ Novo Prazo'. Preencha o título da entrega, a disciplina (ex: Engenharia, Cálculo), a data e hora limite no calendário, o nível de prioridade (Média, Alta ou Urgente) e opcionalmente cole o link do Canva.",
      },
      {
        title: "3. Como disparar alerta de e-mail para a turma (Resend)",
        explanation: "Ao lado de cada tarefa existe o botão com ícone de envelope ('Avisar Turma'). Clicando nele, o sistema aciona a rota gratuita do Resend que envia um e-mail formatado alertando sobre o prazo próximo.",
      },
      {
        title: "4. Como abrir os slides vinculados à tarefa",
        explanation: "Se a atividade tiver uma apresentação associada, você verá um botão roxo 'Canva'. Ao clicar, ele abre diretamente o design para você começar a editar.",
      },
    ],
    proTip: "Use o filtro do topo ('Todas', 'Pendentes', 'Em Andamento', 'Concluídas') para focar apenas nas prioridades da semana.",
  },
  {
    id: "rooms",
    name: "Salas de Aula Privadas & Entrada por Código",
    category: "Salas",
    icon: DoorOpen,
    summary: "Como ingressar em turmas de amigos com código único, criar salas e usar o painel administrativo de moderação.",
    route: "/rooms",
    steps: [
      {
        title: "1. Como entrar em uma sala usando o código",
        explanation: "Clique no botão 'Entrar por Código' (ou 'Código de Sala' no topo). Digite o código de 10 a 12 caracteres (ex: LUMINA-7821 ou APPLE-4092) e confirme. O acesso é liberado instantaneamente.",
      },
      {
        title: "2. Como criar a sua própria sala privada",
        explanation: "Clique em '+ Criar Nova Sala'. Dê um nome para a turma, matéria e descrição. O sistema gera automaticamente um código único que só você e os convidados conhecem.",
      },
      {
        title: "3. Como expulsar ou banir usuários indisciplinados",
        explanation: "No cartão da sua sala, clique no ícone de engrenagem (Settings) para abrir o Painel Administrativo. Na aba 'Membros', você verá a lista de alunos e poderá clicar em 'Banir' ou na lixeira para remover o membro.",
      },
      {
        title: "4. Como fixar um aviso urgente no mural",
        explanation: "No mesmo Painel Administrativo, vá na aba 'Fixar Aviso', digite o título e a instrução. Esse aviso aparecerá em destaque dourado com pin no topo do Dashboard de todos os membros.",
      },
    ],
    proTip: "Você pode clicar no código da sala a qualquer momento para copiá-lo para a sua área de transferência e mandar no WhatsApp da turma.",
  },
  {
    id: "notes",
    name: "Caderno Pessoal (Estilo Notion)",
    category: "Notas",
    icon: FileText,
    summary: "Seu bloco de notas particular e flexível para organizar resumos, fórmulas e checklists por aula.",
    route: "/notes",
    steps: [
      {
        title: "1. Como criar e organizar páginas",
        explanation: "Clique no botão '+ Nova Nota' no painel lateral esquerdo do caderno. Uma nova página sem título será criada e você pode digitar qualquer título no campo principal.",
      },
      {
        title: "2. Como mudar o ícone de capa (Emoji)",
        explanation: "Na barra superior do editor, clique em um dos emojis (🍎, 📝, ⚡, 💡, 📐, 🔬). Ele será aplicado instantaneamente na lista lateral.",
      },
      {
        title: "3. Como escrever e formatar anotações",
        explanation: "O editor aceita markdown e texto livre. Você pode fazer listas de tarefas com '- [ ]', títulos com '#' e tópicos com traços.",
      },
      {
        title: "4. Como buscar notas rapidamente",
        explanation: "Use a barra 'Buscar em todas as notas...' para filtrar instantaneamente mesmo se você tiver dezenas de matérias salvas.",
      },
    ],
    proTip: "Suas notas são 100% privadas graças às políticas de segurança do Supabase RLS. Nem mesmo os outros administradores da sala podem ler suas anotações pessoais.",
  },
  {
    id: "chat",
    name: "Chat em Tempo Real da Turma",
    category: "Comunicação",
    icon: MessageSquare,
    summary: "Tire dúvidas ao vivo, envie links do Canva e converse com colegas identificados por cargos oficiais.",
    route: "/chat",
    steps: [
      {
        title: "1. Como enviar mensagens",
        explanation: "Digite sua dúvida ou comentário no campo 'Tire uma dúvida com a turma...' e pressione Enter ou clique na setinha de envio.",
      },
      {
        title: "2. Como anexar uma apresentação do Canva",
        explanation: "Clique no botão com a paletinha de cores (🎨) ao lado do campo de digitação. Cole o link da sua apresentação ou cartaz e envie. A mensagem incluirá um botão estilizado 'Canva: Abrir Apresentação'.",
      },
      {
        title: "3. Como identificar monitores e professores",
        explanation: "Ao lado do nome de cada aluno no chat aparece um selo colorido oficial (ex: Administrador em roxo, Moderador em verde, Aluno Destaque em azul).",
      },
    ],
    proTip: "O chat utiliza o motor Supabase Realtime via WebSockets, portanto as mensagens aparecem instantaneamente sem necessidade de recarregar a página.",
  },
  {
    id: "summaries",
    name: "Feed de Resumos & Materiais (Knowunity)",
    category: "Estudos",
    icon: Sparkles,
    summary: "Espaço colaborativo para publicação, curtidas e download de materiais de estudo da comunidade acadêmica.",
    route: "/summaries",
    steps: [
      {
        title: "1. Como visualizar e estudar um resumo",
        explanation: "Clique no botão 'Estudar' em qualquer cartão. Um modal translúcido estilo Apple abrirá mostrando o resumo completo, mapa mental ou até a apresentação embutida do Canva em tamanho expandido.",
      },
      {
        title: "2. Como curtir um material que te ajudou",
        explanation: "Clique no ícone de coração no canto inferior esquerdo do cartão. O coração ficará preenchido de vermelho e a contagem de curtidas subirá na hora.",
      },
      {
        title: "3. Como publicar seu próprio resumo",
        explanation: "Clique em '+ Publicar Resumo', digite o título, disciplina, síntese explicativa e, se tiver, o link do Canva Embed. O material fica disponível na hora para a sala toda.",
      },
    ],
    proTip: "Filtre por matéria clicando nas pílulas do topo ('Engenharia', 'Design', 'Segurança') para encontrar exatamente a revisão que você precisa para a prova.",
  },
  {
    id: "canva",
    name: "Central de Integração Canva",
    category: "Design",
    icon: Palette,
    summary: "Apresentações 16:9 embutidas, templates acadêmicos e importador de qualquer design externo.",
    route: "/canva",
    steps: [
      {
        title: "1. Como navegar na apresentação interativa",
        explanation: "Dentro do quadro da Central Canva, você pode clicar nos botões de avançar e retroceder slides diretamente no navegador, sem precisar instalar nada.",
      },
      {
        title: "2. Como criar novos designs rapidamente",
        explanation: "No topo da página existem 3 atalhos: 'Criar Apresentação' (abre o Canva em 16:9), 'Criar Cartaz & Resumo' (abre em folha A4) e 'Mapa Mental Interativo' (abre o criador de diagramas).",
      },
      {
        title: "3. Como importar qualquer slide seu do Canva",
        explanation: "No Canva, clique em Compartilhar > Mais > Incorporar (Embed) e copie o link. Cole no campo 'Cole aqui o link do seu design' e clique em 'Visualizar Embed'. O site mostrará a sua apresentação na mesma hora!",
      },
    ],
    proTip: "Use o botão 'Copiar Link' para compartilhar o slide master diretamente com os colegas do seu grupo de trabalho.",
  },
  {
    id: "profile",
    name: "Perfil & Cargos Personalizados",
    category: "Conta",
    icon: User,
    summary: "Como personalizar seu nome de exibição, foto de perfil, biografia e distintivo de cargo visível.",
    route: "/profile",
    steps: [
      {
        title: "1. Como escolher seu cargo visível",
        explanation: "Na seção 'Escolha seu Cargo Personalizado', clique em um dos cartões: Administrador (roxo), Moderador (verde), Aluno Destaque (azul), Monitor Acadêmico (laranja) ou Pesquisador (rosa).",
      },
      {
        title: "2. Como escolher seu avatar",
        explanation: "Clique em uma das fotos redondas de atalho ou cole o link de qualquer imagem da internet no campo 'URL da Imagem de Avatar'.",
      },
      {
        title: "3. Salvar alterações",
        explanation: "Clique no botão azul 'Salvar Alterações'. Suas mensagens no chat e seus resumos no feed passarão a exibir o seu novo selo e avatar.",
      },
    ],
    proTip: "Seus distintivos de cargo aparecem em toda a plataforma para destacar seu papel de liderança ou dedicação nos estudos.",
  },
];

export default function GuidePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [expandedId, setExpandedId] = useState<string | null>("tasks");

  const categories = ["Todas", "Produtividade", "Salas", "Notas", "Comunicação", "Estudos", "Design", "Conta"];

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
        <section className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border shadow-sm">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="blue" size="md">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Manual Interativo do Usuário
                </Badge>
                <span className="text-xs text-zinc-400">Guia Completo para Iniciantes</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Como Usar Todas as Tarefas e Recursos da Lumina
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl mt-1.5 leading-relaxed">
                Aprenda o passo a passo detalhado de cada ferramenta: do mural de prazos e caderno Notion à integração com o Canva e moderação de salas.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <Link href="/tasks">
                <AppleButton variant="primary" size="md">
                  <span>Praticar nas Tarefas</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </AppleButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar como fazer qualquer coisa (ex: prazos, canva, banir, emoji)..."
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl glass-subtle border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium apple-spring cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "glass-subtle text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Features Accordion List */}
        <div className="space-y-4">
          {filteredGuides.map((guide) => {
            const Icon = guide.icon;
            const isExpanded = expandedId === guide.id;

            return (
              <div
                key={guide.id}
                className="rounded-3xl glass-panel border overflow-hidden apple-spring transition-all"
              >
                {/* Header row clickable */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : guide.id)}
                  className="p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 apple-spring"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="h-11 w-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                          {guide.name}
                        </h3>
                        <Badge variant="zinc" size="sm">
                          {guide.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                        {guide.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={guide.route}
                      onClick={(e) => e.stopPropagation()}
                      className="hidden sm:inline-flex"
                    >
                      <AppleButton variant="glass" size="sm">
                        <span>Acessar</span>
                        <ExternalLink className="h-3 w-3" />
                      </AppleButton>
                    </Link>

                    <button
                      className={`p-2 rounded-full glass-subtle text-zinc-400 apple-spring ${
                        isExpanded ? "rotate-180 text-blue-500" : ""
                      }`}
                      aria-label="Expandir ou recolher guia"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Step by Step */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/60 space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                      {guide.steps.map((st, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl glass-subtle border border-zinc-200/40 dark:border-zinc-800/60 text-xs space-y-1.5"
                        >
                          <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                            <span className="h-5 w-5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                              {i + 1}
                            </span>
                            <span>{st.title}</span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-[11px] pl-7">
                            {st.explanation}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Pro Tip Box */}
                    <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Lightbulb className="h-4 w-4 shrink-0 text-blue-500" />
                        <span>
                          <strong>Dica Pro:</strong> {guide.proTip}
                        </span>
                      </div>

                      <Link href={guide.route}>
                        <AppleButton variant="primary" size="sm" className="shrink-0">
                          <span>Experimentar agora</span>
                          <ExternalLink className="h-3 w-3" />
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
