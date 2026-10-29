"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { AppleButton } from "./apple-button";

interface AppleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function AppleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-lg",
}: AppleModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop Apple Blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Body - Mobile Optimized with dynamic viewport height & scroll */}
      <div
        className={`relative w-full ${maxWidth} max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 apple-spring scale-100 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 overflow-hidden`}
      >
        {/* Mobile Swipe / Drag Handle Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Header - Fixed & Always Visible */}
        <div className="flex items-start justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
          <div className="pr-2">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors shrink-0"
            title="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1 overscroll-contain p-4 sm:p-6 pt-3 sm:pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
