"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, BookOpen, Clock, Lightbulb, RotateCcw, Copy, Check } from "lucide-react";
import { AppleButton } from "@/components/ui/apple-button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/user-context";

interface Message {
  id: string;
  sender: "lumi" | "user";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { icon: "🐣", title: "Explique Simples", prompt: "Pode me explicar este conceito de forma bem simples, sem palavras difíceis?" },
  { icon: "📝", title: "Resumir Conteúdo", prompt: "Como posso resumir esse capítulo em tópicos fáceis de memorizar?" },
  { icon: "⏰", title: "Organizar Tempo", prompt: "Tenho várias matérias para estudar e prazo curto. Como dividir meu tempo?" },
  { icon: "💡", title: "Dúvida de Exercício", prompt: "Estou travado num exercício. Qual o passo a passo para resolver problemas difíceis?" },
  { icon: "🎯", title: "Memorizar Fácil", prompt: "Quais são as melhores técnicas para não esquecer o conteúdo no dia da prova?" },
];

export function LumiAssistant() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "lumi",
      text: `Olá! Eu sou a Lumi 🐾, sua assistente de estudos no Lumina. Minha missão é tirar dúvidas de forma simples, direta e sem termos complicados. Em que posso te ajudar hoje?`,
      timestamp: "Agora",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateSimpleResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("tempo") || q.includes("organizar") || q.includes("cronograma")) {
      return `⏰ **Como Organizar seu Tempo Sem Sofrer:**\n\n1. **Método 25 + 5**: Estude 25 minutos com celular longe, descanse 5 minutos. Funciona de verdade!\n2. **Comece pelo mais chato**: Faça a matéria mais difícil logo no início, quando sua cabeça está descansada.\n3. **Mural de Prazos**: Use a aba de **Prazos** aqui do Lumina para nunca esquecer a data de entrega.\n\nPrecisa de ajuda para montar um horário de hoje? Me fale quantas horas você tem livres!`;
    }

    if (q.includes("resumo") || q.includes("resumir") || q.includes("memorizar")) {
      return `📝 **Dica de Ouro para Fazer Resumos Simples:**\n\n- **Apenas 3 perguntas:**\n  1. Do que se trata esse assunto?\n  2. Por que ele é importante?\n  3. Qual é o exemplo mais prático disso no dia a dia?\n\nSe você conseguir explicar isso para alguém em 1 minuto com suas próprias palavras, você já aprendeu a matéria! ✨`;
    }

    if (q.includes("prova") || q.includes("teste") || q.includes("nota")) {
      return `🎯 **Como Mandar Bem na Prova:**\n\n- **Não leia apenas passivamente**: Tente resolver exercícios sem olhar a resposta.\n- **Ensine a matéria para uma parede ou no espelho**: Se você travar em alguma parte, é aí que você precisa revisar.\n- **Durma bem na noite anterior**: O cérebro fixa o que você estudou enquanto dorme!`;
    }

    if (q.includes("matemática") || q.includes("calculo") || q.includes("conta") || q.includes("formula")) {
      return `📐 **Dica Simples para Exatas & Matemática:**\n\n1. Entenda **o que a questão está pedindo** antes de fazer qualquer conta.\n2. Anote os dados que o exercício te deu (valores, medidas, fórmulas).\n3. Faça passo a passo com calma. Erros de sinal (+ e -) são os maiores vilões!`;
    }

    // Resposta padrão amigável e clara
    return `💡 **Entendido! Aqui vai uma resposta direta e prática:**\n\n- Para entender bem isso, pense no seguinte: todo assunto difícil é apenas a soma de várias partes pequenas e simples.\n- Tente quebrar sua dúvida em perguntas menores.\n- Se quiser, cole aqui o texto ou o enunciado da sua tarefa que eu te explico exatamente o que fazer de maneira bem clara! ✨`;
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Agora",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateSimpleResponse(query);
      const lumiMsg: Message = {
        id: `lumi-${Date.now()}`,
        sender: "lumi",
        text: replyText,
        timestamp: "Agora",
      };
      setMessages((prev) => [...prev, lumiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[820px] rounded-3xl glass-panel border border-zinc-300 dark:border-zinc-800 shadow-md overflow-hidden">
      {/* Header Lumi */}
      <div className="p-4 sm:p-5 border-b border-zinc-300 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Lumi IA
              </h2>
              <Badge variant="amber" size="sm">
                Fácil & Direta
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Sua companheira de estudos que explica tudo sem enrolação
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: "welcome-reset",
                sender: "lumi",
                text: "Conversa reiniciada! Qual dúvida você quer descomplicar agora?",
                timestamp: "Agora",
              },
            ]);
          }}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Limpar conversa"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => {
          const isLumi = m.sender === "lumi";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isLumi ? "" : "flex-row-reverse"}`}
            >
              {isLumi ? (
                <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
              ) : (
                <img
                  src={user.avatar_url}
                  alt={user.display_name}
                  className="h-9 w-9 rounded-xl object-cover ring-2 ring-blue-500/30 shrink-0"
                />
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                    {isLumi ? "Lumi IA" : user.display_name}
                  </span>
                  <span className="text-[10px] text-zinc-400">{m.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isLumi
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
                      : "bg-blue-600 text-white rounded-tr-none font-medium"
                  }`}
                >
                  {m.text}
                </div>

                {isLumi && (
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-2 py-0.5 rounded transition-colors"
                  >
                    {copiedId === m.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        <span className="text-emerald-500">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar explicação</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center animate-pulse">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
              <span>Lumi está pensando na forma mais fácil de explicar...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-zinc-50/80 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-semibold text-zinc-400 shrink-0">Sugestões:</span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(qp.prompt)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap transition-all shrink-0 active:scale-95 shadow-2xs"
          >
            <span>{qp.icon}</span>
            <span>{qp.title}</span>
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white dark:bg-zinc-950 border-t border-zinc-300 dark:border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pergunte qualquer coisa da escola ou faculdade... (ex: como funciona fotossíntese?)"
            className="flex-1 py-3 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />

          <AppleButton
            type="submit"
            variant="primary"
            size="md"
            className="rounded-2xl px-4 py-3 shrink-0 bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20"
            disabled={!inputText.trim()}
          >
            <Send className="h-4 w-4" />
          </AppleButton>
        </form>
      </div>
    </div>
  );
}
