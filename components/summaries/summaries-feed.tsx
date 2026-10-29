"use client";

import React, { useState } from "react";
import { SummaryItem, INITIAL_SUMMARIES, CURRENT_USER } from "@/lib/mock-data";
import {
  Heart,
  BookOpen,
  Share2,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Sparkles,
  Download,
} from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AppleModal } from "@/components/ui/apple-modal";
import { cn } from "@/lib/utils";

export function SummariesFeed() {
  const [summaries, setSummaries] = useState<SummaryItem[]>(INITIAL_SUMMARIES);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("Todos");
  const [activeModalItem, setActiveModalItem] = useState<SummaryItem | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // New Summary Form State
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Engenharia");
  const [newDescription, setNewDescription] = useState("");
  const [newCanvaUrl, setNewCanvaUrl] = useState("");

  const handleToggleLike = (id: string) => {
    setSummaries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isLiked = !item.is_liked;
          return {
            ...item,
            is_liked: isLiked,
            likes_count: isLiked ? item.likes_count + 1 : item.likes_count - 1,
          };
        }
        return item;
      })
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: SummaryItem = {
      id: `sum-${Date.now()}`,
      room_id: "room-alpha",
      author: CURRENT_USER,
      title: newTitle.trim(),
      subject: newSubject,
      description: newDescription.trim(),
      canva_embed_url: newCanvaUrl.trim() || undefined,
      likes_count: 1,
      is_liked: true,
      tags: [newSubject, "Resumo Colaborativo"],
      created_at: new Date().toISOString(),
    };

    setSummaries([newItem, ...summaries]);
    setIsPublishModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewCanvaUrl("");
  };

  const subjects = ["Todos", ...Array.from(new Set(summaries.map((s) => s.subject)))];

  const filtered = summaries.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesSubject =
      selectedSubject === "Todos" || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search & Subject Chips */}
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar resumos..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl glass-subtle border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium apple-spring cursor-pointer shrink-0",
                  selectedSubject === subj
                    ? "bg-blue-600 text-white shadow-sm"
                    : "glass-subtle text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Publish Action Button */}
        <AppleButton
          variant="primary"
          size="md"
          onClick={() => setIsPublishModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Publicar Resumo</span>
        </AppleButton>
      </div>

      {/* Feed Cards Grid (Knowunity-style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl glass-panel p-5 border flex flex-col justify-between hover:shadow-lg apple-spring group"
          >
            <div>
              {/* Card Header: Author & Subject */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src={item.author.avatar_url}
                    alt={item.author.display_name}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-zinc-700"
                  />
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.author.display_name}
                    </p>
                    <span className="text-[10px] text-zinc-400">
                      {item.author.custom_role}
                    </span>
                  </div>
                </div>

                <Badge variant="blue" size="sm">
                  {item.subject}
                </Badge>
              </div>

              {/* Title & Description */}
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 apple-spring line-clamp-2">
                {item.title}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-200/50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer: Likes & Action */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-200/50 dark:border-zinc-800/60">
              <button
                onClick={() => handleToggleLike(item.id)}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium apple-spring cursor-pointer px-2 py-1 rounded-full",
                  item.is_liked
                    ? "text-rose-500 bg-rose-500/10"
                    : "text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                <Heart
                  className={cn("h-4 w-4", item.is_liked && "fill-rose-500")}
                />
                <span>{item.likes_count}</span>
              </button>

              <div className="flex items-center gap-2">
                {item.canva_embed_url && (
                  <span className="text-[10px] px-2 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                    Canva Integrado
                  </span>
                )}
                <AppleButton
                  variant="glass"
                  size="sm"
                  onClick={() => setActiveModalItem(item)}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Estudar</span>
                </AppleButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: View Material / Canva Embed */}
      {activeModalItem && (
        <AppleModal
          isOpen={!!activeModalItem}
          onClose={() => setActiveModalItem(null)}
          title={activeModalItem.title}
          description={`Publicado por ${activeModalItem.author.display_name} • ${activeModalItem.subject}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {activeModalItem.description}
            </p>

            {activeModalItem.canva_embed_url ? (
              <div className="rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/60 bg-zinc-950 p-1">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center relative">
                  <iframe
                    src={activeModalItem.canva_embed_url}
                    title={activeModalItem.title}
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl glass-subtle text-center text-zinc-400 border">
                <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Material de texto integral disponível para download.</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-zinc-400">
                {activeModalItem.likes_count} estudantes curtiram este resumo
              </span>
              <AppleButton
                variant="primary"
                size="md"
                onClick={() => {
                  alert("Download do PDF do resumo iniciado!");
                }}
              >
                <Download className="h-4 w-4" />
                <span>Baixar Material (PDF)</span>
              </AppleButton>
            </div>
          </div>
        </AppleModal>
      )}

      {/* Modal: Publicar Novo Resumo */}
      <AppleModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Publicar Material de Estudo"
        description="Compartilhe seu resumo com a comunidade da sala de aula."
      >
        <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-zinc-500 mb-1 font-medium">Título do Resumo</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Resumo Geral de Álgebra Linear"
              className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-zinc-500 mb-1 font-medium">Disciplina</label>
            <input
              type="text"
              required
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Ex: Engenharia, Design, Biologia..."
              className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-zinc-500 mb-1 font-medium">Síntese / Descrição</label>
            <textarea
              rows={3}
              required
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Escreva os tópicos principais abordados neste material..."
              className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-zinc-500 mb-1 font-medium">Link do Canva Embed (Opcional)</label>
            <input
              type="url"
              value={newCanvaUrl}
              onChange={(e) => setNewCanvaUrl(e.target.value)}
              placeholder="https://www.canva.com/design/.../view?embed"
              className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <AppleButton
              type="button"
              variant="glass"
              size="md"
              onClick={() => setIsPublishModalOpen(false)}
            >
              Cancelar
            </AppleButton>
            <AppleButton type="submit" variant="primary" size="md">
              Publicar no Feed
            </AppleButton>
          </div>
        </form>
      </AppleModal>
    </div>
  );
}
