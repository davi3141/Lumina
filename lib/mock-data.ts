import { ANIMAL_AVATARS } from "./animal-avatars";
import { ROOM_BANNER_PRESETS, ROOM_STICKERS } from "./room-themes";

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  custom_role: 'Administrador' | 'Moderador' | 'Aluno Destaque' | 'Monitor Acadêmico' | 'Pesquisador';
  role_color: 'purple' | 'emerald' | 'blue' | 'amber' | 'rose';
}

export interface Room {
  id: string;
  name: string;
  subject: string;
  description: string;
  invite_code: string;
  owner_id: string;
  admins?: string[];
  moderators?: string[];
  members_count: number;
  banner_id?: string;
  banner_gradient: string;
  strip_color: string; // Cor da tirinha superior da sala
  strip_hex?: string;
  sticker: string; // Figurinha/Emoji temático da sala (ex: 📊, 💼, 💻)
  accent_color?: string;
  created_at: string;
}

export interface Notice {
  id: string;
  room_id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'urgent';
  is_pinned: boolean;
  created_at: string;
}

export interface GlobalNotice {
  id: string;
  author_name: string;
  author_avatar: string;
  author_role: string;
  title: string;
  content: string;
  tag: string;
  priority: 'low' | 'normal' | 'urgent';
  created_at: string;
}

export interface Task {
  id: string;
  room_id: string;
  title: string;
  description: string;
  subject: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  icon: string;
  category: string;
  is_favorite: boolean;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user: Profile;
  content: string;
  created_at: string;
}

export interface PvMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  recipient_id: string;
  recipient_name: string;
  recipient_avatar: string;
  content: string;
  created_at: string;
}

export interface SummaryItem {
  id: string;
  room_id: string;
  author: Profile;
  title: string;
  subject: string;
  description: string;
  likes_count: number;
  is_liked?: boolean;
  tags: string[];
  created_at: string;
}

export const CURRENT_USER: Profile = {
  id: 'usr_me',
  email: 'meu.usuario@estudos.com',
  display_name: 'Meu Nome',
  avatar_url: ANIMAL_AVATARS[0].url, // Gatinho
  bio: 'Estudante ativo no Lumina.',
  custom_role: 'Administrador',
  role_color: 'purple',
};

// 3 Salas Iniciais Completamente Diferentes em Banners, Cores de Tirinha e Figurinhas
export const INITIAL_ROOMS: Room[] = [
  {
    id: 'sala-marketing',
    name: 'Marketing Digital & Mídia',
    subject: 'Marketing',
    description: 'Sala focada em criação de campanhas, branding, análise de tráfego e métricas de conversão.',
    invite_code: 'MKT-2026',
    owner_id: 'usr_me',
    admins: ['usr_me'],
    moderators: [],
    members_count: 8,
    banner_id: 'banner-02',
    banner_gradient: 'from-amber-400 via-orange-500 to-rose-600',
    strip_color: 'bg-orange-500',
    strip_hex: '#f97316',
    sticker: '📊',
    accent_color: 'amber',
    created_at: '2026-10-28T10:00:00Z',
  },
  {
    id: 'sala-administracao',
    name: 'Administração & Finanças',
    subject: 'Administração',
    description: 'Planejamento orçamentário, gestão de equipes, cases empresariais e fluxo de caixa.',
    invite_code: 'ADM-2026',
    owner_id: 'usr_me',
    admins: ['usr_me'],
    moderators: [],
    members_count: 12,
    banner_id: 'banner-17',
    banner_gradient: 'from-blue-700 via-indigo-800 to-slate-900',
    strip_color: 'bg-indigo-600',
    strip_hex: '#4f46e5',
    sticker: '💼',
    accent_color: 'blue',
    created_at: '2026-10-28T11:00:00Z',
  },
  {
    id: 'sala-software',
    name: 'Engenharia de Software',
    subject: 'Tecnologia',
    description: 'Arquitetura de sistemas distribuídos, banco de dados PostgreSQL e boas práticas de código.',
    invite_code: 'TECH-2026',
    owner_id: 'usr_me',
    admins: ['usr_me'],
    moderators: [],
    members_count: 15,
    banner_id: 'banner-05',
    banner_gradient: 'from-fuchsia-600 via-purple-700 to-cyan-500',
    strip_color: 'bg-fuchsia-500',
    strip_hex: '#d946ef',
    sticker: '💻',
    accent_color: 'purple',
    created_at: '2026-10-28T12:00:00Z',
  },
];

// Recados Globais da Moderação (Visíveis no Início sem precisar entrar na sala)
export const INITIAL_GLOBAL_NOTICES: GlobalNotice[] = [
  {
    id: 'global-01',
    author_name: 'Moderação Lumina',
    author_avatar: ANIMAL_AVATARS[6].url, // Corujinha
    author_role: 'Administração Geral',
    title: '📢 Abertura do Período de Entregas Bimestrais',
    content: 'Atenção a todos os alunos! Os murais de prazos de cada sala (Marketing, Administração e TI) foram configurados pelos administradores com as datas limites de entrega.',
    tag: 'Geral',
    priority: 'urgent',
    created_at: '2026-10-28T18:00:00Z',
  },
  {
    id: 'global-02',
    author_name: 'Coordenação Acadêmica',
    author_avatar: ANIMAL_AVATARS[3].url, // Panda
    author_role: 'Monitoria',
    title: '🐾 Novidade: 40 Avatares Animais & Chat PV Liberados',
    content: 'Personalize seu perfil com qualquer um dos 40 bichinhos e chame colegas para conversar no PV sem sair da plataforma.',
    tag: 'Atualização',
    priority: 'normal',
    created_at: '2026-10-28T16:30:00Z',
  },
  {
    id: 'global-03',
    author_name: 'Lumi IA',
    author_avatar: ANIMAL_AVATARS[28].url, // Abelhinha
    author_role: 'Assistente Inteligente',
    title: '💡 Dúvidas nas Matérias? A Lumi Está Disponível 24h',
    content: 'Se tiver dificuldade com exercícios ou precisar de dicas de estudo, abra a aba Lumi IA para receber respostas simples e mastigadas.',
    tag: 'Estudos',
    priority: 'normal',
    created_at: '2026-10-28T14:00:00Z',
  },
];

