"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile, Room, Task, Note, ChatMessage, SummaryItem, Notice } from "./mock-data";

interface UserContextType {
  user: Profile;
  isCustomized: boolean;
  setUser: (profile: Profile) => void;
  updateUser: (fields: Partial<Profile>) => void;
  // Rooms
  rooms: Room[];
  selectedRoom: Room;
  setSelectedRoom: (room: Room) => void;
  createRoom: (name: string, subject: string, description: string, canvaUrl?: string) => Room;
  joinRoomByCode: (code: string) => { success: boolean; room?: Room; error?: string };
  deleteRoom: (roomId: string) => void;
  // Tasks
  tasks: Task[];
  createTask: (title: string, subject: string, dueDate: string, priority: Task["priority"], canvaLink?: string, roomId?: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  // Notes
  notes: Note[];
  createNote: (title: string, content?: string, icon?: string, category?: string) => Note;
  updateNote: (id: string, fields: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  // Chat
  messages: ChatMessage[];
  sendMessage: (roomId: string, content: string, canvaLink?: string) => void;
  // Onboarding Modal
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const DEFAULT_USER: Profile = {
  id: "usr_me",
  email: "meu.email@estudos.com",
  display_name: "Meu Nome",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  bio: "Estudante e organizador da turma.",
  custom_role: "Administrador",
  role_color: "purple",
};

const DEFAULT_ROOMS: Room[] = [
  {
    id: "sala-principal",
    name: "Minha Turma de Estudos",
    subject: "Geral",
    description: "Espaço principal para você organizar tarefas, debater matérias e convidar seus amigos pelo código.",
    invite_code: "TURMA-2026",
    owner_id: "usr_me",
    members_count: 1,
    banner_gradient: "from-blue-600/30 via-indigo-500/20 to-purple-600/30",
    canva_presentation_url: "https://www.canva.com/design/DAFv3sI7p9k/view?embed",
    created_at: "2026-10-28T12:00:00Z",
  },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: "tsk-01",
    room_id: "sala-principal",
    title: "Minha Primeira Atividade / Prazo de Entrega",
    description: "Clique no quadrado à esquerda para marcar como concluído quando terminar!",
    subject: "Geral",
    due_date: "2026-11-02T23:59:00Z",
    priority: "high",
    status: "pending",
  },
];

const DEFAULT_NOTES: Note[] = [
  {
    id: "note-me-01",
    title: "Meu Bloco de Notas Particular",
    content: "# Meus Estudos\n\n- [ ] Organizar cronograma de provas\n- [ ] Convidar amigos para a sala\n- [ ] Anotar resumos importantes",
    icon: "📝",
    category: "Geral",
    is_favorite: true,
    updated_at: "2026-10-28T12:00:00Z",
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Carregar dados salvos do localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("lumina_user");
      if (savedUser) {
        setUserState(JSON.parse(savedUser));
        setIsCustomized(true);
      } else {
        // Se nunca configurou seu nome, abre o modal de boas-vindas
        setShowLoginModal(true);
      }

      const savedRooms = localStorage.getItem("lumina_rooms");
      if (savedRooms) {
        const parsed = JSON.parse(savedRooms);
        setRooms(parsed);
        if (parsed.length > 0) setSelectedRoom(parsed[0]);
      }

      const savedTasks = localStorage.getItem("lumina_tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedNotes = localStorage.getItem("lumina_notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));

      const savedMessages = localStorage.getItem("lumina_messages");
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    } catch (e) {
      console.error("Erro ao carregar dados locais", e);
    } finally {
      setIsHydrated(true);
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

  const createRoom = (name: string, subject: string, description: string, canvaUrl?: string): Room => {
    const randomCode = `${name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "SALA")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRoom: Room = {
      id: `sala-${Date.now()}`,
      name,
      subject: subject || "Geral",
      description: description || "Sala de estudos criada por você.",
      invite_code: randomCode,
      owner_id: user.id,
      members_count: 1,
      banner_gradient: "from-blue-600/30 via-indigo-500/20 to-purple-600/30",
      canva_presentation_url: canvaUrl,
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

    // Cria a sala encontrada para o usuário
    const joinedRoom: Room = {
      id: `joined-${Date.now()}`,
      name: `Turma (${clean})`,
      subject: "Matéria de Estudos",
      description: `Sala acessada pelo código de convite ${clean}.`,
      invite_code: clean,
      owner_id: "prof_amigo",
      members_count: 5,
      banner_gradient: "from-emerald-500/30 via-teal-500/20 to-cyan-500/30",
      created_at: new Date().toISOString(),
    };
    const updated = [joinedRoom, ...rooms];
    setRooms(updated);
    setSelectedRoom(joinedRoom);
    localStorage.setItem("lumina_rooms", JSON.stringify(updated));
    return { success: true, room: joinedRoom };
  };

  const deleteRoom = (roomId: string) => {
    const updated = rooms.filter((r) => r.id !== roomId);
    setRooms(updated);
    if (selectedRoom.id === roomId && updated.length > 0) {
      setSelectedRoom(updated[0]);
    }
    localStorage.setItem("lumina_rooms", JSON.stringify(updated));
  };

  const createTask = (
    title: string,
    subject: string,
    dueDate: string,
    priority: Task["priority"],
    canvaLink?: string,
    roomId?: string
  ) => {
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      room_id: roomId || selectedRoom.id,
      title,
      description: "Atividade cadastrada no mural da sua sala.",
      subject: subject || selectedRoom.subject,
      due_date: dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      priority: priority || "medium",
      status: "pending",
      canva_link: canvaLink,
    };
    const updated = [newTask, ...tasks];
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

  const createNote = (title: string, content?: string, icon?: string, category?: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: title || "Nova Anotação",
      content: content || "# Anotações da Aula\n\n- Escreva aqui seus resumos e dúvidas.",
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

  const sendMessage = (roomId: string, content: string, canvaLink?: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      room_id: roomId,
      user: user,
      content,
      canva_attachment_url: canvaLink,
      created_at: new Date().toISOString(),
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem("lumina_messages", JSON.stringify(updated));
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
        deleteRoom,
        tasks,
        createTask,
        toggleTaskStatus,
        notes,
        createNote,
        updateNote,
        deleteNote,
        messages,
        sendMessage,
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
