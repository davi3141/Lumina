"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Task } from "@/lib/mock-data";
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  Mail,
  Check,
  Edit2,
  Trash2,
  Shield,
  Crown,
  DoorOpen,
  ArrowRight,
  Filter,
} from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AppleModal } from "@/components/ui/apple-modal";
import { cn, formatDate } from "@/lib/utils";
import { useUser } from "@/lib/user-context";
import Link from "next/link";

export default function TasksPage() {
  const {
    tasks,
    rooms,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    selectedRoom,
    setSelectedRoom,
    isRoomAdmin,
    user,
  } = useUser();

  // Permite selecionar qual sala visualizar no mural
  const [activeRoomId, setActiveRoomId] = useState<string>(selectedRoom?.id || rooms[0]?.id || "sala-marketing");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "in_progress" | "completed">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [notifySuccessId, setNotifySuccessId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formPriority, setFormPriority] = useState<Task["priority"]>("medium");
  const [formDescription, setFormDescription] = useState("");

  const currentRoom = rooms.find((r) => r.id === activeRoomId) || selectedRoom || rooms[0];
  const isAdmin = isRoomAdmin(currentRoom?.id || "");

  // REGRA DE OURO: Isola estritamente as tarefas da sala ativa
  const roomTasks = tasks.filter((t) => t.room_id === currentRoom?.id);

  const handleOpenCreate = () => {
    if (!isAdmin) {
      alert("Apenas o Administrador desta sala tem permissão para cadastrar prazos oficiais no mural.");
      return;
    }
    setFormTitle("");
    setFormSubject(currentRoom?.subject || "Geral");
    setFormDueDate(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16));
    setFormPriority("medium");
    setFormDescription("");
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    if (!isAdmin) {
      alert("Apenas o Administrador pode editar entregas do mural.");
      return;
    }
    setEditingTask(task);
    setFormTitle(task.title);
    setFormSubject(task.subject);
    setFormDueDate(task.due_date ? task.due_date.slice(0, 16) : "");
    setFormPriority(task.priority);
    setFormDescription(task.description || "");
    setIsEditModalOpen(true);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    createTask(
      formTitle.trim(),
      formSubject.trim() || currentRoom?.subject || "Geral",
      formDueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      formPriority,
      formDescription.trim() || undefined,
      currentRoom?.id || "sala-marketing"
    );

    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !formTitle.trim()) return;

    updateTask(editingTask.id, {
      title: formTitle.trim(),
      subject: formSubject.trim() || currentRoom?.subject || "Geral",
      due_date: formDueDate || editingTask.due_date,
      priority: formPriority,
      description: formDescription.trim(),
    });

    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleDelete = (taskId: string) => {
    if (!isAdmin) {
      alert("Apenas administradores podem excluir entregas do mural.");
      return;
    }
    if (confirm("Tem certeza que deseja remover este prazo do mural oficial da sala?")) {
      deleteTask(taskId);
    }
  };

  const handleSendEmailReminder = async (task: Task) => {
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

  const filteredTasks = roomTasks.filter((t) => {
    if (filterStatus === "all") return true;
    return t.status === filterStatus;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Seletor Superior de Salas: Cada Sala Tem Seu Próprio Mural! */}
        <div className="rounded-3xl glass-panel p-4 sm:p-5 border border-zinc-300 dark:border-zinc-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Selecione a Sala para Visualizar o Mural Isolado:
            </span>
            <span className="text-xs text-zinc-400">
              {rooms.length} sala(s) cadastradas
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {rooms.map((room) => {
              const isSelected = room.id === currentRoom?.id;
              const count = tasks.filter((t) => t.room_id === room.id).length;

              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setActiveRoomId(room.id);
                    setSelectedRoom(room);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-xs font-bold apple-spring cursor-pointer shrink-0 transition-all flex items-center gap-2 border",
                    isSelected
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-md scale-[1.02]"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  )}
                >
                  <span className="text-base">{room.sticker || "📌"}</span>
                  <span>{room.name}</span>
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-mono",
                      isSelected
                        ? "bg-white/20 dark:bg-black/20 text-white dark:text-zinc-900"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                    )}
                  >
                    {count} prazos
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Header da Sala Selecionada com Estilo do Banner e Tirinha */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-300 dark:border-zinc-800 shadow-md">
          {/* Tirinha Superior da Sala */}
          <div
            className="h-3 w-full"
            style={{ backgroundColor: currentRoom?.strip_hex || "#3b82f6" }}
          />

          <div
            className={`p-6 bg-gradient-to-r ${
              currentRoom?.banner_gradient || "from-blue-600 to-indigo-700"
            } text-white flex flex-col md:flex-row md:items-center justify-between gap-4`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl p-1 rounded-xl bg-black/20 backdrop-blur-xs">
                  {currentRoom?.sticker}
                </span>
                <Badge variant="zinc" size="sm" className="bg-black/30 text-white border-white/20">
                  {currentRoom?.subject}
                </Badge>
                {isAdmin ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-zinc-900 font-bold flex items-center gap-1 shadow-xs">
                    <Crown className="h-3 w-3" /> Você é Admin Desta Sala
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium backdrop-blur-xs">
                    Membro da Sala
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Mural de Prazos • {currentRoom?.name}
              </h1>

              <p className="text-xs text-white/90 max-w-xl">
                {currentRoom?.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/rooms/${currentRoom?.id}`}>
                <AppleButton variant="glass" size="md" className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-bold">
                  <DoorOpen className="h-4 w-4" />
                  <span>Acessar Sala Completa (Chat & PV)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </AppleButton>
              </Link>

              {isAdmin && (
                <AppleButton
                  variant="primary"
                  size="md"
                  onClick={handleOpenCreate}
                  className="bg-white text-zinc-900 hover:bg-zinc-100 font-bold shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>Novo Prazo</span>
                </AppleButton>
              )}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilterStatus("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold apple-spring cursor-pointer shrink-0 transition-all",
                filterStatus === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "glass-subtle text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
              )}
            >
              Todas ({roomTasks.length})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold apple-spring cursor-pointer shrink-0 transition-all",
                filterStatus === "pending"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "glass-subtle text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
              )}
            >
              Pendentes ({roomTasks.filter((t) => t.status === "pending").length})
            </button>
            <button
              onClick={() => setFilterStatus("in_progress")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold apple-spring cursor-pointer shrink-0 transition-all",
                filterStatus === "in_progress"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "glass-subtle text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
              )}
            >
              Em Andamento ({roomTasks.filter((t) => t.status === "in_progress").length})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold apple-spring cursor-pointer shrink-0 transition-all",
                filterStatus === "completed"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "glass-subtle text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
              )}
            >
              Concluídas ({roomTasks.filter((t) => t.status === "completed").length})
            </button>
          </div>

          <span className="text-xs text-zinc-500 font-medium">
            Entregas exclusivas desta sala
          </span>
        </div>

        {/* Task Cards List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-10 text-center rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 text-zinc-500 space-y-2">
              <CheckSquare className="h-9 w-9 mx-auto text-zinc-400 opacity-60" />
              <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                Nenhum prazo cadastrado para {currentRoom?.name} nesta categoria.
              </p>
              {isAdmin ? (
                <p className="text-xs text-zinc-500">
                  Como Administrador desta sala, você pode cadastrar prazos clicando em "Novo Prazo".
                </p>
              ) : (
                <p className="text-xs text-zinc-500">
                  O administrador da sala ainda não publicou atividades aqui.
                </p>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isCompleted = task.status === "completed";

              return (
                <div
                  key={task.id}
                  className={cn(
                    "rounded-3xl glass-panel p-4 sm:p-5 border border-zinc-300 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 apple-spring group shadow-xs",
                    isCompleted ? "opacity-60 bg-zinc-100/50 dark:bg-zinc-900/30" : "hover:border-zinc-400 dark:hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Botão de Check para qualquer membro marcar sua conclusão pessoal */}
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
                        <h3
                          className={cn(
                            "text-sm font-bold tracking-tight",
                            isCompleted
                              ? "line-through text-zinc-400 dark:text-zinc-500"
                              : "text-zinc-900 dark:text-zinc-100"
                          )}
                        >
                          {task.title}
                        </h3>
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

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 font-medium">
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

                  {/* Task Actions (Editar e Excluir APENAS PARA ADMINS) */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 apple-spring cursor-pointer"
                          title="Editar Prazo / Entrega (Admin)"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 rounded-xl border border-rose-300 dark:border-rose-900/50 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 apple-spring cursor-pointer"
                          title="Excluir Prazo do Mural (Admin)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {/* Disparar e-mail de alerta */}
                    <AppleButton
                      variant="glass"
                      size="sm"
                      onClick={() => handleSendEmailReminder(task)}
                      title="Disparar e-mail de lembrete (Resend)"
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

        {/* Modal: Adicionar Prazo (Admin) */}
        <AppleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={`👑 Adicionar Prazo • ${currentRoom?.name}`}
          description="Como administrador da sala, defina o prazo e as instruções de entrega para toda a turma."
        >
          <form onSubmit={handleSaveCreate} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Título da Entrega / Atividade <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Entrega do Artigo Científico ou Lista 03"
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                  Disciplina / Matéria
                </label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Ex: Marketing, Gestão, TI..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                  Prioridade
                </label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as any)}
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
                Data e Horário de Entrega (Deadline)
              </label>
              <input
                type="datetime-local"
                required
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Instruções para os Alunos Desta Sala
              </label>
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Detalhes sobre formato do arquivo, regras de envio ou dicas..."
                className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AppleButton
                type="button"
                variant="glass"
                size="md"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancelar
              </AppleButton>
              <AppleButton type="submit" variant="primary" size="md">
                Publicar no Mural Desta Sala
              </AppleButton>
            </div>
          </form>
        </AppleModal>

        {/* Modal: Editar Prazo (Admin) */}
        <AppleModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          title="✏️ Editar Prazo do Mural"
          description="Altere a data, prioridade ou instruções desta atividade."
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Título da Entrega
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
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
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                  Prioridade
                </label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as any)}
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
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Instruções de Entrega
              </label>
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AppleButton
                type="button"
                variant="glass"
                size="md"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingTask(null);
                }}
              >
                Cancelar
              </AppleButton>
              <AppleButton type="submit" variant="primary" size="md">
                Salvar Alterações
              </AppleButton>
            </div>
          </form>
        </AppleModal>
      </div>
    </AppShell>
  );
}
