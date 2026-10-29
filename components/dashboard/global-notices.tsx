"use client";

import React, { useState } from "react";
import { Megaphone, Sparkles, X, Plus, Pin, AlertCircle, Calendar } from "lucide-react";
import { useUser } from "@/lib/user-context";
import { Badge } from "@/components/ui/badge";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { formatTimeAgo } from "@/lib/utils";

export function GlobalNotices() {
  const { globalNotices, createGlobalNotice, dismissGlobalNotice, user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Geral");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");

  const isAdmin = user.custom_role === "Administrador";

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createGlobalNotice(title.trim(), content.trim(), tag, priority);
    setTitle("");
    setContent("");
    setIsModalOpen(false);
  };

  if (!globalNotices || globalNotices.length === 0) return null;

  return (
    <>
      <div className="rounded-3xl glass-panel p-5 sm:p-6 border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent shadow-sm space-y-4">
        {/* Header dos Recados Globais */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Mural de Recados Globais da Moderação
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  Visível a Todos
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Avisos oficiais da coordenação e novidades da plataforma (sem precisar entrar em nenhuma sala).
              </p>
            </div>
          </div>

          {isAdmin && (
            <AppleButton
              variant="glass"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="self-start sm:self-auto text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Novo Comunicado Global</span>
            </AppleButton>
          )}
        </div>

        {/* Lista de Recados Globais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {globalNotices.map((notice) => (
            <div
              key={notice.id}
              className="relative p-4 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-2 shadow-2xs hover:border-amber-400 dark:hover:border-amber-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20">
                      {notice.tag}
                    </span>
                    {notice.priority === "urgent" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 flex items-center gap-1">
                        <AlertCircle className="h-2.5 w-2.5" /> Urgente
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => dismissGlobalNotice(notice.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-opacity"
                      title="Excluir comunicado"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {notice.title}
                </h4>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed line-clamp-3 font-medium">
                  {notice.content}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                <img
                  src={notice.author_avatar}
                  alt={notice.author_name}
                  className="h-6 w-6 rounded-lg object-cover shadow-2xs"
                />
                <div className="min-w-0 flex-1 truncate">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                    {notice.author_name}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {notice.author_role} • {formatTimeAgo(notice.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Novo Comunicado Global */}
      <AppleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="📢 Publicar Comunicado Global"
        description="Este aviso aparecerá no topo do Início para todos os alunos de todas as salas."
      >
        <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Título do Comunicado <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Calendário Oficial de Provas ou Atualização da Plataforma"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Categoria / Tag
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Ex: Geral, Provas, Novidade"
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Nível de Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Mensagem Completa <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva o comunicado oficial que todos devem ler..."
              className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <AppleButton type="button" variant="glass" size="md" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </AppleButton>
            <AppleButton type="submit" variant="primary" size="md" className="bg-amber-600 hover:bg-amber-700 text-white">
              Publicar no Mural Global
            </AppleButton>
          </div>
        </form>
      </AppleModal>
    </>
  );
}
