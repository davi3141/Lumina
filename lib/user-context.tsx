"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Profile,
  Room,
  Task,
  Note,
  ChatMessage,
  PvMessage,
  GlobalNotice,
  INITIAL_ROOMS,
  INITIAL_TASKS,
  INITIAL_GLOBAL_NOTICES,
} from "./mock-data";
import { ANIMAL_AVATARS } from "./animal-avatars";
import { ROOM_BANNER_PRESETS, ROOM_STICKERS } from "./room-themes";

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
    avatar_url: ANIMAL_AVATARS[3].url, // Panda
    role: "moderator",
    bio: "Focada em marketing e resumos organizados.",
  },
  {
    id: "usr_pedro",
    name: "Pedro Henrique",
    email: "pedro.h@estudos.com",
    avatar_url: ANIMAL_AVATARS[1].url, // Cachorrinho
    role: "membro",
    bio: "Especialista em finanças e planilhas.",
  },
  {
    id: "usr_sofia",
    name: "Sofia Oliveira",
    email: "sofia.o@estudos.com",
    avatar_url: ANIMAL_AVATARS[2].url, // Raposinha
    role: "membro",
    bio: "Estudante de engenharia e dados.",
  },
  {
    id: "usr_carlos",
    name: "Carlos Eduardo",
    email: "carlos.edu@estudos.com",
    avatar_url: ANIMAL_AVATARS[11].url, // Coala
    role: "membro",
    bio: "Sempre online para tirar dúvidas no PV.",
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
  createRoom: (name: string, subject: string, description: string, sticker?: string, bannerId?: string) => Room;
  joinRoomByCode: (code: string) => { success: boolean; room?: Room; error?: string };
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  deleteRoom: (roomId: string) => void;
  isRoomAdmin: (roomId: string, userId?: string) => boolean;
  promoteMember: (roomId: string, memberId: string, role: "admin" | "moderator" | "membro") => void;

  // Tasks / Mural de Prazos Isolados por Sala
  tasks: Task[];
  getTasksForRoom: (roomId: string) => Task[];
  createTask: (title: string, subject: string, dueDate: string, priority: Task["priority"], description?: string, roomId?: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;

  // Recados Globais da Moderação (Visíveis no Início)
  globalNotices: GlobalNotice[];
  createGlobalNotice: (title: string, content: string, tag?: string, priority?: GlobalNotice["priority"]) => void;
  dismissGlobalNotice: (id: string) => void;

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
  bio: "Estudante e administrador no Lumina.",
  custom_role: "Administrador",
  role_color: "purple",
};

const DEFAULT_NOTES: Note[] = [
  {
    id: "note-me-01",
    title: "Meu Bloco de Notas Pessoal",
    content: "# Meus Estudos e Metas\n\n- [x] Escolher meu avatar de animal favorito\n- [ ] Acessar os prazos da sala de Marketing\n- [ ] Acompanhar os prazos da sala de Administração\n- [ ] Conversar com colegas no Chat PV\n- [ ] Tirar dúvidas com a Lumi IA",
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
    content: "Oi! Vi que você personalizou o banner da sala de Marketing. Ficou incrível!",
    created_at: "2026-10-28T18:40:00Z",
  },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<Profile>(DEFAULT_USER);
  const [isCustomized, setIsCustomized] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room>(INITIAL_ROOMS[0]);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [globalNotices, setGlobalNotices] = useState<GlobalNotice[]>(INITIAL_GLOBAL_NOTICES);
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
        if (parsed.avatar_url?.includes("unsplash.com") || !parsed.avatar_url) {
          parsed.avatar_url = ANIMAL_AVATARS[0].url;
        }
        setUserState(parsed);
        setIsCustomized(true);
      } else {
        setShowLoginModal(true);
      }

      const savedRooms = localStorage.getItem("lumina_rooms_v2");
      if (savedRooms) {
        const parsed: Room[] = JSON.parse(savedRooms);
        setRooms(parsed);
        if (parsed.length > 0) setSelectedRoom(parsed[0]);
      }

      const savedTasks = localStorage.getItem("lumina_tasks_v2");
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedGlobal = localStorage.getItem("lumina_global_notices");
      if (savedGlobal) setGlobalNotices(JSON.parse(savedGlobal));

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

  // Permissões de Admin rígidas: apenas quem criou ou foi promovido explicitamente
  const isRoomAdmin = (roomId: string, userId?: string): boolean => {
    const targetUserId = userId || user.id;
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return false;
    if (room.owner_id === targetUserId) return true;
    if (room.admins && room.admins.includes(targetUserId)) return true;
    return false;
  };

  const promoteMember = (roomId: string, memberId: string, role: "admin" | "moderator" | "membro") => {
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
    localStorage.setItem("lumina_rooms_v2", JSON.stringify(updatedRooms));

    setRoomMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role } : m))
    );
  };

  const createRoom = (
    name: string,
    subject: string,
    description: string,
    sticker: string = "✨",
    bannerId: string = "banner-01"
  ): Room => {
    const preset = ROOM_BANNER_PRESETS.find((b) => b.id === bannerId) || ROOM_BANNER_PRESETS[0];
    const randomCode = `${name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "SALA")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRoom: Room = {
      id: `sala-${Date.now()}`,
      name,
      subject: subject || "Geral",
      description: description || "Sala de estudos criada por você.",
      invite_code: randomCode,
      owner_id: user.id,
      admins: [user.id],
      moderators: [],
      members_count: 1,
      banner_id: preset.id,
      banner_gradient: preset.gradient,
      strip_color: preset.stripColor,
      strip_hex: preset.stripHex,
      sticker: sticker || "✨",
      accent_color: preset.accentBadge,
      created_at: new Date().toISOString(),
    };

    const updated = [newRoom, ...rooms];
    setRooms(updated);
    setSelectedRoom(newRoom);
    localStorage.setItem("lumina_rooms_v2", JSON.stringify(updated));
    return newRoom;
  };

  const joinRoomByCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const existing = rooms.find((r) => r.invite_code.toUpperCase() === clean);
    if (existing) {
      setSelectedRoom(existing);
      return { success: true, room: existing };
    }

    const joinedRoom: Room = {
      id: `joined-${Date.now()}`,
      name: `Turma (${clean})`,
      subject: "Matéria da Turma",
      description: `Sala acessada pelo código de convite ${clean}. Criada pelo professor/responsável.`,
      invite_code: clean,
      owner_id: "usr_owner_sala", // Outro usuário é o criador
      admins: ["usr_owner_sala"],
      moderators: [],
      members_count: 6,
      banner_id: "banner-08",
      banner_gradient: "from-violet-400 via-purple-500 to-indigo-600",
      strip_color: "bg-violet-500",
      strip_hex: "#8b5cf6",
      sticker: "📚",
      created_at: new Date().toISOString(),
    };

    const updated = [joinedRoom, ...rooms];
    setRooms(updated);
    setSelectedRoom(joinedRoom);
    localStorage.setItem("lumina_rooms_v2", JSON.stringify(updated));
    return { success: true, room: joinedRoom };
  };

  // Personalização da Sala (Apenas Admins)
  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    if (!isRoomAdmin(roomId)) {
      alert("Apenas o Administrador desta sala pode personalizar o banner, cores e figurinhas.");
      return;
    }

    const updated = rooms.map((r) => (r.id === roomId ? { ...r, ...updates } : r));
    setRooms(updated);
    if (selectedRoom.id === roomId) {
      setSelectedRoom({ ...selectedRoom, ...updates });
    }
    localStorage.setItem("lumina_rooms_v2", JSON.stringify(updated));
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
    localStorage.setItem("lumina_rooms_v2", JSON.stringify(updated));
  };

  // Prazos Isolados por Sala
  const getTasksForRoom = (roomId: string): Task[] => {
    return tasks.filter((t) => t.room_id === roomId);
  };

  const createTask = (
    title: string,
    subject: string,
    dueDate: string,
    priority: Task["priority"],
    description?: string,
    roomId?: string
  ) => {
    const targetRoomId = roomId || selectedRoom.id;
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      room_id: targetRoomId, // Vinculada estritamente à sala alvo!
      title,
      description: description || "Atividade cadastrada no mural da sala.",
      subject: subject || selectedRoom.subject,
      due_date: dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      priority: priority || "medium",
      status: "pending",
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem("lumina_tasks_v2", JSON.stringify(updated));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    setTasks(updated);
    localStorage.setItem("lumina_tasks_v2", JSON.stringify(updated));
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    localStorage.setItem("lumina_tasks_v2", JSON.stringify(updated));
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
    localStorage.setItem("lumina_tasks_v2", JSON.stringify(updated));
  };

  // Recados Globais da Moderação
  const createGlobalNotice = (title: string, content: string, tag: string = "Geral", priority: GlobalNotice["priority"] = "normal") => {
    const newNotice: GlobalNotice = {
      id: `gn-${Date.now()}`,
      author_name: user.display_name,
      author_avatar: user.avatar_url,
      author_role: user.custom_role,
      title,
      content,
      tag,
      priority,
      created_at: new Date().toISOString(),
    };
    const updated = [newNotice, ...globalNotices];
    setGlobalNotices(updated);
    localStorage.setItem("lumina_global_notices", JSON.stringify(updated));
  };

  const dismissGlobalNotice = (id: string) => {
    const updated = globalNotices.filter((n) => n.id !== id);
    setGlobalNotices(updated);
    localStorage.setItem("lumina_global_notices", JSON.stringify(updated));
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
        getTasksForRoom,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        globalNotices,
        createGlobalNotice,
        dismissGlobalNotice,
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
