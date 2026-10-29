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
} from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
}

const INITIAL_MEMBERS: Member[] = [
  { id: "m1", name: "Marcus Vinícius", email: "marcus@lumina.edu", role: "Administrador", isBanned: false },
  { id: "m2", name: "Helena Duarte", email: "helena@lumina.edu", role: "Moderador", isBanned: false },
  { id: "m3", name: "Lucas Silva", email: "lucas@lumina.edu", role: "Aluno Destaque", isBanned: false },
  { id: "m4", name: "Matheus Borges", email: "matheus@exemplo.com", role: "Membro", isBanned: false },
  { id: "m5", name: "Gabriel Pontes", email: "gabriel.p@exemplo.com", role: "Membro", isBanned: true },
];

export function AdminModal({ isOpen, onClose, room }: AdminModalProps) {
  const [activeTab, setActiveTab] = useState<"members" | "notice" | "task">("members");
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [copied, setCopied] = useState(false);

  // Formulário de aviso fixado
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // Formulário de nova tarefa / prazo
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskCanva, setTaskCanva] = useState("");
  const [taskSuccess, setTaskSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleBan = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isBanned: !m.isBanned } : m))
    );
  };

  const handleRemoveMember = (id: string) => {
    if (confirm("Deseja realmente remover este membro da sala?")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
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
    setTaskSuccess(true);
    setTimeout(() => {
      setTaskSuccess(false);
      setTaskTitle("");
      setTaskSubject("");
      setTaskDueDate("");
      setTaskCanva("");
    }, 2000);
  };

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Painel de Administração da Sala"
      description={`Gerenciamento da sala: ${room.name}`}
    >
      {/* Code Invite Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl glass-subtle border mb-4">
        <div>
          <span className="text-[11px] text-zinc-400 block">Código Único de Entrada:</span>
          <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
            {room.invite_code}
          </span>
        </div>
        <AppleButton variant="glass" size="sm" onClick={handleCopyCode}>
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copiado!" : "Copiar"}</span>
        </AppleButton>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 p-1 mb-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab("members")}
          className={`flex-1 py-1.5 rounded-lg apple-spring cursor-pointer ${
            activeTab === "members"
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Membros ({members.length})
        </button>
        <button
          onClick={() => setActiveTab("notice")}
          className={`flex-1 py-1.5 rounded-lg apple-spring cursor-pointer ${
            activeTab === "notice"
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Fixar Aviso
        </button>
        <button
          onClick={() => setActiveTab("task")}
          className={`flex-1 py-1.5 rounded-lg apple-spring cursor-pointer ${
            activeTab === "task"
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Criar Prazo
        </button>
      </div>

      {/* Tab: Members */}
      {activeTab === "members" && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2.5 rounded-xl glass-subtle text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {member.name}
                  </span>
                  {member.isBanned && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      Banido
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400">
                  {member.email} • {member.role}
                </span>
              </div>

              {member.role !== "Administrador" && (
                <div className="flex items-center gap-1.5">
                  <AppleButton
                    variant={member.isBanned ? "secondary" : "danger"}
                    size="sm"
                    onClick={() => handleToggleBan(member.id)}
                    title={member.isBanned ? "Desbanir" : "Banir"}
                  >
                    <UserX className="h-3 w-3" />
                    <span>{member.isBanned ? "Desbanir" : "Banir"}</span>
                  </AppleButton>
                  <AppleButton
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    title="Remover da sala"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-zinc-400 hover:text-rose-500" />
                  </AppleButton>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Fixar Aviso */}
      {activeTab === "notice" && (
        <form onSubmit={handlePublishNotice} className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-500 mb-1 font-medium">Título do Aviso</label>
            <input
              type="text"
              required
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="Ex: Entrega do Projeto de Banco de Dados"
              className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-zinc-500 mb-1 font-medium">Mensagem Completa</label>
            <textarea
              rows={3}
              required
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              placeholder="Descreva as instruções que ficarão em destaque para toda a turma..."
              className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          {noticeSuccess && (
            <p className="text-emerald-500 font-medium">Aviso fixado no mural com sucesso!</p>
          )}
          <AppleButton type="submit" variant="primary" size="md" className="w-full">
            <Pin className="h-4 w-4" />
            <span>Publicar Aviso Fixado</span>
          </AppleButton>
        </form>
      )}

      {/* Tab: Criar Prazo */}
      {activeTab === "task" && (
        <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-500 mb-1 font-medium">Título da Atividade</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Ex: Apresentação de TCC"
              className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Disciplina</label>
              <input
                type="text"
                value={taskSubject}
                onChange={(e) => setTaskSubject(e.target.value)}
                placeholder="Ex: Engenharia"
                className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Data & Hora de Entrega</label>
              <input
                type="datetime-local"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-zinc-500 mb-1 font-medium">Link Opcional de Template (Canva)</label>
            <input
              type="url"
              value={taskCanva}
              onChange={(e) => setTaskCanva(e.target.value)}
              placeholder="https://www.canva.com/design/..."
              className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {taskSuccess && (
            <p className="text-emerald-500 font-medium">Prazo cadastrado no mural de atividades!</p>
          )}
          <AppleButton type="submit" variant="primary" size="md" className="w-full">
            <CalendarPlus className="h-4 w-4" />
            <span>Cadastrar Prazo Oficial</span>
          </AppleButton>
        </form>
      )}
    </AppleModal>
  );
}
