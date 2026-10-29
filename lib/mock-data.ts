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
  members_count: number;
  banner_gradient: string;
  canva_presentation_url?: string;
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

export interface Task {
  id: string;
  room_id: string;
  title: string;
  description: string;
  subject: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  canva_link?: string;
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
  canva_attachment_url?: string;
  created_at: string;
}

export interface SummaryItem {
  id: string;
  room_id: string;
  author: Profile;
  title: string;
  subject: string;
  description: string;
  canva_embed_url?: string;
  likes_count: number;
  is_liked?: boolean;
  tags: string[];
  created_at: string;
}

export const CURRENT_USER: Profile = {
  id: 'usr_apple_01',
  email: 'marcus.vinicius@lumina.edu',
  display_name: 'Marcus Vinícius',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  bio: 'Explorador da Ciência da Computação & entusiasta de interfaces Apple-style.',
  custom_role: 'Administrador',
  role_color: 'purple',
};

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-alpha',
    name: 'Engenharia & Arquitetura de Software',
    subject: 'Ciência da Computação',
    description: 'Sala focada em design patterns, Clean Architecture e microserviços escaláveis.',
    invite_code: 'LUMINA-7821',
    owner_id: 'usr_apple_01',
    members_count: 28,
    banner_gradient: 'from-blue-600/30 via-indigo-500/20 to-purple-600/30',
    canva_presentation_url: 'https://www.canva.com/design/DAFv3sI7p9k/view?embed',
    created_at: '2026-10-15T10:00:00Z',
  },
  {
    id: 'room-beta',
    name: 'UI/UX & Design Systems 2026',
    subject: 'Design Digital',
    description: 'Estudo aprofundado dos princípios de design da Apple (Human Interface Guidelines), Figma e Canva.',
    invite_code: 'APPLE-4092',
    owner_id: 'usr_apple_02',
    members_count: 42,
    banner_gradient: 'from-fuchsia-500/25 via-pink-500/20 to-rose-500/25',
    canva_presentation_url: 'https://www.canva.com/design/DAFv4_MockEmbed/view?embed',
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'room-gamma',
    name: 'Cálculo Avançado & Otimização',
    subject: 'Matemática Aplicada',
    description: 'Resolução colaborativa de listas, transformadas de Laplace e cálculo vetorial.',
    invite_code: 'MATH-1029',
    owner_id: 'usr_apple_03',
    members_count: 19,
    banner_gradient: 'from-emerald-500/25 via-teal-500/20 to-cyan-500/25',
    created_at: '2026-10-20T09:15:00Z',
  },
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-01',
    room_id: 'room-alpha',
    author: {
      name: 'Marcus Vinícius',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      role: 'Administrador',
    },
    title: '📌 Plantão de Dúvidas para o Projeto Final',
    content: 'Quinta-feira às 19h faremos uma sessão especial para revisão dos protótipos e diagramas no Canva. Não deixem de revisar o feed de resumos!',
    priority: 'urgent',
    is_pinned: true,
    created_at: '2026-10-27T16:00:00Z',
  },
  {
    id: 'not-02',
    room_id: 'room-alpha',
    author: {
      name: 'Helena Duarte',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      role: 'Moderadora',
    },
    title: '💡 Template de Apresentação Canva Disponibilizado',
    content: 'O slide master oficial da sala já está disponível na aba Canva com acesso direto.',
    priority: 'normal',
    is_pinned: true,
    created_at: '2026-10-26T11:20:00Z',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-01',
    room_id: 'room-alpha',
    title: 'Apresentação: Arquitetura de Microserviços',
    description: 'Montar slides no Canva com diagramas C4 e análise de trade-offs.',
    subject: 'Arquitetura',
    due_date: '2026-10-31T23:59:00Z',
    priority: 'urgent',
    status: 'in_progress',
    canva_link: 'https://www.canva.com/design/DAFv3sI7p9k/view',
  },
  {
    id: 'tsk-02',
    room_id: 'room-alpha',
    title: 'Artigo Científico: PostgreSQL vs NoSQL no Supabase',
    description: 'Redigir síntese sobre Row Level Security (RLS) e performance de consultas indexadas.',
    subject: 'Banco de Dados',
    due_date: '2026-11-04T18:00:00Z',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 'tsk-03',
    room_id: 'room-alpha',
    title: 'Workshop Prático: Tailwind CSS 4 & Glassmorphism Apple',
    description: 'Desenvolvimento do layout translúcido e tokens adaptativos para modo escuro/claro.',
    subject: 'Frontend',
    due_date: '2026-10-29T12:00:00Z',
    priority: 'medium',
    status: 'completed',
  },
  {
    id: 'tsk-04',
    room_id: 'room-beta',
    title: 'Redesign do Onboarding de Usuários',
    description: 'Criar protótipo de alta fidelidade no Canva com fluxo de 3 passos.',
    subject: 'UI/UX',
    due_date: '2026-11-02T20:00:00Z',
    priority: 'high',
    status: 'pending',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-01',
    title: 'Princípios de Design Apple (SF Pro & Blur)',
    content: `# Princípios Apple UI

- **Profundidade & Vidro**: Uso do efeito \`backdrop-blur-xl\` com opacidade de 70% a 80%.
- **Hierarquia Visual**: Títulos com \`font-semibold\` e rastreamento justo (\`tracking-tight\`).
- **Espaçamento**: Espaço generoso entre os cartões para respirar.
- **Feedback Tátil**: Estados de \`hover:scale-[1.01]\` e cliques responsivos.

### Próximos Passos:
- [x] Configurar esquema de cores do Dark Mode
- [x] Testar cartões translúcidos no Safari e Chrome
- [ ] Adicionar suporte a exportação em PDF`,
    icon: '🍎',
    category: 'Design & UX',
    is_favorite: true,
    updated_at: '2026-10-28T19:40:00Z',
  },
  {
    id: 'note-02',
    title: 'Checklist de Deploy 100% Free Tier',
    content: `# Configuração do Free Tier

1. **Vercel**:
   - Conectar repositório GitHub
   - Configurar variáveis \`NEXT_PUBLIC_SUPABASE_URL\` e \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
2. **Supabase**:
   - Rodar script \`schema.sql\`
   - Ativar RLS e tabelas em tempo real
3. **Resend**:
   - Chave API cadastrada para limite de 3.000 envios/mês
4. **Railway**:
   - Disponível para background workers ou WebSockets extras.`,
    icon: '⚡',
    category: 'DevOps & Nuvem',
    is_favorite: true,
    updated_at: '2026-10-28T14:10:00Z',
  },
  {
    id: 'note-03',
    title: 'Anotações de Cálculo Vetorial',
    content: `# Resumo para a Prova

- Teorema de Green: Relação entre integral de linha em torno de curva fechada e integral dupla.
- Teorema da Divergência (Gauss).
- Teorema de Stokes: Rotacional sobre a superfície.`,
    icon: '📐',
    category: 'Estudos Acadêmicos',
    is_favorite: false,
    updated_at: '2026-10-25T11:00:00Z',
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    room_id: 'room-alpha',
    user: {
      id: 'usr_02',
      email: 'helena@lumina.edu',
      display_name: 'Helena Duarte',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      bio: 'Apaixonada por design limpo e interfaces humanas.',
      custom_role: 'Moderador',
      role_color: 'emerald',
    },
    content: 'Olá pessoal! Já adicionei o slide inicial do seminário no Canva. Podem conferir na aba Canva ou pelo link fixado!',
    canva_attachment_url: 'https://www.canva.com/design/DAFv3sI7p9k/view',
    created_at: '2026-10-28T18:30:00Z',
  },
  {
    id: 'msg-02',
    room_id: 'room-alpha',
    user: {
      id: 'usr_03',
      email: 'lucas.silva@lumina.edu',
      display_name: 'Lucas Silva',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Focado em backend e banco de dados PostgreSQL.',
      custom_role: 'Aluno Destaque',
      role_color: 'blue',
    },
    content: 'Ficou excelente, Helena! Acabei de subir o resumo do capítulo 4 no Feed de Resumos. Está liberado para download e curtidas.',
    created_at: '2026-10-28T18:35:00Z',
  },
  {
    id: 'msg-03',
    room_id: 'room-alpha',
    user: CURRENT_USER,
    content: 'Perfeito, time. Já configurei o alerta de e-mail via Resend para que ninguém perca o prazo de entrega no sábado.',
    created_at: '2026-10-28T18:42:00Z',
  },
];

