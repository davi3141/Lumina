import { ANIMAL_AVATARS } from "./animal-avatars";

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
  banner_gradient: string;
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
  avatar_url: ANIMAL_AVATARS[0].url, // Gatinho com fundo sólido
  bio: 'Estudante ativo da turma.',
  custom_role: 'Administrador',
  role_color: 'purple',
};

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'sala-principal',
    name: 'Turma de Estudos & Projetos',
    subject: 'Ciência & Tecnologia',
    description: 'Espaço colaborativo para acompanhar prazos, debater dúvidas e compartilhar notas.',
    invite_code: 'LUMINA-2026',
    owner_id: 'usr_me',
    admins: ['usr_me'],
    moderators: [],
    members_count: 5,
    banner_gradient: 'from-blue-600/30 via-indigo-500/20 to-purple-600/30',
    created_at: '2026-10-28T10:00:00Z',
  },
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-01',
    room_id: 'sala-principal',
    author: {
      name: 'Professor / Admin',
      avatar: ANIMAL_AVATARS[6].url, // Corujinha sábia
      role: 'Administrador',
    },
    title: '📌 Mural de Prazos Atualizado',
    content: 'Todos os prazos e entregas do bimestre foram adicionados pelo Administrador no mural. Fiquem atentos às datas!',
    priority: 'urgent',
    is_pinned: true,
    created_at: '2026-10-28T16:00:00Z',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-01',
    room_id: 'sala-principal',
    title: 'Entrega do Artigo e Relatório de Pesquisa',
    description: 'Enviar o documento em PDF revisado com todas as referências bibliográficas.',
    subject: 'Metodologia',
    due_date: '2026-11-04T23:59:00Z',
    priority: 'urgent',
    status: 'in_progress',
  },
  {
    id: 'tsk-02',
    room_id: 'sala-principal',
    title: 'Lista de Exercícios Práticos #02',
    description: 'Resolver os 10 exercícios da apostila e comparar as respostas no chat.',
    subject: 'Matemática & Lógica',
    due_date: '2026-11-07T18:00:00Z',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 'tsk-03',
    room_id: 'sala-principal',
    title: 'Seminário em Grupo: Tecnologias Modernas',
    description: 'Apresentação curta de 15 minutos destacando pontos práticos e benefícios.',
    subject: 'Tecnologia',
    due_date: '2026-11-12T14:00:00Z',
    priority: 'medium',
    status: 'pending',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-01',
    title: 'Guia de Estudos & Cronograma Pessoal',
    content: `# Meu Plano de Estudos\n\n- [x] Entrar nas salas com código de convite\n- [ ] Revisar prazos semanais no Mural\n- [ ] Tirar dúvidas com colegas no Chat PV\n- [ ] Usar a Lumi IA para simplificar conceitos difíceis`,
    icon: '📝',
    category: 'Geral',
    is_favorite: true,
    updated_at: '2026-10-28T19:40:00Z',
  },
  {
    id: 'note-02',
    title: 'Resumos Rápidos para a Prova',
    content: `# Resumo de Fórmulas e Conceitos\n\n- Revisar conceitos fundamentais\n- Focar nas questões com maior peso\n- Praticar pelo menos 30 minutos por dia`,
    icon: '⚡',
    category: 'Estudos',
    is_favorite: true,
    updated_at: '2026-10-28T14:10:00Z',
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    room_id: 'sala-principal',
    user: {
      id: 'usr_amigo_01',
      email: 'mariana@estudos.com',
      display_name: 'Mariana',
      avatar_url: ANIMAL_AVATARS[3].url, // Panda
      bio: 'Focada em resumos e química.',
      custom_role: 'Moderador',
      role_color: 'emerald',
    },
    content: 'Olá pessoal! O mural de prazos foi atualizado pelo Admin. Não se esqueçam de marcar as tarefas conforme forem concluindo!',
    created_at: '2026-10-28T18:30:00Z',
  },
  {
    id: 'msg-02',
    room_id: 'sala-principal',
    user: {
      id: 'usr_amigo_02',
      email: 'pedro@estudos.com',
      display_name: 'Pedro',
      avatar_url: ANIMAL_AVATARS[1].url, // Cachorrinho
      bio: 'Estudante curioso.',
      custom_role: 'Aluno Destaque',
      role_color: 'blue',
    },
    content: 'Boa! Qualquer dúvida nos exercícios podem me chamar no Chat PV que ajudo a resolver.',
    created_at: '2026-10-28T18:35:00Z',
  },
];

export const INITIAL_SUMMARIES: SummaryItem[] = [
  {
    id: 'sum-01',
    room_id: 'sala-principal',
    author: {
      id: 'usr_amigo_01',
      email: 'mariana@estudos.com',
      display_name: 'Mariana',
      avatar_url: ANIMAL_AVATARS[3].url,
      bio: 'Moderadora',
      custom_role: 'Moderador',
      role_color: 'emerald',
    },
    title: 'Resumo Completo: Métodos Ágeis e Gestão de Tempo',
    subject: 'Metodologia',
    description: 'Guia prático para organizar semanas de estudo com blocos de foco de 25 minutos.',
    likes_count: 24,
    is_liked: true,
    tags: ['Produtividade', 'Estudos', 'Organização'],
    created_at: '2026-10-28T14:00:00Z',
  },
];
