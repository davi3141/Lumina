"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RoomCard } from "@/components/rooms/room-card";
import { JoinRoomModal } from "@/components/rooms/join-room-modal";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { useUser } from "@/lib/user-context";
import { Plus, KeyRound, Search, DoorOpen, Crown } from "lucide-react";
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

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const created = createRoom(
      newRoomName.trim(),
      newRoomSubject.trim() || "Geral",
      newRoomDesc.trim() || "Sala de estudos criada por você."
    );

    setCreateModalOpen(false);
    setNewRoomName("");
    setNewRoomSubject("");
    setNewRoomDesc("");

    // Navega diretamente para a nova sala
    router.push(`/rooms/${created.id}`);
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
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-xs">
                <DoorOpen className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Salas de Aula Privadas
              </h1>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Crie salas com código único. Você será o Administrador e poderá escolher quem gerencia prazos.
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
          description="Você será o Administrador desta sala. Compartilhe o código para os colegas entrarem."
        >
          <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Nome da Sala / Turma <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Ex: Engenharia de Software 2026, 3º Ano B..."
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Disciplina / Assunto Principal
              </label>
              <input
                type="text"
                required
                value={newRoomSubject}
                onChange={(e) => setNewRoomSubject(e.target.value)}
                placeholder="Ex: Matemática, Biologia, TI..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
                Descrição Curta
              </label>
              <textarea
                rows={2}
                value={newRoomDesc}
                onChange={(e) => setNewRoomDesc(e.target.value)}
                placeholder="Propósito dos estudos e colaboração desta sala..."
                className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
              />
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px] leading-relaxed">
              👑 <strong>Permissões de Admin:</strong> Como criador, você poderá gerenciar quem pode ser promovido a admin, adicionar prazos no mural e remover participantes.
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
              <AppleButton type="submit" variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 text-white">
                Criar Sala
              </AppleButton>
            </div>
          </form>
        </AppleModal>
      </div>
    </AppShell>
  );
}
