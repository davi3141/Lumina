"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile, Room, Task, Note, ChatMessage, PvMessage } from "./mock-data";
import { ANIMAL_AVATARS } from "./animal-avatars";

// Membros fictícios para simular a turma e permitir testar o Chat PV imediatamente
export interface RoomMemberContact {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  role: "admin" | "moderator" | "membro";
  bio: string;
}

export const CLASSMATE_CONTACTS: RoomMemberContact[] = [
  {
    id: "usr_mariana",
    name: "Mariana Costa",
    email: "mariana.costa@estudos.com",
    avatar_url: ANIMAL_AVATARS[3].url, // Panda com fundo sólido menta
    role: "moderator",
    bio: "Focada em biologia e resumos organizados.",
  },
  {
    id: "usr_pedro",
    name: "Pedro Henrique",
    email: "pedro.h@estudos.com",
    avatar_url: ANIMAL_AVATARS[1].url, // Cachorrinho com fundo sólido azul
    role: "membro",
    bio: "Gosto de resolver exercícios práticos de exatas.",
  },
  {
    id: "usr_sofia",
    name: "Sofia Oliveira",
    email: "sofia.o@estudos.com",
    avatar_url: ANIMAL_AVATARS[2].url, // Raposinha com fundo sólido laranja
    role: "membro",
    bio: "Amante de história e literatura.",
  },
  {
    id: "usr_carlos",
    name: "Carlos Eduardo",
    email: "carlos.edu@estudos.com",
    avatar_url: ANIMAL_AVATARS[11].url, // Coala com fundo sólido verde-água
    role: "membro",
    bio: "Sempre online para tirar dúvidas rápidas.",
  },
];

interface UserContextType {
  user: Profile;
  isCustomized: boolean;
  setUser: (profile: Profile) => void;
  updateUser: (fields: Partial<Profile>) => void;

  // Rooms
  rooms: Room[];
  selectedRoom: Room;
  setSelectedRoom: (room: Room) => void;
  createRoom: (name: string, subject: string, description: string) => Room;
  joinRoomByCode: (code: string) => { success: boolean; room?: Room; error?: string };
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  deleteRoom: (roomId: string) => void;
  isRoomAdmin: (roomId: string, userId?: string) => boolean;
  promoteMember: (roomId: string, memberId: string, role: "admin" | "moderator" | "membro") => void;

