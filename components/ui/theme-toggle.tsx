"use client";

import React from "react";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";
import { AppleButton } from "./apple-button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <AppleButton
      variant="glass"
      size="icon"
      onClick={toggle}
      title={resolvedTheme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
      aria-label="Alternar tema"
      className="relative overflow-hidden group"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
    </AppleButton>
  );
}