// Prazos Isolados por Sala (Marketing tem seus prazos, Administração tem os seus!)
export const INITIAL_TASKS: Task[] = [
  // Prazos Exclusivos da Sala de Marketing
  {
    id: 'tsk-mkt-01',
    room_id: 'sala-marketing',
    title: 'Planejamento de Campanha no TikTok & Instagram',
    description: 'Entregar o cronograma de 15 postagens com roteiro e personas validadas.',
    subject: 'Marketing',
    due_date: '2026-11-05T23:59:00Z',
    priority: 'urgent',
    status: 'in_progress',
  },
  {
    id: 'tsk-mkt-02',
    room_id: 'sala-marketing',
    title: 'Relatório de Métricas & CAC da Campanha',
    description: 'Calcular o Custo de Aquisição de Clientes (CAC) e taxa de conversão da landing page.',
    subject: 'Marketing',
    due_date: '2026-11-09T18:00:00Z',
    priority: 'high',
    status: 'pending',
  },

  // Prazos Exclusivos da Sala de Administração
  {
    id: 'tsk-adm-01',
    room_id: 'sala-administracao',
    title: 'Balanço Patrimonial & Demonstrativo de Resultados (DRE)',
    description: 'Montar a planilha de conciliação fiscal e calcular margem de contribuição.',
    subject: 'Administração',
    due_date: '2026-11-06T20:00:00Z',
    priority: 'urgent',
    status: 'pending',
  },
  {
    id: 'tsk-adm-02',
    room_id: 'sala-administracao',
    title: 'Plano de Negócios e Matriz SWOT',
    description: 'Entrega da análise setorial com forças, fraquezas, oportunidades e ameaças da empresa.',
    subject: 'Administração',
    due_date: '2026-11-12T14:00:00Z',
    priority: 'medium',
    status: 'pending',
  },

  // Prazos Exclusivos da Sala de Engenharia de Software
  {
    id: 'tsk-tech-01',
    room_id: 'sala-software',
    title: 'Diagrama C4 de Arquitetura de Microserviços',
    description: 'Desenhar os níveis Context, Container e Component para a API da turma.',
    subject: 'Tecnologia',
    due_date: '2026-11-04T22:00:00Z',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 'tsk-tech-02',
    room_id: 'sala-software',
    title: 'Modelagem do Banco de Dados PostgreSQL & RLS',
    description: 'Escrever scripts DDL com constraints e políticas de Row Level Security.',
    subject: 'Tecnologia',
    due_date: '2026-11-10T19:00:00Z',
    priority: 'medium',
    status: 'pending',
  },
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-01',
    room_id: 'sala-marketing',
    author: {
      name: 'Admin Marketing',
      avatar: ANIMAL_AVATARS[2].url, // Raposinha
      role: 'Administrador',
    },
    title: '📌 Alinhamento das Métricas do Trabalho',
    content: 'O prazo de entrega da campanha foi fixado para o dia 05. Dúvidas no chat da turma!',
    priority: 'urgent',
    is_pinned: true,
    created_at: '2026-10-28T16:00:00Z',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-01',
    title: 'Meu Bloco de Notas Pessoal',
    content: `# Minhas Metas & Revisões\n\n- [ ] Acessar o mural da sala de Marketing\n- [ ] Revisar tarefas da sala de Administração\n- [ ] Tirar dúvidas no Chat PV\n- [ ] Pedir dicas para a Lumi IA`,
    icon: '📝',
    category: 'Geral',
    is_favorite: true,
    updated_at: '2026-10-28T19:40:00Z',
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    room_id: 'sala-marketing',
    user: {
      id: 'usr_mariana',
      email: 'mariana@estudos.com',
      display_name: 'Mariana Costa',
      avatar_url: ANIMAL_AVATARS[3].url,
      bio: 'Focada em marketing e design.',
      custom_role: 'Moderador',
      role_color: 'emerald',
    },
    content: 'Olá pessoal da turma de Marketing! Postei as referências no mural.',
    created_at: '2026-10-28T18:30:00Z',
  },
];

export const INITIAL_SUMMARIES: SummaryItem[] = [
  {
    id: 'sum-01',
    room_id: 'sala-marketing',
    author: {
      id: 'usr_mariana',
      email: 'mariana@estudos.com',
      display_name: 'Mariana Costa',
      avatar_url: ANIMAL_AVATARS[3].url,
      bio: 'Moderadora',
      custom_role: 'Moderador',
      role_color: 'emerald',
    },
    title: 'Resumo Completo: Funil de Conversão & Inbound Marketing',
    subject: 'Marketing',
    description: 'Etapas de atração, conversão, fechamento e encantamento explicadas com exemplos.',
    likes_count: 18,
    is_liked: true,
    tags: ['Marketing', 'Funil', 'Vendas'],
    created_at: '2026-10-28T14:00:00Z',
  },
];
