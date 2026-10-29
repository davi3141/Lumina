"use client";

import React, { useState, useEffect } from "react";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/user-context";
import { User, Mail, Shield, Check, Sparkles, Search, ArrowRight } from "lucide-react";
import { Profile } from "@/lib/mock-data";
import { ANIMAL_AVATARS, AnimalAvatar } from "@/lib/animal-avatars";

const ROLE_CHOICES: { role: Profile["custom_role"]; color: Profile["role_color"]; label: string; desc: string }[] = [
  { role: "Administrador", color: "purple", label: "Administrador", desc: "Criador de salas e prazos" },
  { role: "Aluno Destaque", color: "blue", label: "Aluno Dedicado", desc: "Cumpre tarefas e estuda" },
  { role: "Moderador", color: "emerald", label: "Moderador", desc: "Organiza o chat" },
  { role: "Monitor Acadêmico", color: "amber", label: "Monitor", desc: "Tira dúvidas" },
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
    const finalName = name.trim() || "Estudante";

    setUser({
      id: user.id || `usr_${Date.now()}`,
      display_name: finalName,
      email: email.trim() || `${finalName.toLowerCase().replace(/\s+/g, ".")}@estudos.com`,
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
        // Se já customizou antes, permite fechar; se é primeiro acesso, salva com valor padrão ao fechar
        if (!isCustomized) {
          setUser({
            ...user,
            display_name: name.trim() || "Meu Perfil",
            avatar_url: selectedAvatar.url,
          });
        }
        setShowLoginModal(false);
      }}
      title="🐾 Crie Seu Perfil de Estudos"
      description="Digite seu nome para entrar nas salas. Você pode trocar o avatar animal a qualquer momento."
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 text-xs pb-1">
        {/* Card de Preview Compacto no Topo */}
        <div className="p-3 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 flex items-center gap-3 shrink-0">
          <div className="relative shrink-0">
            <img
              src={selectedAvatar.url}
              alt={selectedAvatar.name}
              className="h-12 w-12 rounded-xl object-cover shadow-sm ring-2 ring-white dark:ring-zinc-800"
            />
            <span className="absolute -bottom-1 -right-1 text-xs">
              {selectedAvatar.emoji}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                {name.trim() || "Digite seu nome abaixo"}
              </span>
              <Badge variant={roleColor} size="sm">
                <Shield className="h-2.5 w-2.5" />
                {role}
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              Avatar: <strong className="text-zinc-700 dark:text-zinc-300">{selectedAvatar.name}</strong> • Fundo Sólido
            </p>
          </div>
        </div>

        {/* Inputs de Nome e E-mail */}
        <div className="space-y-3">
          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Seu Nome ou Apelido <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Davi, Lucas, Maria..."
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-2xs"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          <div>
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1 text-xs">
              Seu E-mail <span className="text-zinc-400 font-normal">(Opcional para avisos)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs shadow-2xs"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Catálogo de Animais com Busca Rápida */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <label className="block text-zinc-900 dark:text-zinc-100 font-bold text-xs">
              🐾 Escolha seu Bichinho ({ANIMAL_AVATARS.length} animais)
            </label>
            <div className="relative w-32 sm:w-40">
              <input
                type="text"
                value={animalSearch}
                onChange={(e) => setAnimalSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-6 pr-2 py-1 text-[11px] rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
              <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
            </div>
          </div>

          {/* Grid Compacto com Rolagem Touch Suave */}
          <div className="h-32 sm:h-36 overflow-y-auto p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 grid grid-cols-4 sm:grid-cols-6 gap-2">
            {filteredAnimals.map((animal) => {
              const isSelected = selectedAvatar.id === animal.id;
              return (
                <button
                  key={animal.id}
                  type="button"
                  onClick={() => setSelectedAvatar(animal)}
                  className={`group relative flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-blue-600 dark:ring-blue-400 bg-blue-100/60 dark:bg-blue-950/60 scale-105"
                      : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <img
                    src={animal.url}
                    alt={animal.name}
                    className="h-9 w-9 rounded-xl object-cover shadow-xs"
                  />
                  <span className="text-[10px] text-zinc-700 dark:text-zinc-300 font-semibold truncate max-w-full mt-1">
                    {animal.name}
                  </span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-xs">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Escolha do Cargo */}
        <div>
          <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 text-xs">
            Seu Cargo Inicial
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
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    isSel
                      ? "border-blue-500 bg-blue-500/10 dark:bg-blue-500/20 ring-1 ring-blue-500"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={c.color} size="sm">
                      {c.role}
                    </Badge>
                    {isSel && <Check className="h-3 w-3 text-blue-500" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{c.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 🚀 BOTÃO FIXO/STICKY: SEMPRE VISÍVEL NO CELULAR (NÃO FICA ESCONDIDO NUNCA) */}
        <div className="sticky bottom-0 z-30 pt-3 pb-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Continuar & Entrar no Lumina</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </AppleModal>
  );
}
