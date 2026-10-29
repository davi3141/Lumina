"use client";

import React, { useState } from "react";
import { Profile, CURRENT_USER } from "@/lib/mock-data";
import { Shield, Sparkles, Check, Camera, Mail, AtSign, Award } from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";

const ROLE_OPTIONS: { role: Profile["custom_role"]; color: Profile["role_color"]; desc: string }[] = [
  { role: "Administrador", color: "purple", desc: "Acesso total à gestão de salas, prazos e banimentos." },
  { role: "Moderador", color: "emerald", desc: "Mantém a ordem nas discussões e modera materiais." },
  { role: "Aluno Destaque", color: "blue", desc: "Reconhecimento por contribuições ativas e notas exemplares." },
  { role: "Monitor Acadêmico", color: "amber", desc: "Auxilia colegas na resolução de dúvidas e listas." },
  { role: "Pesquisador", color: "rose", desc: "Compartilha artigos e sínteses acadêmicas aprofundadas." },
];

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
];

export function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>(CURRENT_USER);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [customRole, setCustomRole] = useState(profile.custom_role);
  const [roleColor, setRoleColor] = useState(profile.role_color);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectRole = (role: Profile["custom_role"], color: Profile["role_color"]) => {
    setCustomRole(role);
    setRoleColor(color);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      display_name: displayName,
      bio,
      avatar_url: avatarUrl,
      custom_role: customRole,
      role_color: roleColor,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl glass-panel p-6 sm:p-8 border overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-purple-500/20 shadow-xl"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="h-6 w-6 text-white" />
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
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {profile.email} • Membro desde Outubro 2026
            </p>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 max-w-xl leading-relaxed pt-1">
              "{bio}"
            </p>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="rounded-3xl glass-panel p-6 sm:p-8 border space-y-6">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Personalização do Perfil & Cargos Visíveis
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Defina seu cargo de destaque para exibição nas salas e mensagens do mural.
          </p>
        </div>

        {/* Cargo Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
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
                      ? "ring-2 ring-blue-500/50 border-blue-500/40 bg-blue-500/5"
                      : "hover:bg-white/80 dark:hover:bg-white/5"
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
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Avatar Presets */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            Escolher Avatar Rápido
          </label>
          <div className="flex items-center gap-3">
            {AVATAR_PRESETS.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="Avatar preset"
                onClick={() => setAvatarUrl(url)}
                className={`h-11 w-11 rounded-full object-cover cursor-pointer apple-spring ${
                  avatarUrl === url
                    ? "ring-2 ring-blue-500 scale-110 shadow-md"
                    : "opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Name and Bio Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">
              Nome de Exibição
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl glass-subtle border text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">
              URL da Imagem de Avatar
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl glass-subtle border text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">
            Biografia Curta
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl glass-subtle border text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              Perfil e cargos salvos no Supabase com sucesso!
            </p>
          ) : (
            <div />
          )}

          <AppleButton type="submit" variant="primary" size="md">
            Salvar Alterações
          </AppleButton>
        </div>
      </form>
    </div>
  );
}
