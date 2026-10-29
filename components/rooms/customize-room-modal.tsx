"use client";

import React, { useState } from "react";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { Room } from "@/lib/mock-data";
import { useUser } from "@/lib/user-context";
import {
  ROOM_BANNER_PRESETS,
  ROOM_STICKERS,
  RoomBannerPreset,
  RoomSticker,
} from "@/lib/room-themes";
import { Palette, Sparkles, Check, ShieldAlert, Smile, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CustomizeRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}

const STRIP_COLORS = [
  { name: "Laranja Sol", hex: "#f97316", bgClass: "bg-orange-500" },
  { name: "Índigo Profundo", hex: "#4f46e5", bgClass: "bg-indigo-600" },
  { name: "Fúcsia Cyber", hex: "#d946ef", bgClass: "bg-fuchsia-500" },
  { name: "Esmeralda", hex: "#059669", bgClass: "bg-emerald-600" },
  { name: "Azul Apple", hex: "#2563eb", bgClass: "bg-blue-600" },
  { name: "Roxo Real", hex: "#9333ea", bgClass: "bg-purple-600" },
  { name: "Ciano Água", hex: "#06b6d4", bgClass: "bg-cyan-500" },
  { name: "Rosa Flamingo", hex: "#f43f5e", bgClass: "bg-rose-500" },
  { name: "Âmbar Dourado", hex: "#f59e0b", bgClass: "bg-amber-500" },
  { name: "Preto Titânio", hex: "#3f3f46", bgClass: "bg-zinc-700" },
];

