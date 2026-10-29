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
  ShieldAlert,
  AlertCircle,
  FileText,
} from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AppleModal } from "@/components/ui/apple-modal";
import { cn, formatDate } from "@/lib/utils";
import { useUser } from "@/lib/user-context";

export default function TasksPage() {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    selectedRoom,
    isRoomAdmin,
    user,
  } = useUser();

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

  const currentRoomId = selectedRoom?.id || "sala-principal";
  const isAdmin = isRoomAdmin(currentRoomId);

  const handleOpenCreate = () => {
    if (!isAdmin) {
      alert("Apenas o Administrador desta sala tem permissão para adicionar prazos oficiais no mural.");
      return;
    }
    setFormTitle("");
    setFormSubject(selectedRoom?.subject || "Geral");
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
      formSubject.trim() || selectedRoom?.subject || "Geral",
      formDueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      formPriority,
      formDescription.trim() || undefined,
      currentRoomId
    );

    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !formTitle.trim()) return;

    updateTask(editingTask.id, {
      title: formTitle.trim(),
      subject: formSubject.trim() || selectedRoom?.subject || "Geral",
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

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "all") return true;
    return t.status === filterStatus;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
                <CheckSquare className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Mural de Prazos & Entregas
              </h1>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Sala: <strong className="text-zinc-800 dark:text-zinc-200">{selectedRoom?.name}</strong> •{" "}
              {isAdmin ? (
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  👑 Você é Administrador (Pode adicionar, editar e excluir prazos)
                </span>
              ) : (
                <span className="text-zinc-500">
                  👀 Prazos definidos pelo criador da sala. Marque o quadrado para concluir sua parte.
                </span>
              )}
            </p>
          </div>

          {/* Botão Novo Prazo (Aparece com destaque para Admin, ou desabilitado/informativo) */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <AppleButton
                variant="primary"
                size="md"
                onClick={handleOpenCreate}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Prazo (Admin)</span>
              </AppleButton>
            ) : (
              <Badge variant="zinc" size="md">
                <Shield className="h-3 w-3" />
                Mural Gerenciado pelo Admin
              </Badge>
            )}
          </div>
        </div>

        {/* Filter Bar */}
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
            Todas ({tasks.length})
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
            Pendentes ({tasks.filter((t) => t.status === "pending").length})
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
            Em Andamento ({tasks.filter((t) => t.status === "in_progress").length})
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
            Concluídas ({tasks.filter((t) => t.status === "completed").length})
          </button>
        </div>

        {/* Task Cards List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 text-zinc-500">
              <CheckSquare className="h-8 w-8 mx-auto mb-2 text-zinc-400 opacity-60" />
              <p className="font-semibold text-sm">Nenhum prazo encontrado nesta categoria.</p>
              {isAdmin && (
                <p className="text-xs text-zinc-400 mt-1">
                  Como Administrador, você pode clicar em "Adicionar Prazo" para cadastrar entregas.
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

                  {/* Task Actions (Editar e Excluir APENAS PARA ADMINS) */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 apple-spring"
                          title="Editar Prazo / Entrega (Admin)"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 rounded-xl border border-rose-300 dark:border-rose-900/50 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 apple-spring"
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
          title="👑 Adicionar Prazo Oficial no Mural"
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
                  placeholder="Ex: Matemática, Biologia..."
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
                Instruções para os Alunos
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
                Publicar no Mural
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
