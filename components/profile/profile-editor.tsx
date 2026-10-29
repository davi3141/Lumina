"use client";

import React, { useState, useEffect } from "react";
import { Profile } from "@/lib/mock-data";
import { Shield, Sparkles, Check, Camera, Mail, User, Search, Award } from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/user-context";
import { ANIMAL_AVATARS, AnimalAvatar, getAnimalAvatar } from "@/lib/animal-avatars";

const ROLE_OPTIONS: { role: Profile["custom_role"]; color: Profile["role_color"]; desc: string }[] = [
  { role: "Administrador", color: "purple", desc: "Acesso total à gestão de salas, prazos e banimentos." },
  { role: "Moderador", color: "emerald", desc: "Mantém a ordem nas discussões e modera materiais." },
  { role: "Aluno Destaque", color: "blue", desc: "Reconhecimento por contribuições ativas e tarefas cumpridas." },
  { role: "Monitor Acadêmico", color: "amber", desc: "Auxilia colegas na resolução de dúvidas e listas." },
  { role: "Pesquisador", color: "rose", desc: "Compartilha artigos e sínteses acadêmicas aprofundadas." },
];

export function ProfileEditor() {
  const { user, updateUser } = useUser();
  const [displayName, setDisplayName] = useState(user.display_name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || ANIMAL_AVATARS[0].url);
  const [customRole, setCustomRole] = useState(user.custom_role);
  const [roleColor, setRoleColor] = useState(user.role_color);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [animalSearch, setAnimalSearch] = useState("");

  useEffect(() => {
    setDisplayName(user.display_name);
    setEmail(user.email);
    setBio(user.bio);
    setAvatarUrl(user.avatar_url || ANIMAL_AVATARS[0].url);
    setCustomRole(user.custom_role);
    setRoleColor(user.role_color);
  }, [user]);

  const currentAnimal = getAnimalAvatar(avatarUrl);

  const filteredAnimals = ANIMAL_AVATARS.filter((a) =>
    a.name.toLowerCase().includes(animalSearch.toLowerCase())
  );

  const handleSelectRole = (role: Profile["custom_role"], color: Profile["role_color"]) => {
    setCustomRole(role);
    setRoleColor(color);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      display_name: displayName,
      email,
      bio,
      avatar_url: avatarUrl,
      custom_role: customRole,
      role_color: roleColor,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl glass-panel p-6 sm:p-8 border border-zinc-300 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-24 w-24 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-800 rounded-full p-1.5 shadow-md border border-zinc-200 dark:border-zinc-700 text-lg">
              {currentAnimal.emoji}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {displayName}
              </h2>
              <Badge variant={roleColor} size="md">
                <Shield className="h-3 w-3" />
                {customRole}
              </Badge>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {email} • Avatar Animal: <strong>{currentAnimal.name}</strong>
            </p>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 max-w-xl leading-relaxed pt-1">
              "{bio}"
            </p>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="rounded-3xl glass-panel p-6 sm:p-8 border border-zinc-300 dark:border-zinc-800 space-y-6 shadow-sm">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Personalização do Perfil & Cargo Visível
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Mude seu nome, cargo e selecione qualquer um dos 40 avatares de animais com cores sólidas.
          </p>
        </div>

        {/* Inputs Básicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Nome de Exibição
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
            Biografia Curta
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="w-full p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            placeholder="Conte um pouco sobre suas matérias favoritas ou rotina de estudos..."
          />
        </div>

        {/* Catálogo de 40 Animais */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              🐾 Catálogo de 40 Animais (Fundos com Cores Sólidas)
            </label>
            <div className="relative w-44">
              <input
                type="text"
                value={animalSearch}
                onChange={(e) => setAnimalSearch(e.target.value)}
                placeholder="Buscar animal..."
                className="w-full pl-7 pr-2 py-1 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
            {filteredAnimals.map((animal) => {
              const isSelected = avatarUrl === animal.url;
              return (
                <button
                  key={animal.id}
                  type="button"
                  onClick={() => setAvatarUrl(animal.url)}
                  className={`group relative flex flex-col items-center p-2 rounded-2xl transition-all ${
                    isSelected
                      ? "ring-2 ring-blue-600 dark:ring-blue-400 bg-blue-100/50 dark:bg-blue-950/50 scale-105"
                      : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60"
                  }`}
                  title={`${animal.name} (${animal.bgHex})`}
                >
                  <img
                    src={animal.url}
                    alt={animal.name}
                    className="h-12 w-12 rounded-2xl object-cover shadow-xs"
                  />
                  <span className="text-[11px] text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-full mt-1">
                    {animal.name}
                  </span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cargo Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-3">
            Escolha seu Cargo Personalizado
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLE_OPTIONS.map((item) => {
              const isSelected = customRole === item.role;
              return (
                <div
                  key={item.role}
                  onClick={() => handleSelectRole(item.role, item.color)}
                  className={`p-3.5 rounded-2xl glass-subtle border cursor-pointer apple-spring transition-all ${
                    isSelected
                      ? "ring-2 ring-blue-500 border-blue-500 bg-blue-500/10 dark:bg-blue-500/20"
                      : "border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant={item.color} size="sm">
                      <Shield className="h-3 w-3" />
                      {item.role}
                    </Badge>
                    {isSelected && (
                      <Check className="h-4 w-4 text-blue-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Check className="h-4 w-4" /> Alterações salvas com sucesso!
            </span>
          ) : (
            <span />
          )}

          <AppleButton
            type="submit"
            variant="primary"
            size="md"
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Salvar Alterações</span>
          </AppleButton>
        </div>
      </form>
    </div>
  );
}
