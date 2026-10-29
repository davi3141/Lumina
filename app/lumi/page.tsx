"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { LumiAssistant } from "@/components/ai/lumi-assistant";
import { Bot, Sparkles } from "lucide-react";

export default function LumiPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-xs">
              <Bot className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Lumi IA
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                Fácil & Direta
              </span>
            </h1>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Sua companheira de estudos inteligente. Explica qualquer matéria de forma simples, sem palavras difíceis.
          </p>
        </div>

        <LumiAssistant />
      </div>
    </AppShell>
  );
}
