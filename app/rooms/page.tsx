"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RoomCard } from "@/components/rooms/room-card";
import { JoinRoomModal } from "@/components/rooms/join-room-modal";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { useUser } from "@/lib/user-context";
import { ROOM_BANNER_PRESETS, ROOM_STICKERS } from "@/lib/room-themes";
import { Plus, KeyRound, Search, DoorOpen, Crown, Palette, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoomsPage() {
  const router = useRouter();
  const { rooms, createRoom, selectedRoom, setSelectedRoom } = useUser();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Create room form
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomSubject, setNewRoomSubject] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [selectedSticker, setSelectedSticker] = useState("📊");
  const [selectedBannerId, setSelectedBannerId] = useState("banner-01");

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const created = createRoom(
      newRoomName.trim(),
      newRoomSubject.trim() || "Geral",
      newRoomDesc.trim() || "Sala de estudos criada por você.",
      selectedSticker,
      selectedBannerId
    );

    setCreateModalOpen(false);
    setNewRoomName("");
    setNewRoomSubject("");
    setNewRoomDesc("");
    setSelectedSticker("📊");
    setSelectedBannerId("banner-01");

    // Navega diretamente para a nova sala
    router.push(`/rooms/${created.id}`);
  };

  const filtered = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.invite_code.toLowerCase().includes(search.toLowerCase())
  );

  const currentBannerPreset = ROOM_BANNER_PRESETS.find((b) => b.id === selectedBannerId) || ROOM_BANNER_PRESETS[0];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-xs">
                <DoorOpen className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Salas de Aula Privadas
              </h1>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Cada sala possui mural de prazos, chat da turma e chat PV próprios. Escolha banners e figurinhas personalizados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AppleButton
              variant="glass"
              size="md"
              onClick={() => setJoinModalOpen(true)}
            >
              <KeyRound className="h-4 w-4 text-blue-500" />
              <span>Entrar por Código</span>
            </AppleButton>

            <AppleButton
              variant="primary"
              size="md"
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Criar Nova Sala</span>
            </AppleButton>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome da sala, matéria ou código..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isActive={room.id === selectedRoom?.id}
              onSelect={(r) => setSelectedRoom(r)}
            />
          ))}
        </div>

        {/* Modal: Join Room by Code */}
        <JoinRoomModal
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          onJoinSuccess={(name) => {
            alert(`Acesso garantido à sala: ${name}!`);
          }}
        />

        {/* Modal: Create Room */}
        <AppleModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="👑 Criar Nova Sala Privada"
          description="Você será o Administrador desta sala. Escolha o tema visual, figurinha e compartilhe o código."
        >
          <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
            {/* Live Header Preview */}
            <div className="rounded-2xl border border-zinc-300 dark:border-zinc-700 overflow-hidden shadow-xs">
              <div
                className="h-2 w-full"
                style={{ backgroundColor: currentBannerPreset.stripHex }}
              />
              <div
                className={`p-3.5 bg-gradient-to-r ${currentBannerPreset.gradient} text-white flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-1 rounded-xl bg-black/20 backdrop-blur-xs">
                    {selectedSticker}
                  </span>
                  <div>
                    <span className="text-xs font-bold block truncate max-w-[200px]">
                      {newRoomName || "Nome da Sua Sala"}
                    </span>
                    <span className="text-[10px] text-white/80">
                      {newRoomSubject || "Disciplina"} • Preview do Visual
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs font-mono font-bold">
                  NOVA-SALA
                </span>
              </div>
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Nome da Sala / Turma <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Ex: Marketing Estratégico 2026, Biologia 3º Ano..."
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                  Disciplina / Assunto
                </label>
                <input
                  type="text"
                  required
                  value={newRoomSubject}
                  onChange={(e) => setNewRoomSubject(e.target.value)}
                  placeholder="Ex: Marketing, Gestão, TI..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                  Figurinha / Sticker do Tema
                </label>
                <select
                  value={selectedSticker}
                  onChange={(e) => setSelectedSticker(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                >
                  {ROOM_STICKERS.map((s) => (
                    <option key={s.id} value={s.emoji}>
                      {s.emoji} {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Banner Selection (First 6 presets with option to customize further later) */}
            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 text-xs">
                Tema de Fundo & Cor da Tirinha (Catálogo de 30 Banners)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROOM_BANNER_PRESETS.slice(0, 6).map((preset) => {
                  const isSelected = selectedBannerId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedBannerId(preset.id)}
                      className={`h-12 rounded-xl bg-gradient-to-r ${preset.gradient} relative overflow-hidden text-left p-2 apple-spring transition-all cursor-pointer border ${
                        isSelected
                          ? "ring-2 ring-blue-500 border-white scale-[1.03] shadow-md"
                          : "opacity-80 hover:opacity-100 border-transparent"
                      }`}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-1.5"
                        style={{ backgroundColor: preset.stripHex }}
                      />
                      <span className="text-[10px] font-bold text-white drop-shadow-sm truncate block mt-1">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                *Você poderá alterar para qualquer um dos 30 banners a qualquer momento no botão "Personalizar Sala" como Admin.
              </p>
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Descrição Curta
              </label>
              <textarea
                rows={2}
                value={newRoomDesc}
                onChange={(e) => setNewRoomDesc(e.target.value)}
                placeholder="Objetivo dos estudos e instruções para os membros..."
                className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
              />
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px] leading-relaxed">
              👑 <strong>Permissões de Admin:</strong> Como criador, apenas você poderá alterar os banners, tirinhas, adicionar prazos oficiais no mural e gerenciar os alunos.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AppleButton
                type="button"
                variant="glass"
                size="md"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancelar
              </AppleButton>
              <AppleButton type="submit" variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Criar Sala & Abrir Mural
              </AppleButton>
            </div>
          </form>
        </AppleModal>
      </div>
    </AppShell>
  );
}
