"use client";

import React, { useState } from "react";
import { SummaryItem, INITIAL_SUMMARIES } from "@/lib/mock-data";
import {
  Heart,
  BookOpen,
  Plus,
  Search,
  Download,
  FileText,
} from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { AppleModal } from "@/components/ui/apple-modal";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";

export function SummariesFeed() {
  const { user } = useUser();
  const [summaries, setSummaries] = useState<SummaryItem[]>(INITIAL_SUMMARIES);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("Todos");
  const [activeModalItem, setActiveModalItem] = useState<SummaryItem | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // New Summary Form State
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Geral");
  const [newDescription, setNewDescription] = useState("");

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
      room_id: "sala-principal",
      author: user,
      title: newTitle.trim(),
      subject: newSubject,
      description: newDescription.trim(),
      likes_count: 1,
      is_liked: true,
      tags: [newSubject, "Resumo da Turma"],
      created_at: new Date().toISOString(),
    };

    setSummaries([newItem, ...summaries]);
    setIsPublishModalOpen(false);
    setNewTitle("");
    setNewDescription("");
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
              placeholder="Buscar resumos e anotações..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold apple-spring cursor-pointer shrink-0 transition-all",
                  selectedSubject === subj
                    ? "bg-blue-600 text-white shadow-xs"
                    : "glass-subtle text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
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
          className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4" />
          <span>Publicar Resumo</span>
        </AppleButton>
      </div>

      {/* Feed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl glass-panel p-5 border border-zinc-300 dark:border-zinc-800 flex flex-col justify-between hover:shadow-md apple-spring group"
          >
            <div>
              {/* Card Header: Author & Subject */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src={item.author.avatar_url}
                    alt={item.author.display_name}
                    className="h-8 w-8 rounded-xl object-cover shadow-2xs"
                  />
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {item.author.display_name}
                    </p>
                    <span className="text-[10px] text-zinc-500">
                      {item.author.custom_role}
                    </span>
                  </div>
                </div>

                <Badge variant="blue" size="sm">
                  {item.subject}
                </Badge>
              </div>

              {/* Title & Description */}
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 apple-spring line-clamp-2">
                {item.title}
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer: Likes & Action */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => handleToggleLike(item.id)}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-bold apple-spring cursor-pointer px-2.5 py-1 rounded-full transition-all",
                  item.is_liked
                    ? "text-rose-600 bg-rose-500/15"
                    : "text-zinc-500 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                <Heart
                  className={cn("h-4 w-4", item.is_liked && "fill-rose-600")}
                />
                <span>{item.likes_count}</span>
              </button>

              <AppleButton
                variant="glass"
                size="sm"
                onClick={() => setActiveModalItem(item)}
              >
                <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                <span>Ler Resumo</span>
              </AppleButton>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: View Material */}
      {activeModalItem && (
        <AppleModal
          isOpen={!!activeModalItem}
          onClose={() => setActiveModalItem(null)}
          title={activeModalItem.title}
          description={`Publicado por ${activeModalItem.author.display_name} • ${activeModalItem.subject}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium whitespace-pre-line">
                {activeModalItem.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-zinc-500 font-medium">
                ❤️ {activeModalItem.likes_count} colegas curtiram
              </span>
              <AppleButton
                variant="primary"
                size="md"
                onClick={() => {
                  alert("Download do PDF iniciado!");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4" />
                <span>Salvar Material (PDF)</span>
              </AppleButton>
            </div>
          </div>
        </AppleModal>
      )}

      {/* Modal: Publicar Novo Resumo */}
      <AppleModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="📝 Publicar Material de Estudo"
        description="Compartilhe seu resumo com a comunidade da sala de aula."
      >
        <form onSubmit={handlePublish} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Título do Resumo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Resumo de Genética ou Fórmulas de Física"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Disciplina
            </label>
            <input
              type="text"
              required
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Ex: Biologia, Matemática, História..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Conteúdo / Síntese do Resumo <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Escreva os conceitos principais que você resumiu para os colegas..."
              className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
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
            <AppleButton type="submit" variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 text-white">
              Publicar no Feed
            </AppleButton>
          </div>
        </form>
      </AppleModal>
    </div>
  );
}
