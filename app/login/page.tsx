"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, ArrowRight, ShieldCheck, Mail, Lock, User, Sparkles } from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("Aluno Destaque");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Simulação e redirecionamento instantâneo com Supabase Auth preparado
    setTimeout(() => {
      setLoading(false);
      setMessage(
        isSignUp
          ? "Conta criada com sucesso! Redirecionando para o seu dashboard..."
          : "Autenticação bem-sucedida! Entrando no Lumina..."
      );
      setTimeout(() => {
        router.push("/");
      }, 900);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent">
      {/* Top Bar with Logo and Theme Toggle */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md flex items-center justify-center text-white">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Lumina
          </span>
        </Link>

        <ThemeToggle />
      </div>

      {/* Center Auth Card (Apple-style frosted glass) */}
      <div className="max-w-md w-full mx-auto my-12">
        <div className="rounded-3xl glass-panel p-8 sm:p-10 border shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {isSignUp ? "Criar sua Conta Lumina" : "Bem-vindo de Volta"}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {isSignUp
                ? "Junte-se à sala de aula privada da sua turma"
                : "Acesse suas salas, notas e prazos acadêmicos"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ex: Marcus Vinícius"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-500 font-medium mb-1">
                    Cargo Inicial na Turma
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Aluno Destaque">Aluno Destaque</option>
                    <option value="Monitor Acadêmico">Monitor Acadêmico</option>
                    <option value="Moderador">Moderador</option>
                    <option value="Pesquisador">Pesquisador</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-zinc-500 font-medium mb-1">
                E-mail Institucional ou Pessoal
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aluno@universidade.edu"
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block text-zinc-500 font-medium mb-1">
                Senha Segura
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl glass-subtle border text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {message && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs text-center font-medium">
                {message}
              </div>
            )}

            <AppleButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              <span>{loading ? "Processando..." : isSignUp ? "Criar Conta" : "Entrar no Lumina"}</span>
              <ArrowRight className="h-4 w-4" />
            </AppleButton>
          </form>

          {/* Toggle between login and sign up */}
          <div className="text-center mt-6 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/60">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }}
              className="text-xs text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              {isSignUp
                ? "Já tem uma conta cadastrada? Faça login aqui."
                : "Ainda não tem acesso? Crie seu perfil de estudante."}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-zinc-400">
        <p>Lumina Platform • 100% Free Tier Architecture (Vercel, Supabase, Resend, Railway)</p>
      </footer>
    </div>
  );
}
