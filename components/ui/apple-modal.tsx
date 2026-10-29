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
}

export function AppleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop Apple Blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Body */}
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl z-10 apple-spring scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <AppleButton
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </AppleButton>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
