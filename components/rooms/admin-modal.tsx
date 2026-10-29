"use client";

import React, { useState } from "react";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { Room } from "@/lib/mock-data";
import {
  ShieldAlert,
  UserX,
  Pin,
  CalendarPlus,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  Shield,
  Crown,
} from "lucide-react";
import { useUser, RoomMemberContact } from "@/lib/user-context";
import { Badge } from "@/components/ui/badge";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}

export function AdminModal({ isOpen, onClose, room }: AdminModalProps) {
  const { user, isRoomAdmin, promoteMember, roomMembers, createTask } = useUser();
  const [activeTab, setActiveTab] = useState<"members" | "task" | "notice">("members");
  const [copied, setCopied] = useState(false);

  // Formulário de aviso fixado
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // Formulário de novo prazo
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState(room.subject || "Geral");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<"medium" | "high" | "urgent">("medium");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskSuccess, setTaskSuccess] = useState(false);

  const isAdmin = isRoomAdmin(room.id);
  const isOwner = room.owner_id === user.id;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleChange = (memberId: string, newRole: "admin" | "moderator" | "membro") => {
    if (!isAdmin) {
      alert("Apenas o criador ou administradores podem alterar cargos.");
      return;
    }
    promoteMember(room.id, memberId, newRole);
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle) return;
    setNoticeSuccess(true);
    setTimeout(() => {
      setNoticeSuccess(false);
      setNoticeTitle("");
      setNoticeContent("");
    }, 2000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    createTask(
      taskTitle.trim(),
      taskSubject.trim() || room.subject,
      taskDueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      taskPriority,
      taskDescription.trim() || undefined,
      room.id
    );

    setTaskSuccess(true);
    setTimeout(() => {
      setTaskSuccess(false);
      setTaskTitle("");
      setTaskDueDate("");
      setTaskDescription("");
    }, 2000);
  };

  if (!isAdmin) {
    return (
      <AppleModal
        isOpen={isOpen}
        onClose={onClose}
        title="🔒 Acesso Restrito"
        description="Apenas o criador ou administradores autorizados têm acesso a este painel."
      >
        <div className="p-6 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Você é um Membro Participante
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
            Esta sala foi criada por outro usuário. Somente quem criou a sala tem o poder de promover membros a Administrador ou alterar os prazos oficiais do mural.
          </p>
          <div className="pt-2">
            <AppleButton variant="glass" size="md" onClick={onClose}>
              Voltar à Sala
            </AppleButton>
          </div>
        </div>
      </AppleModal>
    );
  }

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="👑 Painel de Administração da Sala"
      description={`Gerenciamento da sala: ${room.name}`}
    >
      {/* Code Invite Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl glass-subtle border border-zinc-300 dark:border-zinc-700 mb-4">
        <div>
          <span className="text-[11px] text-zinc-500 block font-medium">Código de Convite da Sala:</span>
          <span className="text-sm font-mono font-extrabold text-blue-600 dark:text-blue-400">
            {room.invite_code}
          </span>
        </div>
        <AppleButton variant="glass" size="sm" onClick={handleCopyCode}>
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copiado!" : "Copiar"}</span>
        </AppleButton>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-zinc-200/80 dark:bg-zinc-800 p-1 mb-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("members")}
          className={`flex-1 py-1.5 rounded-lg apple-spring cursor-pointer ${
            activeTab === "members"
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Gestão de Cargos ({roomMembers.length + 1})
        </button>
        <button
          onClick={() => setActiveTab("task")}
          className={`flex-1 py-1.5 rounded-lg apple-spring cursor-pointer ${
            activeTab === "task"
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Novo Prazo Mural
        </button>
        <button
          onClick={() => setActiveTab("notice")}
          className={`flex-1 py-1.5 rounded-lg apple-spring cursor-pointer ${
            activeTab === "notice"
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Fixar Comunicado
        </button>
      </div>

      {/* Tab: Members & Role Management */}
      {activeTab === "members" && (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {/* O Criador (Você) */}
          <div className="flex items-center justify-between p-3 rounded-2xl glass-subtle border border-zinc-300 dark:border-zinc-700 text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-purple-500 shadow-2xs"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {user.display_name}
                  </span>
                  <Badge variant="purple" size="sm">
                    <Crown className="h-3 w-3" />
                    Criador da Sala
                  </Badge>
                </div>
                <span className="text-[11px] text-zinc-500">
                  {user.email} • Dono Principal
                </span>
              </div>
            </div>
            <span className="text-[10px] text-zinc-400 font-semibold px-2 py-1">
              Imutável
            </span>
          </div>

          {/* Outros Membros da Turma */}
          {roomMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-2xl glass-subtle border border-zinc-200 dark:border-zinc-800 text-xs hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="h-9 w-9 rounded-xl object-cover shadow-2xs shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {member.name}
                    </span>
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
                        ? "Admin"
                        : member.role === "moderator"
                        ? "Moderador"
                        : "Membro"}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-zinc-500 truncate block">
                    {member.email}
                  </span>
                </div>
              </div>

              {/* Seletor de Cargo promovido pelo Criador */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <select
                  value={member.role}
                  onChange={(e) =>
                    handleRoleChange(member.id, e.target.value as "admin" | "moderator" | "membro")
                  }
                  className="px-2 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold focus:outline-none"
                >
                  <option value="membro">Membro Comum</option>
                  <option value="moderator">Moderador</option>
                  <option value="admin">Administrador 👑</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Criar Prazo Oficial */}
      {activeTab === "task" && (
        <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Título da Entrega / Atividade <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Ex: Entrega do Artigo Final"
              className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Disciplina
              </label>
              <input
                type="text"
                value={taskSubject}
                onChange={(e) => setTaskSubject(e.target.value)}
                placeholder="Ex: Geral"
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
              Instruções de Entrega
            </label>
            <textarea
              rows={2}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Instruções para os colegas..."
              className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
            />
          </div>

          {taskSuccess && (
            <p className="text-emerald-600 dark:text-emerald-400 font-bold">
              ✓ Prazo publicado no mural da sala com sucesso!
            </p>
          )}

          <AppleButton type="submit" variant="primary" size="md" className="w-full">
            <CalendarPlus className="h-4 w-4" />
            <span>Publicar Prazo no Mural</span>
          </AppleButton>
        </form>
      )}

      {/* Tab: Fixar Aviso */}
      {activeTab === "notice" && (
        <form onSubmit={handlePublishNotice} className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Título do Comunicado
            </label>
            <input
              type="text"
              required
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="Ex: Mudança na data de prova ou aviso geral"
              className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Mensagem Completa
            </label>
            <textarea
              rows={3}
              required
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              placeholder="Descreva as instruções que ficarão em destaque para toda a turma..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
            />
          </div>

          {noticeSuccess && (
            <p className="text-emerald-600 dark:text-emerald-400 font-bold">
              ✓ Aviso fixado no topo da sala!
            </p>
          )}

          <AppleButton type="submit" variant="primary" size="md" className="w-full">
            <Pin className="h-4 w-4" />
            <span>Publicar Aviso Fixado</span>
          </AppleButton>
        </form>
      )}
    </AppleModal>
  );
}
