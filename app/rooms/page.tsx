"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RoomCard } from "@/components/rooms/room-card";
import { JoinRoomModal } from "@/components/rooms/join-room-modal";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { INITIAL_ROOMS, Room, CURRENT_USER } from "@/lib/mock-data";
import { Plus, KeyRound, Search, DoorOpen, Sparkles } from "lucide-react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string>(rooms[0]?.id || "");
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Create room form
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomSubject, setNewRoomSubject] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [newRoomCanva, setNewRoomCanva] = useState("");

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    // Gerador de código único estilo Apple/Lumina
    const randomCode = `LUMINA-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: newRoomName.trim(),
      subject: newRoomSubject.trim() || "Geral",
      description: newRoomDesc.trim() || "Sala de estudos colaborativos.",
      invite_code: randomCode,
      owner_id: CURRENT_USER.id,
      members_count: 1,
      banner_gradient: "from-blue-600/30 via-indigo-500/20 to-purple-600/30",
      canva_presentation_url: newRoomCanva.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    setRooms([newRoom, ...rooms]);
    setActiveRoomId(newRoom.id);
    setCreateModalOpen(false);
    setNewRoomName("");
    setNewRoomSubject("");
    setNewRoomDesc("");
    setNewRoomCanva("");
  };

  const filtered = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.invite_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <DoorOpen className="h-4 w-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Salas de Aula Privadas
              </h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Gerencie suas turmas, compartilhe códigos únicos de entrada e acerte prazos.
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
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl glass-subtle border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isActive={room.id === activeRoomId}
              onSelect={(r) => setActiveRoomId(r.id)}
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
          title="Criar Nova Sala Privada"
          description="Você será o Administrador desta sala e terá código único para convidar os membros."
        >
          <form onSubmit={handleCreateRoom} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Nome da Sala / Turma</label>
              <input
                type="text"
                required
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Ex: Engenharia de Software 2026"
                className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Disciplina / Assunto</label>
              <input
                type="text"
                required
                value={newRoomSubject}
                onChange={(e) => setNewRoomSubject(e.target.value)}
                placeholder="Ex: Ciência da Computação"
                className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Descrição Curta</label>
              <textarea
                rows={2}
                value={newRoomDesc}
                onChange={(e) => setNewRoomDesc(e.target.value)}
                placeholder="Propósito dos estudos e colaboração desta sala..."
                className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">URL de Apresentação Canva (Opcional)</label>
              <input
                type="url"
                value={newRoomCanva}
                onChange={(e) => setNewRoomCanva(e.target.value)}
                placeholder="https://www.canva.com/design/.../view?embed"
                className="w-full px-3 py-2 rounded-xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
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
              <AppleButton type="submit" variant="primary" size="md">
                Criar Sala
              </AppleButton>
            </div>
          </form>
        </AppleModal>
      </div>
    </AppShell>
  );
}