export function CustomizeRoomModal({ isOpen, onClose, room }: CustomizeRoomModalProps) {
  const { isRoomAdmin, updateRoom } = useUser();

  const [roomName, setRoomName] = useState(room.name);
  const [roomSubject, setRoomSubject] = useState(room.subject);
  const [selectedBanner, setSelectedBanner] = useState<string>(room.banner_id || "banner-01");
  const [selectedGradient, setSelectedGradient] = useState<string>(room.banner_gradient || ROOM_BANNER_PRESETS[0].gradient);
  const [selectedStripHex, setSelectedStripHex] = useState<string>(room.strip_hex || STRIP_COLORS[0].hex);
  const [selectedStripClass, setSelectedStripClass] = useState<string>(room.strip_color || STRIP_COLORS[0].bgClass);
  const [selectedSticker, setSelectedSticker] = useState<string>(room.sticker || "✨");
  const [bannerCategoryFilter, setBannerCategoryFilter] = useState<string>("Todos");

  const isAdmin = isRoomAdmin(room.id);

  const categories = ["Todos", "Gradiente", "Moderno", "Neon & Dark", "Natureza", "Minimalista", "Criativo"];

  const filteredBanners = ROOM_BANNER_PRESETS.filter((b) =>
    bannerCategoryFilter === "Todos" ? true : b.category === bannerCategoryFilter
  );

  const handleSelectBanner = (preset: RoomBannerPreset) => {
    setSelectedBanner(preset.id);
    setSelectedGradient(preset.gradient);
    setSelectedStripHex(preset.stripHex);
    setSelectedStripClass(preset.stripColor);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Apenas o Administrador desta sala pode salvar personalizações.");
      return;
    }

    updateRoom(room.id, {
      name: roomName.trim() || room.name,
      subject: roomSubject.trim() || room.subject,
      banner_id: selectedBanner,
      banner_gradient: selectedGradient,
      strip_color: selectedStripClass,
      strip_hex: selectedStripHex,
      sticker: selectedSticker,
    });

    onClose();
  };

  if (!isAdmin) {
    return (
      <AppleModal
        isOpen={isOpen}
        onClose={onClose}
        title="🔒 Acesso Restrito ao Administrador"
        description="Apenas o criador ou administradores desta sala podem alterar a aparência e o banner."
      >
        <div className="p-6 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Você não é Administrador desta sala
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Somente o dono que criou a sala pode personalizar os 30 banners, cores e figurinhas.
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
      title="🎨 Personalizar Sala de Aula (Admin)"
      description="Escolha entre os 30 banners exclusivos, selecione a cor da tirinha e defina a figurinha da sua matéria."
    >
      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Live Preview do Banner da Sala */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-300 dark:border-zinc-700 shadow-md">
          {/* Tirinha Superior Personalizada */}
          <div
            className="h-3 w-full transition-all"
            style={{ backgroundColor: selectedStripHex }}
          />

          {/* Banner de Fundo Dinâmico */}
          <div className={`p-5 bg-gradient-to-r ${selectedGradient} text-white space-y-2`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl drop-shadow-sm">{selectedSticker}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm uppercase tracking-wider">
                {roomSubject || "Matéria"}
              </span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight drop-shadow-sm">
              {roomName || "Nome da Sala"}
            </h3>
            <p className="text-[11px] text-white/80">
              Tirinha: <strong className="font-mono">{selectedStripHex}</strong> • Banner: {ROOM_BANNER_PRESETS.find(b => b.id === selectedBanner)?.name}
            </p>
          </div>
        </div>

        {/* Inputs Básicos: Nome e Matéria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Nome da Sala
            </label>
            <input
              type="text"
              required
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Disciplina / Matéria
            </label>
            <input
              type="text"
              required
              value={roomSubject}
              onChange={(e) => setRoomSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>
        </div>

        {/* 1. Escolha da Figurinha / Sticker da Sala */}
        <div>
          <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 text-xs flex items-center justify-between">
            <span>✨ Figurinha / Sticker da Sala</span>
            <span className="text-[11px] font-normal text-zinc-500">
              Selecionada: <strong>{selectedSticker}</strong>
            </span>
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            {ROOM_STICKERS.map((stk) => {
              const isSel = selectedSticker === stk.emoji;
              return (
                <button
                  key={stk.id}
                  type="button"
                  onClick={() => setSelectedSticker(stk.emoji)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all shrink-0 ${
                    isSel
                      ? "bg-white dark:bg-zinc-800 ring-2 ring-blue-500 scale-105 shadow-xs"
                      : "hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
                  }`}
                  title={`${stk.name} (${stk.suggestedSubject})`}
                >
                  <span className="text-xl">{stk.emoji}</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5 truncate max-w-[60px]">
                    {stk.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Cor da Tirinha Superior da Sala */}
        <div>
          <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 text-xs flex items-center justify-between">
            <span>🎗️ Cor da Tirinha Superior da Sala</span>
            <span className="text-[11px] font-normal font-mono text-zinc-500">
              {selectedStripHex}
            </span>
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {STRIP_COLORS.map((col) => {
              const isSel = selectedStripHex === col.hex;
              return (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => {
                    setSelectedStripHex(col.hex);
                    setSelectedStripClass(col.bgClass);
                  }}
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${col.bgClass} ${
                    isSel ? "ring-2 ring-black dark:ring-white scale-110 shadow-md" : "hover:scale-105"
                  }`}
                  title={col.name}
                >
                  {isSel && <Check className="h-4 w-4 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Catálogo de 30 Banners Exclusivos */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold text-xs">
              🖼️ Catálogo de 30 Banners Exclusivos ({ROOM_BANNER_PRESETS.length} disponíveis)
            </label>
          </div>

          {/* Categorias dos Banners */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setBannerCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 ${
                  bannerCategoryFilter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid dos Banners */}
          <div className="max-h-52 overflow-y-auto p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredBanners.map((preset) => {
              const isSel = selectedBanner === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectBanner(preset)}
                  className={`relative flex flex-col rounded-xl overflow-hidden text-left border transition-all ${
                    isSel
                      ? "ring-2 ring-blue-600 scale-[1.02] shadow-sm border-blue-500"
                      : "border-zinc-200 dark:border-zinc-700 hover:opacity-90"
                  }`}
                >
                  {/* Tirinha do preset */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: preset.stripHex }}
                  />
                  {/* Fundo Gradiente */}
                  <div className={`h-12 w-full bg-gradient-to-r ${preset.gradient} p-2 flex items-end justify-between`}>
                    <span className="text-[10px] font-bold text-white drop-shadow-sm truncate">
                      {preset.name}
                    </span>
                    {isSel && (
                      <span className="h-4 w-4 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <AppleButton type="button" variant="glass" size="md" onClick={onClose}>
            Cancelar
          </AppleButton>
          <AppleButton type="submit" variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>Salvar Personalização</span>
          </AppleButton>
        </div>
      </form>
    </AppleModal>
  );
}
