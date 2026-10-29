"use client";

import React, { useState, useEffect } from "react";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/user-context";
import { User, Mail, Shield, Check, Sparkles } from "lucide-react";
import { Profile } from "@/lib/mock-data";

const ROLE_CHOICES: { role: Profile["custom_role"]; color: Profile["role_color"]; label: string }[] = [
  { role: "Administrador", color: "purple", label: "Administrador (Criador da Sala)" },
  { role: "Aluno Destaque", color: "blue", label: "Aluno (Estudante da Turma)" },
  { role: "Moderador", color: "emerald", label: "Moderador (Organizador)" },
  { role: "Monitor Acadêmico", color: "amber", label: "Monitor (Tira-dúvidas)" },
];

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
];

export function UserOnboardingModal() {
  const { user, showLoginModal, setShowLoginModal, setUser, isCustomized } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Profile["custom_role"]>("Administrador");
  const [roleColor, setRoleColor] = useState<Profile["role_color"]>("purple");
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);

  useEffect(() => {
    if (user && isCustomized) {
      setName(user.display_name);
      setEmail(user.email);
      setRole(user.custom_role);
      setRoleColor(user.role_color);
      setAvatar(user.avatar_url);
    }
  }, [user, isCustomized]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUser({
      id: user.id || `usr_${Date.now()}`,
      display_name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@estudos.com`,
      avatar_url: avatar,
      bio: "Membro dedicado da turma.",
      custom_role: role,
      role_color: roleColor,
    });

    setShowLoginModal(false);
  };

  return (
    <AppleModal
      isOpen={showLoginModal}
      onClose={() => {
        // Se já tem dados customizados, pode fechar
        if (isCustomized) setShowLoginModal(false);
      }}
      title="👋 Identifique-se na Plataforma"
      description="Coloque o seu nome e seu e-mail para que suas salas, notas e mensagens sejam suas de verdade."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name Input */}
        <div>
          <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 text-xs">
            Seu Nome de Exibição <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Lucas Silva, Mariana Costa..."
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl glass-subtle text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Esse é o nome que vai aparecer no mural, no chat e nas suas salas.
          </p>
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 text-xs">
            Seu E-mail (Institucional ou Pessoal)
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl glass-subtle text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          </div>
        </div>

        {/* Role Choice */}
        <div>
          <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 text-xs">
            Seu Cargo / Papel na Sala
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_CHOICES.map((rc) => {
              const isSelected = role === rc.role;
              return (
                <button
                  type="button"
                  key={rc.role}
                  onClick={() => {
                    setRole(rc.role);
                    setRoleColor(rc.color);
                  }}
                  className={`p-2.5 rounded-xl border text-left apple-spring cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-1 ring-blue-500 text-blue-900 dark:text-blue-100 font-semibold"
                      : "glass-subtle border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <span className="truncate">{rc.role}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Avatar Selector */}
        <div>
          <label className="block text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 text-xs">
            Escolha uma foto de perfil
          </label>
          <div className="flex items-center gap-3">
            {AVATAR_OPTIONS.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Avatar"
                onClick={() => setAvatar(url)}
                className={`h-11 w-11 rounded-full object-cover cursor-pointer apple-spring ${
                  avatar === url
                    ? "ring-3 ring-blue-500 scale-110 shadow-md"
                    : "opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="pt-2">
          <AppleButton
            type="submit"
            variant="primary"
            size="md"
            className="w-full text-sm py-3 font-semibold"
          >
            <span>Salvar e Acessar Minhas Salas</span>
          </AppleButton>
        </div>
      </form>
    </AppleModal>
  );
}
