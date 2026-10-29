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
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Feed de Resumos & Materiais
            </h1>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Compartilhe e descubra sínteses ilustradas, listas de revisão e anotações colaborativas dos seus colegas.
          </p>
        </div>

        <SummariesFeed />
      </div>
    </AppShell>
  );
}
