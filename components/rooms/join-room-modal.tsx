"use client";

import React, { useState } from "react";
import { AppleModal } from "@/components/ui/apple-modal";
import { AppleButton } from "@/components/ui/apple-button";
import { KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { useUser } from "@/lib/user-context";
import { useRouter } from "next/navigation";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess?: (roomName: string) => void;
}

export function JoinRoomModal({ isOpen, onClose, onJoinSuccess }: JoinRoomModalProps) {
  const router = useRouter();
  const { joinRoomByCode } = useUser();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [matchedRoom, setMatchedRoom] = useState<string | null>(null);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      setErrorMessage("Por favor, digite o código de convite.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    setTimeout(() => {
      const result = joinRoomByCode(cleanCode);

      if (result.success && result.room) {
        setStatus("success");
        setMatchedRoom(result.room.name);
        setTimeout(() => {
          onJoinSuccess?.(result.room!.name);
          onClose();
          setStatus("idle");
          setCode("");
          router.push(`/rooms/${result.room!.id}`);
        }, 1000);
      } else {
        setStatus("error");
        setErrorMessage("Código inválido ou sala não encontrada.");
      }
    }, 400);
  };

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Entrar em uma Sala Privada"
      description="Digite o código único fornecido pelo professor ou administrador da sala."
    >
      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
            Código de Convite
          </label>
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Ex: LUMINA-7821"
              maxLength={15}
              className="w-full px-4 py-3 rounded-2xl glass-subtle text-center text-lg font-mono font-semibold tracking-widest text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 apple-spring"
            />
            <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 text-center">
            Códigos de teste disponíveis: <span className="font-mono text-blue-500 font-semibold">LUMINA-7821</span> ou <span className="font-mono text-purple-500 font-semibold">APPLE-4092</span>
          </p>
        </div>

        {status === "error" && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {status === "success" && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Sucesso! Acessando a sala <strong>{matchedRoom}</strong>...</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <AppleButton
            type="button"
            variant="glass"
            size="md"
            onClick={onClose}
          >
            Cancelar
          </AppleButton>
          <AppleButton
            type="submit"
            variant="primary"
            size="md"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? "Validando..." : "Ingressar na Sala"}
          </AppleButton>
        </div>
      </form>
    </AppleModal>
  );
}
