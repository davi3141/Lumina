"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Share, Sparkles, Smartphone } from "lucide-react";

export function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Registra o Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[PWA] Service Worker registrado com sucesso:", reg.scope);
          })
          .catch((err) => {
            console.warn("[PWA] Falha ao registrar Service Worker:", err);
          });
      });
    }

    // 2. Detecta se já está rodando instalado como App (Standalone)
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isInStandaloneMode);
    if (isInStandaloneMode) return;

    // 3. Captura o evento de instalação nativo no Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Exibe banner de instalação apenas se o usuário ainda não descartou hoje
      const dismissedAt = localStorage.getItem("lumina_pwa_dismissed");
      if (!dismissedAt || Date.now() - parseInt(dismissedAt) > 86400000 * 3) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Detecta iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosGuide(false);
    localStorage.setItem("lumina_pwa_dismissed", Date.now().toString());
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Banner de Instalação Mobile Estilo Apple */}
      {showPrompt && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 rounded-3xl bg-zinc-900/95 text-white border border-zinc-700 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shrink-0 shadow-md">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-white">Instalar Lumina</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/30 text-blue-300 font-bold">App</span>
                </div>
                <p className="text-[11px] text-zinc-300 truncate mt-0.5">
                  Acesse como um app real direto na tela inicial!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Instalar</span>
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                title="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Dica para Usuários de iPhone (iOS Safari) */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-zinc-900 text-white p-6 border border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Instalar no iPhone (iOS)</h4>
                  <p className="text-xs text-zinc-400">Em 2 toques rápidos</p>
                </div>
              </div>
              <button onClick={() => setShowIosGuide(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>Toque no botão <strong>Compartilhar</strong> (<Share className="h-3.5 w-3.5 inline text-blue-400" />) na barra do Safari.</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
