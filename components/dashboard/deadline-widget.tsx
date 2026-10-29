"use client";

import React, { useState, useEffect } from "react";
import { Task } from "@/lib/mock-data";
import { Clock, Calendar, Mail, Check, ArrowRight } from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { useUser } from "@/lib/user-context";
import Link from "next/link";

interface DeadlineWidgetProps {
  initialTasks?: Task[];
}

export function DeadlineWidget({ initialTasks = [] }: DeadlineWidgetProps) {
  const { tasks: contextTasks, toggleTaskStatus, user, rooms, selectedRoom } = useUser();
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [notifySuccessId, setNotifySuccessId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeRoomFilter, setActiveRoomFilter] = useState<string>("all");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const allTasks = contextTasks.length > 0 ? contextTasks : initialTasks;

  // Filtra por sala selecionada na aba do widget
  const displayTasks = allTasks.filter((t) => {
    if (activeRoomFilter === "all") return true;
    return t.room_id === activeRoomFilter;
  });

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

  const calculateDaysLeft = (dueDate: string) => {
    if (!isMounted) return { label: "Agendado", isUrgent: false };
    const diff = new Date(dueDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { label: "Atrasado", isUrgent: true };
    if (days === 0) return { label: "Vence Hoje!", isUrgent: true };
    if (days === 1) return { label: "Amanhã", isUrgent: true };
    return { label: `Em ${days} dias`, isUrgent: days <= 3 };
  };

  const getRoomForTask = (roomId: string) => {
    return rooms.find((r) => r.id === roomId);
  };

  return (
    <div className="rounded-3xl glass-panel p-5 sm:p-6 border border-zinc-300 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header com Título e Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-xs">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Prazos & Entregas por Sala
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Cada sala possui seu mural isolado de datas
              </p>
            </div>
          </div>
          <Badge variant="blue" size="sm">
            {displayTasks.filter((t) => t.status !== "completed").length} pendentes
          </Badge>
        </div>

        {/* Seletor Rápido de Salas no Topo do Widget */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar border-b border-zinc-200/70 dark:border-zinc-800">
          <button
            onClick={() => setActiveRoomFilter("all")}
            className={cn(
              "px-2.5 py-1 rounded-xl text-[11px] font-bold apple-spring cursor-pointer shrink-0 transition-all",
              activeRoomFilter === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            Todas as Salas ({allTasks.length})
          </button>
          {rooms.map((room) => {
            const count = allTasks.filter((t) => t.room_id === room.id).length;
            const isSelected = activeRoomFilter === room.id;
            return (
              <button
                key={room.id}
                onClick={() => setActiveRoomFilter(room.id)}
                className={cn(
                  "px-2.5 py-1 rounded-xl text-[11px] font-bold apple-spring cursor-pointer shrink-0 transition-all flex items-center gap-1",
                  isSelected
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
              >
                <span>{room.sticker || "📌"}</span>
                <span className="truncate max-w-[110px]">{room.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Lista de Prazos Filtrados */}
        <div className="space-y-2.5">
          {displayTasks.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/30">
              Nenhum prazo cadastrado para esta sala no momento.
            </div>
          ) : (
            displayTasks.slice(0, 5).map((task) => {
              const daysInfo = calculateDaysLeft(task.due_date);
              const isCompleted = task.status === "completed";
              const taskRoom = getRoomForTask(task.room_id);

              return (
                <div
                  key={task.id}
                  className={cn(
                    "p-3.5 rounded-2xl glass-subtle border border-zinc-200 dark:border-zinc-800 transition-all apple-spring flex items-start justify-between gap-3 shadow-2xs",
                    isCompleted
                      ? "opacity-60 bg-zinc-100/50 dark:bg-zinc-900/30"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={cn(
                        "mt-0.5 h-5 w-5 rounded-lg border apple-spring flex items-center justify-center shrink-0 cursor-pointer shadow-2xs",
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-zinc-400 dark:border-zinc-600 hover:border-blue-500 bg-white dark:bg-zinc-800"
                      )}
                      title={isCompleted ? "Marcar pendente" : "Marcar como feito"}
                    >
                      {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {taskRoom && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20 flex items-center gap-1">
                            <span>{taskRoom.sticker}</span>
                            <span className="truncate max-w-[120px]">{taskRoom.name}</span>
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-xs font-bold tracking-tight truncate",
                            isCompleted
                              ? "line-through text-zinc-400 dark:text-zinc-500"
                              : "text-zinc-900 dark:text-zinc-100"
                          )}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-3 w-3" />
                          {formatDate(task.due_date)}
                        </span>
                        <span
                          className={cn(
                            "font-bold",
                            daysInfo.isUrgent
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-zinc-500 dark:text-zinc-400"
                          )}
                        >
                          • {daysInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Disparar aviso por e-mail */}
                    <AppleButton
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSendReminder(task)}
                      title="Disparar aviso por e-mail (Resend)"
                      className={cn(
                        "h-7 w-7",
                        notifySuccessId === task.id && "text-emerald-500 bg-emerald-500/10"
                      )}
                    >
                      {notifySuccessId === task.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Mail
                          className={cn(
                            "h-3.5 w-3.5",
                            notifyingId === task.id ? "animate-spin text-blue-500" : ""
                          )}
                        />
                      )}
                    </AppleButton>

                    {/* Acessar sala específica */}
                    {taskRoom && (
                      <Link href={`/rooms/${taskRoom.id}`}>
                        <button
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-500/10 transition-colors"
                          title={`Abrir sala ${taskRoom.name}`}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
