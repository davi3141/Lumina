"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Task } from "@/lib/mock-data";
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  ExternalLink,
  Mail,
  Check,
  Filter,
  AlertCircle,
} from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AppleModal } from "@/components/ui/apple-modal";
import { cn, formatDate } from "@/lib/utils";
import { useUser } from "@/lib/user-context";

export default function TasksPage() {
  const { tasks, createTask, toggleTaskStatus, selectedRoom } = useUser();
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "in_progress" | "completed">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [notifySuccessId, setNotifySuccessId] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newCanvaLink, setNewCanvaLink] = useState("");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createTask(
      newTitle.trim(),
      newSubject.trim() || selectedRoom?.subject || "Geral",
      newDueDate,
      newPriority,
      newCanvaLink.trim() || undefined,
      selectedRoom?.id
    );

    setIsCreateModalOpen(false);
    setNewTitle("");
    setNewSubject("");
    setNewDueDate("");
    setNewCanvaLink("");
  };

  const handleToggleStatus = (id: string) => {
    toggleTaskStatus(id);
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
          recipientEmail: "turma@universidade.edu",
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
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <CheckSquare className="h-4 w-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Mural de Atividades & Prazos
              </h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Estilo Notion + Teams: Prazos oficiais, avisos de entrega e links de slides Canva.
            </p>
          </div>

          <AppleButton
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Prazo</span>
          </AppleButton>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterStatus("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium apple-spring cursor-pointer shrink-0",
              filterStatus === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "glass-subtle text-zinc-600 dark:text-zinc-400"
            )}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium apple-spring cursor-pointer shrink-0",
              filterStatus === "pending"
                ? "bg-amber-600 text-white shadow-sm"
                : "glass-subtle text-zinc-600 dark:text-zinc-400"
            )}
          >
            Pendentes ({tasks.filter((t) => t.status === "pending").length})
          </button>
          <button
            onClick={() => setFilterStatus("in_progress")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium apple-spring cursor-pointer shrink-0",
              filterStatus === "in_progress"
                ? "bg-blue-600 text-white shadow-sm"
                : "glass-subtle text-zinc-600 dark:text-zinc-400"
            )}
          >
            Em Andamento ({tasks.filter((t) => t.status === "in_progress").length})
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium apple-spring cursor-pointer shrink-0",
              filterStatus === "completed"
                ? "bg-emerald-600 text-white shadow-sm"
                : "glass-subtle text-zinc-600 dark:text-zinc-400"
            )}
          >
            Concluídas ({tasks.filter((t) => t.status === "completed").length})
          </button>
        </div>

        {/* Task Cards List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === "completed";

            return (
              <div
                key={task.id}
                className={cn(
                  "rounded-3xl glass-panel p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 apple-spring group",
                  isCompleted ? "opacity-60 bg-zinc-100/50 dark:bg-zinc-900/30" : "hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggleStatus(task.id)}
                    className={cn(
                      "mt-1 h-6 w-6 rounded-xl border apple-spring flex items-center justify-center shrink-0 cursor-pointer",
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : task.status === "in_progress"
                        ? "bg-blue-500/20 border-blue-500 text-blue-500"
                        : "border-zinc-300 dark:border-zinc-600 hover:border-blue-500"
                    )}
                    title="Alternar status da tarefa"
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : task.status === "in_progress" ? (
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    ) : null}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={cn(
                          "text-sm font-semibold tracking-tight",
                          isCompleted
                            ? "line-through text-zinc-400"
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

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        Entrega: {formatDate(task.due_date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {task.canva_link && (
                    <a
                      href={task.canva_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl glass-subtle text-purple-600 dark:text-purple-400 text-xs font-semibold flex items-center gap-1.5 hover:bg-purple-500/10 apple-spring"
                    >
                      <span>Canva</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  <AppleButton
                    variant="glass"
                    size="sm"
                    onClick={() => handleSendEmailReminder(task)}
                    title="Disparar e-mail de alerta para a sala (Resend)"
                    className={cn(
                      notifySuccessId === task.id && "text-emerald-500 bg-emerald-500/10"
                    )}
                  >
                    {notifySuccessId === task.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
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
          })}
        </div>

        {/* Modal: Create Task */}
        <AppleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Adicionar Prazo no Mural"
          description="Crie uma nova entrega oficial para os membros da sala de aula."
        >
          <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Título da Atividade</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Entrega do Artigo Científico"
                className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Disciplina</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Ex: Engenharia"
                  className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Prioridade</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Data & Hora Limite</label>
              <input
                type="datetime-local"
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Link do Canva (Opcional)</label>
              <input
                type="url"
                value={newCanvaLink}
                onChange={(e) => setNewCanvaLink(e.target.value)}
                placeholder="https://www.canva.com/design/..."
                className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                Publicar Prazo
              </AppleButton>
            </div>
          </form>
        </AppleModal>
      </div>
    </AppShell>
  );
}