  // Tasks / Mural de Prazos (Admin e Usuário)
  tasks: Task[];
  createTask: (title: string, subject: string, dueDate: string, priority: Task["priority"], description?: string, roomId?: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;

  // Notes
  notes: Note[];
  createNote: (title: string, content?: string, icon?: string, category?: string) => Note;
  updateNote: (id: string, fields: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Room Chat (Geral)
  messages: ChatMessage[];
  sendMessage: (roomId: string, content: string) => void;

  // Chat PV (Mensagens Privadas 1-a-1)
  pvMessages: PvMessage[];
  sendPvMessage: (recipientId: string, recipientName: string, recipientAvatar: string, content: string) => void;
  getConversationWith: (otherUserId: string) => PvMessage[];
  roomMembers: RoomMemberContact[];

  // Onboarding Modal
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const DEFAULT_USER: Profile = {
  id: "usr_me",
  email: "meu.usuario@estudos.com",
  display_name: "Meu Nome",
  avatar_url: ANIMAL_AVATARS[0].url, // Gatinho
  bio: "Estudante e organizador da turma.",
  custom_role: "Administrador",
  role_color: "purple",
};

const DEFAULT_ROOMS: Room[] = [
  {
    id: "sala-principal",
    name: "Minha Turma de Estudos",
    subject: "Geral & Projetos",
    description: "Espaço principal para você organizar tarefas, prazos e convidar seus amigos pelo código.",
    invite_code: "TURMA-2026",
    owner_id: "usr_me",
    admins: ["usr_me"],
    moderators: [],
    members_count: 5,
    banner_gradient: "from-blue-600/30 via-indigo-500/20 to-purple-600/30",
    created_at: "2026-10-28T12:00:00Z",
  },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: "tsk-01",
    room_id: "sala-principal",
    title: "Entrega do Trabalho Bimestral",
    description: "Revisar as referências e anexar o trabalho final no portal da turma.",
    subject: "Geral",
    due_date: "2026-11-04T23:59:00Z",
    priority: "urgent",
    status: "in_progress",
  },
  {
    id: "tsk-02",
    room_id: "sala-principal",
    title: "Lista de Exercícios e Dúvidas",
    description: "Fazer os exercícios de fixação e tirar dúvidas no chat ou no PV com colegas.",
    subject: "Matemática & Ciências",
    due_date: "2026-11-08T18:00:00Z",
    priority: "high",
    status: "pending",
  },
  {
    id: "tsk-03",
    room_id: "sala-principal",
    title: "Apresentação em Grupo",
    description: "Planejar os tópicos da apresentação de 10 minutos para a próxima aula.",
    subject: "Projetos",
    due_date: "2026-11-15T10:00:00Z",
    priority: "medium",
    status: "pending",
  },
];

const DEFAULT_NOTES: Note[] = [
  {
    id: "note-me-01",
    title: "Meu Bloco de Notas Pessoal",
    content: "# Meus Estudos e Metas\n\n- [x] Escolher meu avatar de animal favorito\n- [ ] Acompanhar os prazos do mural\n- [ ] Convidar amigos da turma usando o código da sala\n- [ ] Tirar dúvidas com a Lumi IA quando não entender algo",
    icon: "📝",
    category: "Geral",
    is_favorite: true,
    updated_at: "2026-10-28T12:00:00Z",
  },
];

const DEFAULT_PV_MESSAGES: PvMessage[] = [
  {
    id: "pv-01",
    sender_id: "usr_mariana",
    sender_name: "Mariana Costa",
    sender_avatar: ANIMAL_AVATARS[3].url,
    recipient_id: "usr_me",
    recipient_name: "Meu Nome",
    recipient_avatar: ANIMAL_AVATARS[0].url,
    content: "Oi! Vi que você é o criador da sala. O mural de prazos ficou super organizado, obrigado!",
    created_at: "2026-10-28T18:40:00Z",
  },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<Profile>(DEFAULT_USER);
  const [isCustomized, setIsCustomized] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room>(DEFAULT_ROOMS[0]);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [notes, setNotes] = useState<Note[]>(DEFAULT_NOTES);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pvMessages, setPvMessages] = useState<PvMessage[]>(DEFAULT_PV_MESSAGES);
  const [roomMembers, setRoomMembers] = useState<RoomMemberContact[]>(CLASSMATE_CONTACTS);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Carregar dados salvos do localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("lumina_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Garantir que o avatar não seja foto antiga humana
        if (parsed.avatar_url?.includes("unsplash.com") || !parsed.avatar_url) {
          parsed.avatar_url = ANIMAL_AVATARS[0].url;
        }
        setUserState(parsed);
        setIsCustomized(true);
      } else {
        setShowLoginModal(true);
      }

      const savedRooms = localStorage.getItem("lumina_rooms");
      if (savedRooms) {
        const parsed: Room[] = JSON.parse(savedRooms);
        setRooms(parsed);
        if (parsed.length > 0) setSelectedRoom(parsed[0]);
      }

      const savedTasks = localStorage.getItem("lumina_tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedNotes = localStorage.getItem("lumina_notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));

      const savedMessages = localStorage.getItem("lumina_messages");
      if (savedMessages) setMessages(JSON.parse(savedMessages));

