"use client";

import React, { useState } from "react";
import { Note } from "@/lib/mock-data";
import {
  Plus,
  Trash2,
  Star,
  Search,
  CheckCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";

const EMOJI_OPTIONS = ["📝", "🍎", "⚡", "💡", "📐", "🔬", "🚀", "✨"];

export function NotionSpace() {
  const { notes, createNote, updateNote, deleteNote } = useUser();
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSavedIndicator, setIsSavedIndicator] = useState(true);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleUpdateNote = (field: keyof Note, value: any) => {
    if (!selectedNote) return;
    setIsSavedIndicator(false);
    updateNote(selectedNote.id, { [field]: value });
    setTimeout(() => setIsSavedIndicator(true), 400);
  };

  const handleCreateNote = () => {
    const created = createNote("Nova Anotação de Estudos");
    setSelectedNoteId(created.id);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) {
      alert("Mantenha ao menos uma nota no seu caderno.");
      return;
    }
    deleteNote(id);
    const remaining = notes.filter((n) => n.id !== id);
    if (remaining.length > 0) setSelectedNoteId(remaining[0].id);
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
      {/* Left Column: Notes List (Notion Sidebar) */}
      <div className="lg:col-span-4 rounded-3xl glass-panel p-5 border flex flex-col justify-between">
        <div>
          {/* Header & Add Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📓</span>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Caderno Notion
              </h3>
            </div>
            <AppleButton
              variant="primary"
              size="sm"
              onClick={handleCreateNote}
              title="Criar nova página"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nova Nota</span>
            </AppleButton>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar em todas as notas..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-subtle text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          </div>

          {/* List of Notes */}
          <div className="space-y-1.5 overflow-y-auto max-h-[500px] pr-1">
            {filteredNotes.map((note) => {
              const isSelected = note.id === selectedNote?.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-2xl cursor-pointer apple-spring transition-all group",
                    isSelected
                      ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 font-medium border border-blue-500/20"
                      : "hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base select-none shrink-0">
                      {note.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs truncate">{note.title}</p>
                      <span className="text-[10px] text-zinc-400">
                        {note.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateNote("is_favorite", !note.is_favorite);
                      }}
                      className="p-1 hover:text-amber-500 cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "h-3.5 w-3.5",
                          note.is_favorite && "fill-amber-400 text-amber-400"
                        )}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="p-1 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cloud Sync Status Apple Style */}
        <div className="pt-3 border-t border-zinc-200/50 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isSavedIndicator ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              )}
            />
            {isSavedIndicator ? "Sincronizado no Supabase" : "Salvando alterações..."}
          </span>
          <span>{notes.length} páginas</span>
        </div>
      </div>

      {/* Right Column: Notion-style Page Editor */}
      <div className="lg:col-span-8 rounded-3xl glass-panel p-6 sm:p-8 border flex flex-col justify-between">
        {selectedNote ? (
          <div>
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/60">
              {/* Emoji Icons Bar */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-400 mr-2 font-medium">
                  Ícone:
                </span>
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleUpdateNote("icon", emoji)}
                    className={cn(
                      "h-7 w-7 rounded-lg text-sm flex items-center justify-center apple-spring cursor-pointer",
                      selectedNote.icon === emoji
                        ? "bg-blue-500/20 ring-1 ring-blue-500"
                        : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Category selector */}
              <input
                type="text"
                value={selectedNote.category}
                onChange={(e) => handleUpdateNote("category", e.target.value)}
                placeholder="Categoria..."
                className="text-xs px-2.5 py-1 rounded-full glass-subtle text-zinc-600 dark:text-zinc-300 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Editable Title */}
            <div className="mb-4">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => handleUpdateNote("title", e.target.value)}
                placeholder="Sem título"
                className="w-full text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 bg-transparent focus:outline-none placeholder:text-zinc-400"
              />
            </div>

            {/* Flexible Notion-style content area */}
            <div>
              <textarea
                value={selectedNote.content}
                onChange={(e) => handleUpdateNote("content", e.target.value)}
                rows={16}
                placeholder="Pressione espaço para começar a escrever, ou anote resumos, fórmulas e tarefas..."
                className="w-full bg-transparent text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 focus:outline-none resize-none font-mono placeholder:text-zinc-400"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-20 text-zinc-400">
            <FileText className="h-12 w-12 stroke-[1.2] mb-3 opacity-50" />
            <p className="text-sm">Nenhuma nota selecionada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
