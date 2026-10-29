"use client";

import React, { useState } from "react";
import {
  Palette,
  ExternalLink,
  Presentation,
  FileImage,
  Sparkles,
  Maximize2,
  Copy,
  Check,
  RefreshCw,
  Layout,
} from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";

const PRESET_TEMPLATES = [
  {
    title: "Apresentação Acadêmica Apple-style (16:9)",
    category: "Slides",
    url: "https://www.canva.com/design/DAFv3sI7p9k/view?embed",
    canvaWebUrl: "https://www.canva.com/templates/EAF-presentation",
    description: "Design com tipografia limpa, gradientes sutis e diagramas para seminários.",
  },
  {
    title: "Infográfico & Resumo Visual para Prova",
    category: "Cartaz",
    url: "https://www.canva.com/design/DAFv4_MockEmbed/view?embed",
    canvaWebUrl: "https://www.canva.com/templates/EAF-poster",
    description: "Estrutura vertical para mapas conceituais e fórmulas matemáticas.",
  },
  {
    title: "Quadro de Atividades & Cronograma",
    category: "Planejamento",
    url: "https://www.canva.com/design/DAFv5_MockBoard/view?embed",
    canvaWebUrl: "https://www.canva.com/templates/EAF-board",
    description: "Template de organização para prazos de grupos de estudo.",
  },
];

export function CanvaHub() {
  const [activeEmbedUrl, setActiveEmbedUrl] = useState(PRESET_TEMPLATES[0].url);
  const [activeTitle, setActiveTitle] = useState(PRESET_TEMPLATES[0].title);
  const [customInputUrl, setCustomInputUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl) return;
    let url = customInputUrl.trim();
    if (url.includes("/view") && !url.includes("embed")) {
      url = url.replace("/view", "/view?embed");
    }
    setActiveEmbedUrl(url);
    setActiveTitle("Design Personalizado do Canva");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeEmbedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Launch Buttons (Apple-style pill grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="https://www.canva.com/create/presentations/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-3xl glass-panel border flex items-center justify-between hover:scale-[1.01] apple-spring group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Presentation className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Criar Apresentação
              </p>
              <span className="text-[10px] text-zinc-400">Canva Slides 16:9</span>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-purple-500 apple-spring" />
        </a>

        <a
          href="https://www.canva.com/create/posters/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-3xl glass-panel border flex items-center justify-between hover:scale-[1.01] apple-spring group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileImage className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Criar Cartaz & Resumo
              </p>
              <span className="text-[10px] text-zinc-400">Infográficos e A4</span>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-blue-500 apple-spring" />
        </a>

        <a
          href="https://www.canva.com/graphs/mind-maps/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-3xl glass-panel border flex items-center justify-between hover:scale-[1.01] apple-spring group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Layout className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Mapa Mental Interativo
              </p>
              <span className="text-[10px] text-zinc-400">Brainstorming de Turma</span>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500 apple-spring" />
        </a>
      </div>

      {/* Canva Embed Viewer & Custom Link Input */}
      <div className="rounded-3xl glass-panel p-6 border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                Canva Embed Ativo
              </Badge>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {activeTitle}
              </h3>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Visualização ao vivo e interativa incorporada no Lumina
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AppleButton
              variant="glass"
              size="sm"
              onClick={handleCopyLink}
              title="Copiar link do Canva"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? "Copiado!" : "Copiar Link"}</span>
            </AppleButton>

            <a
              href={activeEmbedUrl.replace("?embed", "")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppleButton variant="primary" size="sm">
                <span>Abrir no Canva</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </AppleButton>
            </a>
          </div>
        </div>

        {/* Custom URL Import Bar */}
        <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
          <input
            type="url"
            value={customInputUrl}
            onChange={(e) => setCustomInputUrl(e.target.value)}
            placeholder="Cole aqui o link do seu design no Canva (ex: https://www.canva.com/design/...)"
            className="flex-1 px-4 py-2 text-xs rounded-2xl glass-subtle border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <AppleButton type="submit" variant="glass" size="md">
            Visualizar Embed
          </AppleButton>
        </form>

        {/* The Embed Box */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/60 bg-zinc-950 shadow-inner">
          <div className="aspect-video w-full bg-zinc-900 flex items-center justify-center">
            <iframe
              src={activeEmbedUrl}
              title="Canva Presentation"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0 rounded-2xl"
            />
          </div>
        </div>

        {/* Presets Selector */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
            Modelos de Apresentação Recomendados:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_TEMPLATES.map((tpl) => (
              <div
                key={tpl.title}
                onClick={() => {
                  setActiveEmbedUrl(tpl.url);
                  setActiveTitle(tpl.title);
                }}
                className={`p-3 rounded-2xl glass-subtle border cursor-pointer apple-spring ${
                  activeEmbedUrl === tpl.url
                    ? "border-purple-500/50 ring-2 ring-purple-500/20 bg-purple-500/5"
                    : "hover:bg-white/80 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="purple" size="sm">
                    {tpl.category}
                  </Badge>
                  {activeEmbedUrl === tpl.url && (
                    <span className="text-[10px] text-purple-500 font-bold">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {tpl.title}
                </p>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                  {tpl.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