      const savedPv = localStorage.getItem("lumina_pv_messages");
      if (savedPv) setPvMessages(JSON.parse(savedPv));
    } catch (e) {
      console.error("Erro ao carregar dados locais", e);
    }
  }, []);

  const setUser = (newProfile: Profile) => {
    setUserState(newProfile);
    setIsCustomized(true);
    localStorage.setItem("lumina_user", JSON.stringify(newProfile));
  };

  const updateUser = (fields: Partial<Profile>) => {
    const updated = { ...user, ...fields };
    setUserState(updated);
    setIsCustomized(true);
    localStorage.setItem("lumina_user", JSON.stringify(updated));
  };

  // Permissões rígidas: só criador ou admins explicitamente promovidos são admins
  const isRoomAdmin = (roomId: string, userId?: string): boolean => {
    const targetUserId = userId || user.id;
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return false;
    if (room.owner_id === targetUserId) return true;
    if (room.admins && room.admins.includes(targetUserId)) return true;
    return false;
  };

  const promoteMember = (roomId: string, memberId: string, role: "admin" | "moderator" | "membro") => {
    // Apenas quem é admin pode promover
    if (!isRoomAdmin(roomId)) {
      alert("Apenas o criador ou administradores desta sala podem alterar cargos.");
      return;
    }

    const updatedRooms = rooms.map((r) => {
      if (r.id === roomId) {
        let admins = [...(r.admins || [r.owner_id])];
        let moderators = [...(r.moderators || [])];

        admins = admins.filter((id) => id !== memberId);
        moderators = moderators.filter((id) => id !== memberId);

        if (role === "admin") admins.push(memberId);
        if (role === "moderator") moderators.push(memberId);

        return { ...r, admins, moderators };
      }
      return r;
    });

    setRooms(updatedRooms);
    localStorage.setItem("lumina_rooms", JSON.stringify(updatedRooms));

    // Atualiza estado local de membros
    setRoomMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role } : m))
    );
  };

  const createRoom = (name: string, subject: string, description: string): Room => {
    const randomCode = `${name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "SALA")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRoom: Room = {
      id: `sala-${Date.now()}`,
      name,
      subject: subject || "Geral",
      description: description || "Sala de estudos criada por você.",
      invite_code: randomCode,
      owner_id: user.id, // O usuário atual é o CRIADOR
      admins: [user.id], // Apenas ele é admin inicialmente
      moderators: [],
      members_count: 1,
      banner_gradient: "from-blue-600/30 via-indigo-500/20 to-purple-600/30",
      created_at: new Date().toISOString(),
    };
    const updated = [newRoom, ...rooms];
    setRooms(updated);
    setSelectedRoom(newRoom);
    localStorage.setItem("lumina_rooms", JSON.stringify(updated));
    return newRoom;
  };

  const joinRoomByCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const existing = rooms.find((r) => r.invite_code.toUpperCase() === clean);
    if (existing) {
      setSelectedRoom(existing);
      return { success: true, room: existing };
    }

    // Ao entrar por código, o dono é o criador original fictício ("usr_owner_sala")
    // O usuário entra como MEMBRO COMUM, não como admin!
    const joinedRoom: Room = {
      id: `joined-${Date.now()}`,
      name: `Turma (${clean})`,
      subject: "Matéria da Turma",
      description: `Sala acessada pelo código de convite ${clean}. Criada pelo professor/responsável.`,
      invite_code: clean,
      owner_id: "usr_owner_sala", // Dono original
      admins: ["usr_owner_sala"],
      moderators: [],
      members_count: 6,
      banner_gradient: "from-emerald-500/30 via-teal-500/20 to-cyan-500/30",
      created_at: new Date().toISOString(),
    };
    const updated = [joinedRoom, ...rooms];
    setRooms(updated);
    setSelectedRoom(joinedRoom);
    localStorage.setItem("lumina_rooms", JSON.stringify(updated));
    return { success: true, room: joinedRoom };
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    if (!isRoomAdmin(roomId)) {
      alert("Apenas administradores podem editar informações da sala.");
      return;
    }
    const updated = rooms.map((r) => (r.id === roomId ? { ...r, ...updates } : r));
    setRooms(updated);
    if (selectedRoom.id === roomId) {
      setSelectedRoom({ ...selectedRoom, ...updates });
    }
    localStorage.setItem("lumina_rooms", JSON.stringify(updated));
  };

  const deleteRoom = (roomId: string) => {
    if (!isRoomAdmin(roomId)) {
      alert("Apenas o criador pode excluir esta sala.");
      return;
    }
    const updated = rooms.filter((r) => r.id !== roomId);
    setRooms(updated);
    if (selectedRoom.id === roomId && updated.length > 0) {
      setSelectedRoom(updated[0]);
    }
    localStorage.setItem("lumina_rooms", JSON.stringify(updated));
  };

  // Tasks & Mural de Prazos
  const createTask = (
    title: string,
    subject: string,
    dueDate: string,
    priority: Task["priority"],
    description?: string,
    roomId?: string
  ) => {
    const targetRoomId = roomId || selectedRoom.id;
    // Criar prazo no mural oficial
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      room_id: targetRoomId,
      title,
      description: description || "Atividade cadastrada no mural da sala.",
      subject: subject || selectedRoom.subject,
      due_date: dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      priority: priority || "medium",
      status: "pending",
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem("lumina_tasks", JSON.stringify(updated));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    setTasks(updated);
    localStorage.setItem("lumina_tasks", JSON.stringify(updated));
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    localStorage.setItem("lumina_tasks", JSON.stringify(updated));
  };

  const toggleTaskStatus = (taskId: string) => {
    const updated: Task[] = tasks.map((t) => {
      if (t.id === taskId) {
        const next: Task["status"] =
          t.status === "completed"
            ? "pending"
            : t.status === "pending"
            ? "in_progress"
            : "completed";
        return { ...t, status: next };
      }
      return t;
    });
    setTasks(updated);
    localStorage.setItem("lumina_tasks", JSON.stringify(updated));
  };

  // Notes
  const createNote = (title: string, content?: string, icon?: string, category?: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: title || "Nova Anotação",
      content: content || "# Anotações da Aula\n\n- Escreva aqui seus resumos e metas de estudo.",
      icon: icon || "📝",
      category: category || "Geral",
      is_favorite: false,
      updated_at: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem("lumina_notes", JSON.stringify(updated));
    return newNote;
  };

  const updateNote = (id: string, fields: Partial<Note>) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, ...fields, updated_at: new Date().toISOString() } : n));
    setNotes(updated);
    localStorage.setItem("lumina_notes", JSON.stringify(updated));
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem("lumina_notes", JSON.stringify(updated));
  };

  // Room Chat (Geral)
  const sendMessage = (roomId: string, content: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      room_id: roomId,
      user: user,
      content,
      created_at: new Date().toISOString(),
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem("lumina_messages", JSON.stringify(updated));
  };

  // Chat PV (Mensagens 1-a-1)
  const sendPvMessage = (recipientId: string, recipientName: string, recipientAvatar: string, content: string) => {
    const newPv: PvMessage = {
      id: `pv-${Date.now()}`,
      sender_id: user.id,
      sender_name: user.display_name,
      sender_avatar: user.avatar_url,
      recipient_id: recipientId,
      recipient_name: recipientName,
      recipient_avatar: recipientAvatar,
      content,
      created_at: new Date().toISOString(),
    };
    const updated = [...pvMessages, newPv];
    setPvMessages(updated);
    localStorage.setItem("lumina_pv_messages", JSON.stringify(updated));
  };

  const getConversationWith = (otherUserId: string): PvMessage[] => {
    return pvMessages.filter(
      (m) =>
        (m.sender_id === user.id && m.recipient_id === otherUserId) ||
        (m.sender_id === otherUserId && m.recipient_id === user.id)
    );
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isCustomized,
        setUser,
        updateUser,
        rooms,
        selectedRoom,
        setSelectedRoom,
        createRoom,
        joinRoomByCode,
        updateRoom,
        deleteRoom,
        isRoomAdmin,
        promoteMember,
        tasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        notes,
        createNote,
        updateNote,
        deleteNote,
        messages,
        sendMessage,
        pvMessages,
        sendPvMessage,
        getConversationWith,
        roomMembers,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser utilizado dentro de um UserProvider");
  }
  return context;
}
