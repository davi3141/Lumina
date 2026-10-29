import React from "react";
import { Pin, AlertCircle } from "lucide-react";
import { Notice } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export function NoticeBanner({ notices }: { notices: Notice[] }) {
  if (!notices || notices.length === 0) return null;
  const activeNotice = notices[0];

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-5 sm:p-6 border border-zinc-300 dark:border-zinc-800 shadow-sm">
      {/* Decorative subtle ambient gradient */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Pin className="h-5 w-5 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                Aviso Fixado pela Moderação
              </span>
              {activeNotice.priority === "urgent" && (
                <Badge variant="rose" size="sm">
                  <AlertCircle className="h-3 w-3" />
                  Urgente
                </Badge>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {activeNotice.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              {activeNotice.content}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200 dark:border-zinc-800">
          <img
            src={activeNotice.author.avatar}
            alt={activeNotice.author.name}
            className="h-8 w-8 rounded-xl object-cover ring-1 ring-zinc-300 dark:ring-zinc-700 shadow-2xs"
          />
          <div className="text-left">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {activeNotice.author.name}
            </p>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
              {activeNotice.author.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