export const INITIAL_SUMMARIES: SummaryItem[] = [
  {
    id: 'sum-01',
    room_id: 'room-alpha',
    author: {
      id: 'usr_02',
      email: 'helena@lumina.edu',
      display_name: 'Helena Duarte',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      bio: 'Moderadora & Designer',
      custom_role: 'Moderador',
      role_color: 'emerald',
    },
    title: 'Guia Completo: Clean Architecture em 10 Minutos',
    subject: 'Arquitetura',
    description: 'Mapa mental e resumo ilustrado abordando Controllers, Use Cases, Entidades e inversão de dependências.',
    canva_embed_url: 'https://www.canva.com/design/DAFv3sI7p9k/view?embed',
    likes_count: 34,
    is_liked: true,
    tags: ['Arquitetura', 'Clean Code', 'Resumo Visual', 'Canva'],
    created_at: '2026-10-26T14:00:00Z',
  },
  {
    id: 'sum-02',
    room_id: 'room-alpha',
    author: {
      id: 'usr_03',
      email: 'lucas.silva@lumina.edu',
      display_name: 'Lucas Silva',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Estudante Destaque',
      custom_role: 'Aluno Destaque',
      role_color: 'blue',
    },
    title: 'Cheat Sheet: Supabase Row Level Security (RLS)',
    subject: 'Segurança',
    description: 'Políticas essenciais de segurança para proteger dados multi-tenant sem complexidade.',
    likes_count: 27,
    is_liked: false,
    tags: ['Supabase', 'PostgreSQL', 'Segurança', 'RLS'],
    created_at: '2026-10-27T09:30:00Z',
  },
  {
    id: 'sum-03',
    room_id: 'room-beta',
    author: CURRENT_USER,
    title: 'Cartaz Visual: Teoria das Cores & Acessibilidade WCAG 2.1',
    subject: 'Design Digital',
    description: 'Infográfico exportado do Canva com contraste de cores para Dark e Light mode.',
    canva_embed_url: 'https://www.canva.com/design/DAFv4_MockEmbed/view?embed',
    likes_count: 51,
    is_liked: true,
    tags: ['Cores', 'Acessibilidade', 'Design System', 'Canva'],
    created_at: '2026-10-28T16:15:00Z',
  },
];
