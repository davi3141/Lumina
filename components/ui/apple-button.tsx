import React from "react";
import { cn } from "@/lib/utils";

interface AppleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export function AppleButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: AppleButtonProps) {
  const variantStyles = {
    primary:
      "bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm shadow-blue-500/20 active:scale-[0.98] border border-blue-400/30",
    secondary:
      "bg-zinc-200/80 hover:bg-zinc-300/80 text-zinc-900 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 dark:text-zinc-100 active:scale-[0.98]",
    glass:
      "glass-subtle hover:bg-white/80 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 active:scale-[0.98] shadow-sm",
    danger:
      "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 active:scale-[0.98]",
    ghost:
      "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 rounded-full font-medium gap-1.5",
    md: "text-sm px-4 py-2 rounded-xl font-medium gap-2",
    lg: "text-base px-6 py-2.5 rounded-2xl font-medium gap-2.5",
    icon: "h-9 w-9 rounded-full p-0 flex items-center justify-center",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center cursor-pointer apple-spring transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
