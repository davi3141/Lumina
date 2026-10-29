"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CanvaHub } from "@/components/canva/canva-hub";
import { Palette } from "lucide-react";

export default function CanvaPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Palette className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Central de Integração Canva
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Crie apresentações, visualize embeds interativos e compartilhe slides diretamente na plataforma.
          </p>
        </div>

        <CanvaHub />
      </div>
    </AppShell>
  );
}
