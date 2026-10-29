"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SummariesFeed } from "@/components/summaries/summaries-feed";
import { Sparkles } from "lucide-react";

export default function SummariesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Feed de Resumos & Materiais (Knowunity)
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Compartilhe e descubra sínteses ilustradas, flashcards e apresentações do Canva criadas pelos seus colegas.
          </p>
        </div>

        <SummariesFeed />
      </div>
    </AppShell>
  );
}
