"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useUser } from "@/lib/user-context";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AdminModal } from "@/components/rooms/admin-modal";
import { CustomizeRoomModal } from "@/components/rooms/customize-room-modal";
import { DeadlineWidget } from "@/components/dashboard/deadline-widget";
import { UnifiedChat } from "@/components/chat/unified-chat";
import {
  Users,
  Copy,
  Check,
  Settings,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Share2,
  Lock,
  Crown,
  Palette,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Mail,
} from "lucide-react";
import { AppleModal } from "@/components/ui/apple-modal";
import { Task } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";

interface RoomDetailClientProps {
  roomId: string;
}

export default function RoomDetailClient({ roomId }: RoomDetailClientProps) {
  const {
    rooms,
    user,
    tasks,
    isRoomAdmin,
    roomMembers,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useUser();

  const [activeTab, setActiveTab] = useState<"tasks" | "chat" | "pv" | "members">("tasks");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [targetPvUser, setTargetPvUser] = useState<string | undefined>(undefined);

  // Estados para gerenciar prazos dentro da sala
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("medium");
  const [taskDescription, setTaskDescription] = useState("");

  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [notifySuccessId, setNotifySuccessId] = useState<string | null>(null);

  // Encontra a sala atual nos dados do usuário ou usa a primeira disponível
  const room = rooms.find((r) => r.id === roomId) || rooms[0];

  const handleCopyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!room) {
    return (
      <AppShell>
        <div className="text-center py-20 space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Sala não encontrada
          </h2>
          <Link href="/rooms">
            <AppleButton variant="primary" size="md">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para as Salas</span>
            </AppleButton>
          </Link>
        </div>
      </AppShell>
    );
  }

  const isAdmin = isRoomAdmin(room.id);

  // REGRA DE OURO: O Mural de Prazos mostra ESTRITAMENTE as tarefas desta sala específica!
  // Se entrou em Marketing, mostra tarefas de Marketing. Se entrou em Administração, tarefas de Administração!
  const roomTasks = tasks.filter((t) => t.room_id === room.id);

  const startPvWith = (memberId: string) => {
    setTargetPvUser(memberId);
    setActiveTab("pv");
  };

  const handleOpenCreateTask = () => {
    if (!isAdmin) {
      alert("Apenas o Administrador desta sala pode adicionar prazos no mural.");
      return;
    }
    setTaskTitle("");
    setTaskSubject(room.subject);
    setTaskDueDate(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16));
    setTaskPriority("medium");
    setTaskDescription("");
    setIsCreateTaskOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    if (!isAdmin) {
      alert("Apenas o Administrador pode editar entregas da sala.");
      return;
    }
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskSubject(task.subject);
    setTaskDueDate(task.due_date ? task.due_date.slice(0, 16) : "");
    setTaskPriority(task.priority);
    setTaskDescription(task.description || "");
    setIsEditTaskOpen(true);
  };

  const handleSaveCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    createTask(
      taskTitle.trim(),
      taskSubject.trim() || room.subject,
      taskDueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      taskPriority,
      taskDescription.trim() || undefined,
      room.id // Vinculado a ESTA sala!
    );

    setIsCreateTaskOpen(false);
  };

  const handleSaveEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !taskTitle.trim()) return;

    updateTask(editingTask.id, {
      title: taskTitle.trim(),
      subject: taskSubject.trim() || room.subject,
      due_date: taskDueDate || editingTask.due_date,
      priority: taskPriority,
      description: taskDescription.trim(),
    });

    setIsEditTaskOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!isAdmin) {
      alert("Apenas o Administrador pode excluir entregas do mural.");
      return;
    }
    if (confirm("Deseja realmente remover esta atividade do mural desta sala?")) {
      deleteTask(taskId);
    }
  };

  const handleSendReminder = async (task: Task) => {
    setNotifyingId(task.id);
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: task.title,
          dueDate: task.due_date,
          recipientEmail: user.email || "turma@estudos.com",
        }),
      });
      setNotifySuccessId(task.id);
      setTimeout(() => setNotifySuccessId(null), 3000);
    } catch {
      setNotifySuccessId(task.id);
      setTimeout(() => setNotifySuccessId(null), 3000);
    } finally {
      setNotifyingId(null);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back navigation & Room Actions Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 apple-spring"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para todas as salas</span>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Copiar Código */}
            <AppleButton
              variant="glass"
              size="sm"
              onClick={handleCopyCode}
              className="text-xs font-semibold"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-blue-500" />
                  <span>Código: <strong className="font-mono text-blue-600 dark:text-blue-400">{room.invite_code}</strong></span>
                </>
              )}
            </AppleButton>

            {/* Botão Personalizar Visual (Apenas Admin) */}
            {isAdmin ? (
              <AppleButton
                variant="glass"
                size="sm"
                onClick={() => setIsCustomizeOpen(true)}
                title="Mudar o banner de fundo (30 banners), cor da tirinha e figurinha"
                className="text-indigo-600 dark:text-indigo-400 border-indigo-500/30 font-bold"
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Personalizar Sala 🎨</span>
              </AppleButton>
            ) : null}

            {/* Painel do Admin */}
            <AppleButton
              variant={isAdmin ? "primary" : "glass"}
              size="sm"
              onClick={() => setIsAdminOpen(true)}
              title="Cargos e Moderação"
              className={isAdmin ? "bg-purple-600 hover:bg-purple-700 text-white font-bold" : ""}
            >
              {isAdmin ? <Crown className="h-3.5 w-3.5" /> : <Settings className="h-3.5 w-3.5" />}
              <span>{isAdmin ? "Painel Admin 👑" : "Ver Admin"}</span>
            </AppleButton>
          </div>
        </div>

        {/* Banner Personalizado com Tirinha e Figurinha Exclusivas */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-300 dark:border-zinc-800 shadow-md">
          {/* Tirinha Superior da Sala (Personalizada pelo Admin) */}
          <div
            className="h-3.5 w-full transition-all"
            style={{ backgroundColor: room.strip_hex || "#2563eb" }}
          />

          {/* Fundo do Banner com Gradiente Único */}
          <div className={`p-6 sm:p-8 bg-gradient-to-r ${room.banner_gradient || "from-blue-600 to-purple-600"} text-white relative`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Figurinha / Sticker da Sala */}
                  <span className="text-3xl sm:text-4xl p-1.5 rounded-2xl bg-black/20 backdrop-blur-sm shadow-xs">
                    {room.sticker || "✨"}
                  </span>
                  <Badge variant="zinc" size="md" className="bg-black/30 text-white border-white/20">
                    {room.subject}
                  </Badge>
                  <span className="text-xs text-white/90 font-semibold">
                    {room.members_count} aluno(s)
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/25 text-white font-bold backdrop-blur-xs flex items-center gap-1">
                      <Crown className="h-3 w-3" /> Você é o Administrador
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                  {room.name}
                </h1>

                <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* Box de Convite Rápido */}
              <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 shrink-0 text-center space-y-1">
                <span className="text-[11px] font-bold text-white/80 block uppercase tracking-wider">
                  Código da Turma
                </span>
                <p className="text-xl font-mono font-extrabold text-white">
                  {room.invite_code}
                </p>
                <p className="text-[10px] text-white/70">
                  Compartilhe com a classe
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Abas Internas da Sala (Tudo o que pertence à sala fica AQUI DENTRO) */}
        <div className="flex rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/80 p-1.5 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === "tasks"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span>Mural de Prazos da Sala ({roomTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === "chat"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <span>Chat da Turma</span>
          </button>

          <button
            onClick={() => setActiveTab("pv")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === "pv"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Lock className="h-4 w-4 text-purple-500" />
            <span>Chat PV (Privado)</span>
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded-xl apple-spring cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === "members"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Users className="h-4 w-4 text-amber-500" />
            <span>Colegas ({roomMembers.length + 1})</span>
          </button>
        </div>

        {/* 1. MURAL DE PRAZOS DA SALA (ISOLADO E EXCLUSIVO) */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-zinc-300 dark:border-zinc-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>📅 Mural de Prazos Exclusivo:</span>
                  <span className="text-blue-600 dark:text-blue-400">{room.name}</span>
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  {isAdmin
                    ? "Como Administrador, você pode criar novas entregas, alterar datas ou remover prazos deste mural."
                    : "Prazos definidos pelo criador da sala. Marque o quadrado para salvar sua conclusão pessoal."}
                </p>
              </div>

              {isAdmin && (
                <AppleButton
                  variant="primary"
                  size="sm"
                  onClick={handleOpenCreateTask}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 font-bold"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Prazo (Admin)</span>
                </AppleButton>
              )}
            </div>

            {/* Lista de Prazos desta Sala */}
            <div className="space-y-3">
              {roomTasks.length === 0 ? (
                <div className="p-12 text-center rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 text-zinc-500 space-y-2">
                  <Calendar className="h-10 w-10 mx-auto text-zinc-400 opacity-60" />
                  <p className="font-bold text-sm text-zinc-700 dark:text-zinc-300">
                    Nenhum prazo cadastrado para {room.name} ainda.
                  </p>
                  {isAdmin ? (
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      Clique em <strong>"Adicionar Prazo (Admin)"</strong> acima para publicar a primeira entrega da matéria.
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-500">
                      O administrador da sala ainda não cadastrou entregas para esta turma.
                    </p>
                  )}
                </div>
              ) : (
                roomTasks.map((task) => {
                  const isCompleted = task.status === "completed";

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "rounded-3xl glass-panel p-4 sm:p-5 border border-zinc-300 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 apple-spring group shadow-2xs",
                        isCompleted ? "opacity-60 bg-zinc-100/50 dark:bg-zinc-900/30" : "hover:border-zinc-400 dark:hover:border-zinc-700"
                      )}
                    >
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        {/* Checkbox pessoal para marcar conclusão */}
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={cn(
                            "mt-1 h-6 w-6 rounded-xl border apple-spring flex items-center justify-center shrink-0 cursor-pointer shadow-2xs transition-all",
                            isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : task.status === "in_progress"
                              ? "bg-blue-500/20 border-blue-500 text-blue-500"
                              : "border-zinc-400 dark:border-zinc-600 hover:border-blue-500 bg-white dark:bg-zinc-800"
                          )}
                          title="Marcar como concluído"
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4 stroke-[3]" />
                          ) : task.status === "in_progress" ? (
                            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                          ) : null}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={cn(
                                "text-sm font-bold tracking-tight",
                                isCompleted
                                  ? "line-through text-zinc-400 dark:text-zinc-500"
                                  : "text-zinc-900 dark:text-zinc-100"
                              )}
                            >
                              {task.title}
                            </h4>
                            <Badge variant="blue" size="sm">
                              {task.subject}
                            </Badge>
                            <Badge
                              variant={
                                task.priority === "urgent"
                                  ? "rose"
                                  : task.priority === "high"
                                  ? "amber"
                                  : "zinc"
                              }
                              size="sm"
                            >
                              {task.priority === "urgent"
                                ? "Urgente"
                                : task.priority === "high"
                                ? "Alta"
                                : "Média"}
                            </Badge>
                          </div>

                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                            {task.description}
                          </p>

                          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="h-3.5 w-3.5 text-zinc-500" />
                              Entrega: <strong className="text-zinc-800 dark:text-zinc-200">{formatDate(task.due_date)}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ações: Editar e Excluir APENAS ADMIN */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleOpenEditTask(task)}
                              className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 apple-spring"
                              title="Editar Prazo (Admin)"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 rounded-xl border border-rose-300 dark:border-rose-900/50 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 apple-spring"
                              title="Excluir Prazo (Admin)"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        <AppleButton
                          variant="glass"
                          size="sm"
                          onClick={() => handleSendReminder(task)}
                          className={cn(
                            notifySuccessId === task.id && "text-emerald-600 bg-emerald-500/15"
                          )}
                        >
                          {notifySuccessId === task.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Notificado!</span>
                            </>
                          ) : (
                            <>
                              <Mail
                                className={cn(
                                  "h-3.5 w-3.5",
                                  notifyingId === task.id && "animate-spin text-blue-500"
                                )}
                              />
                              <span>Avisar Turma</span>
                            </>
                          )}
                        </AppleButton>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 2. CHAT DA TURMA (GERAL) */}
        {activeTab === "chat" && (
          <UnifiedChat room={room} defaultTab="room" />
        )}

        {/* 3. CHAT PV (MENSAGENS PRIVADAS 1-A-1) */}
        {activeTab === "pv" && (
          <UnifiedChat room={room} defaultTab="pv" targetUserId={targetPvUser} />
        )}

        {/* 4. MEMBROS DA TURMA */}
        {activeTab === "members" && (
          <div className="rounded-3xl glass-panel p-6 border border-zinc-300 dark:border-zinc-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Participantes & Colegas de {room.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Clique em "Conversar no PV" para abrir um bate-papo privado com qualquer membro.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <AppleButton
                    variant="primary"
                    size="sm"
                    onClick={() => setIsAdminOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    <span>Gerenciar Cargos</span>
                  </AppleButton>
                )}
                <AppleButton variant="glass" size="sm" onClick={handleCopyCode}>
                  <Share2 className="h-3.5 w-3.5 text-blue-500" />
                  <span>Código de Convite</span>
                </AppleButton>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {/* O usuário atual */}
              <div className="p-3.5 rounded-2xl glass-subtle border border-zinc-300 dark:border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-500 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-zinc-900 dark:text-zinc-100">
                        {user.display_name}
                      </strong>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 font-bold">
                        (Você)
                      </span>
                      {isAdmin && (
                        <Badge variant="purple" size="sm">
                          <Crown className="h-2.5 w-2.5" /> Admin da Sala
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      {user.email} • {user.custom_role}
                    </span>
                  </div>
                </div>

                <Badge variant={user.role_color} size="sm">
                  {user.custom_role}
                </Badge>
              </div>

              {/* Colegas da turma */}
              {roomMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-2xl glass-subtle border border-zinc-200 dark:border-zinc-800 flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="h-10 w-10 rounded-xl object-cover shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-zinc-900 dark:text-zinc-100">
                          {member.name}
                        </strong>
                        <Badge
                          variant={
                            member.role === "admin"
                              ? "purple"
                              : member.role === "moderator"
                              ? "emerald"
                              : "zinc"
                          }
                          size="sm"
                        >
                          {member.role === "admin"
                            ? "Administrador"
                            : member.role === "moderator"
                            ? "Moderador"
                            : "Membro"}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {member.bio}
                      </span>
                    </div>
                  </div>

                  <AppleButton
                    variant="glass"
                    size="sm"
                    onClick={() => startPvWith(member.id)}
                    className="text-purple-600 dark:text-purple-400 font-bold"
                  >
                    <Lock className="h-3 w-3" />
                    <span>Conversar no PV</span>
                  </AppleButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Adicionar Prazo na Sala (Admin) */}
        <AppleModal
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          title={`Adicionar Prazo: ${room.name}`}
          description="Crie uma nova entrega oficial no mural exclusivo desta matéria."
        >
          <form onSubmit={handleSaveCreateTask} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Título da Entrega / Atividade <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Ex: Entrega do Plano de Marketing ou Relatório Financeiro"
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                  Disciplina
                </label>
                <input
                  type="text"
                  required
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                  Prioridade
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Data & Hora Limite (Deadline)
              </label>
              <input
                type="datetime-local"
                required
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Instruções para os Alunos
              </label>
              <textarea
                rows={3}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Detalhes sobre critérios de avaliação, links úteis ou formato do envio..."
                className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AppleButton type="button" variant="glass" size="md" onClick={() => setIsCreateTaskOpen(false)}>
                Cancelar
              </AppleButton>
              <AppleButton type="submit" variant="primary" size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Publicar no Mural de {room.name}
              </AppleButton>
            </div>
          </form>
        </AppleModal>

        {/* Modal: Editar Prazo (Admin) */}
        <AppleModal
          isOpen={isEditTaskOpen}
          onClose={() => {
            setIsEditTaskOpen(false);
            setEditingTask(null);
          }}
          title="✏️ Editar Prazo da Sala"
          description="Altere a data, prioridade ou instruções desta atividade."
        >
          <form onSubmit={handleSaveEditTask} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Título da Entrega
              </label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                  Disciplina
                </label>
                <input
                  type="text"
                  required
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                  Prioridade
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Nova Data Limite
              </label>
              <input
                type="datetime-local"
                required
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Instruções de Entrega
              </label>
              <textarea
                rows={3}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AppleButton
                type="button"
                variant="glass"
                size="md"
                onClick={() => {
                  setIsEditTaskOpen(false);
                  setEditingTask(null);
                }}
              >
                Cancelar
              </AppleButton>
              <AppleButton type="submit" variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Salvar Alterações
              </AppleButton>
            </div>
          </form>
        </AppleModal>

        {/* Modal: Personalizar Sala (30 Banners, Cores de Tirinha e Figurinhas) */}
        <CustomizeRoomModal
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          room={room}
        />

        {/* Modal: Painel de Cargos & Moderação do Admin */}
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          room={room}
        />
      </div>
    </AppShell>
  );
}
