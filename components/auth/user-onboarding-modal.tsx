"use client";

import React, { useState, useEffect } from "react";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/user-context";
import { User, Mail, Shield, Check, Sparkles, Search } from "lucide-react";
import { Profile } from "@/lib/mock-data";
import { ANIMAL_AVATARS, AnimalAvatar } from "@/lib/animal-avatars";

const ROLE_CHOICES: { role: Profile["custom_role"]; color: Profile["role_color"]; label: string; desc: string }[] = [
  { role: "Administrador", color: "purple", label: "Administrador", desc: "Criador de salas e gestor de prazos" },
  { role: "Aluno Destaque", color: "blue", label: "Aluno Dedicado", desc: "Participa das salas e cumpre tarefas" },
  { role: "Moderador", color: "emerald", label: "Moderador", desc: "Organiza o chat e orienta os colegas" },
  { role: "Monitor Acadêmico", color: "amber", label: "Monitor", desc: "Tira dúvidas e auxilia nos estudos" },
];

export function UserOnboardingModal() {
  const { user, showLoginModal, setShowLoginModal, setUser, isCustomized } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Profile["custom_role"]>("Administrador");
  const [roleColor, setRoleColor] = useState<Profile["role_color"]>("purple");
  const [selectedAvatar, setSelectedAvatar] = useState<AnimalAvatar>(ANIMAL_AVATARS[0]);
  const [animalSearch, setAnimalSearch] = useState("");

  useEffect(() => {
    if (user && isCustomized) {
      setName(user.display_name);
      setEmail(user.email);
      setRole(user.custom_role);
      setRoleColor(user.role_color);
      const found = ANIMAL_AVATARS.find((a) => a.url === user.avatar_url);
      if (found) setSelectedAvatar(found);
    }
  }, [user, isCustomized]);

  const filteredAnimals = ANIMAL_AVATARS.filter((a) =>
    a.name.toLowerCase().includes(animalSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUser({
      id: user.id || `usr_${Date.now()}`,
      display_name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@estudos.com`,
      avatar_url: selectedAvatar.url,
      bio: "Estudante e membro da turma no Lumina.",
      custom_role: role,
      role_color: roleColor,
    });

    setShowLoginModal(false);
  };

  return (
    <AppleModal
      isOpen={showLoginModal}
      onClose={() => {
        if (isCustomized) setShowLoginModal(false);
      }}
      title="🐾 Crie Seu Perfil de Estudos"
      description="Digite seu nome real e escolha seu animal favorito no catálogo de 40 avatares com fundo sólido."
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Live Preview Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={selectedAvatar.url}
              alt={selectedAvatar.name}
              className="h-14 w-14 rounded-2xl object-cover shadow-sm ring-2 ring-white dark:ring-zinc-800"
            />
            <span className="absolute -bottom-1 -right-1 text-xs">
              {selectedAvatar.emoji}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                {name.trim() || "Seu Nome Aqui"}
              </span>
              <Badge variant={roleColor} size="sm">
                <Shield className="h-3 w-3" />
                {role}
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-500 truncate mt-0.5">
              Avatar: <strong className="text-zinc-700 dark:text-zinc-300">{selectedAvatar.name}</strong> • Fundo Sólido ({selectedAvatar.bgHex})
            </p>
          </div>
        </div>

        {/* Inputs: Nome e E-mail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Seu Nome de Exibição <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva, Ana Clara..."
                className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Seu E-mail (Opcional)
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@estudos.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Catálogo de 40 Animais */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold text-xs">
              🐾 Escolha seu Animal ({ANIMAL_AVATARS.length} disponíveis)
            </label>
            <div className="relative w-36 sm:w-44">
              <input
                type="text"
                value={animalSearch}
                onChange={(e) => setAnimalSearch(e.target.value)}
                placeholder="Buscar animal..."
                className="w-full pl-6 pr-2 py-1 text-[11px] rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
              <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
            </div>
          </div>

          {/* Grid de Animais com rolagem suave */}
          <div className="max-h-48 overflow-y-auto p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {filteredAnimals.map((animal) => {
              const isSelected = selectedAvatar.id === animal.id;
              return (
                <button
                  key={animal.id}
                  type="button"
                  onClick={() => setSelectedAvatar(animal)}
                  className={`group relative flex flex-col items-center p-1.5 rounded-xl transition-all ${
                    isSelected
                      ? "ring-2 ring-blue-600 dark:ring-blue-400 bg-blue-50 dark:bg-blue-950/40 scale-105"
                      : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                  }`}
                  title={`${animal.name} (${animal.bgHex})`}
                >
                  <img
                    src={animal.url}
                    alt={animal.name}
                    className="h-10 w-10 rounded-xl object-cover shadow-xs"
                  />
                  <span className="text-[10px] text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-full mt-1">
                    {animal.name}
                  </span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">
            Fundos em cores sólidas de alto contraste, sem fotos de pessoas reais.
          </p>
        </div>

        {/* Escolha de Cargo Inicial */}
        <div>
          <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 text-xs">
            Seu Cargo na Plataforma
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_CHOICES.map((c) => {
              const isSel = role === c.role;
              return (
                <button
                  key={c.role}
                  type="button"
                  onClick={() => {
                    setRole(c.role);
                    setRoleColor(c.color);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    isSel
                      ? "border-blue-500 bg-blue-500/10 dark:bg-blue-500/20 ring-1 ring-blue-500"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={c.color} size="sm">
                      {c.role}
                    </Badge>
                    {isSel && <Check className="h-3.5 w-3.5 text-blue-500" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{c.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <AppleButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center text-xs py-3 rounded-2xl shadow-md gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Começar a Usar o Lumina</span>
          </AppleButton>
        </div>
      </form>
    </AppleModal>
  );
}
