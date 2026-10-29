// Catálogo de 30 Banners Personalizados e Figurinhas/Stickers para as Salas de Aula
// Criado para o Lumina: Cada sala pode ter visual, tirinha e personalidade 100% únicos!

export interface RoomBannerPreset {
  id: string;
  name: string;
  category: "Moderno" | "Gradiente" | "Neon & Dark" | "Natureza" | "Minimalista" | "Criativo";
  gradient: string; // Tailwind gradient classes
  bgStyle?: string; // Inline CSS fallback or complex gradient
  stripColor: string; // Cor da tirinha (HEX ou Tailwind)
  stripHex: string;
  accentBadge: "blue" | "purple" | "emerald" | "amber" | "rose" | "zinc";
}

export const ROOM_BANNER_PRESETS: RoomBannerPreset[] = [
  // 1-5: Clássicos e Apple Dynamic
  {
    id: "banner-01",
    name: "Aurora Boreal",
    category: "Gradiente",
    gradient: "from-teal-400 via-emerald-500 to-cyan-600",
    stripColor: "bg-teal-500",
    stripHex: "#14b8a6",
    accentBadge: "emerald",
  },
  {
    id: "banner-02",
    name: "Sunset Califórnia",
    category: "Gradiente",
    gradient: "from-amber-400 via-orange-500 to-rose-600",
    stripColor: "bg-orange-500",
    stripHex: "#f97316",
    accentBadge: "amber",
  },
  {
    id: "banner-03",
    name: "Cosmic Violet",
    category: "Moderno",
    gradient: "from-purple-600 via-indigo-600 to-blue-700",
    stripColor: "bg-purple-600",
    stripHex: "#9333ea",
    accentBadge: "purple",
  },
  {
    id: "banner-04",
    name: "Oceano Profundo",
    category: "Moderno",
    gradient: "from-blue-600 via-sky-600 to-indigo-800",
    stripColor: "bg-blue-600",
    stripHex: "#2563eb",
    accentBadge: "blue",
  },
  {
    id: "banner-05",
    name: "Neon Cyberpunk",
    category: "Neon & Dark",
    gradient: "from-fuchsia-600 via-purple-700 to-cyan-500",
    stripColor: "bg-fuchsia-500",
    stripHex: "#d946ef",
    accentBadge: "rose",
  },

  // 6-10: Cores Vivas & Tecnológicas
  {
    id: "banner-06",
    name: "Floresta Esmeralda",
    category: "Natureza",
    gradient: "from-emerald-600 via-green-600 to-teal-800",
    stripColor: "bg-emerald-600",
    stripHex: "#059669",
    accentBadge: "emerald",
  },
  {
    id: "banner-07",
    name: "Solar Flare",
    category: "Gradiente",
    gradient: "from-yellow-400 via-amber-500 to-red-600",
    stripColor: "bg-amber-500",
    stripHex: "#f59e0b",
    accentBadge: "amber",
  },
  {
    id: "banner-08",
    name: "Lavanda Mística",
    category: "Moderno",
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
    stripColor: "bg-violet-500",
    stripHex: "#8b5cf6",
    accentBadge: "purple",
  },
  {
    id: "banner-09",
    name: "Tokyo Midnight",
    category: "Neon & Dark",
    gradient: "from-slate-900 via-purple-900 to-blue-900",
    stripColor: "bg-indigo-500",
    stripHex: "#6366f1",
    accentBadge: "purple",
  },
  {
    id: "banner-10",
    name: "Pastel Dreams",
    category: "Criativo",
    gradient: "from-pink-300 via-purple-300 to-indigo-300",
    stripColor: "bg-pink-400",
    stripHex: "#f472b6",
    accentBadge: "rose",
  },

  // 11-15: Tons Terrosos, Quentes e Naturais
  {
    id: "banner-11",
    name: "Lava Vulcânica",
    category: "Gradiente",
    gradient: "from-red-600 via-rose-600 to-orange-700",
    stripColor: "bg-red-600",
    stripHex: "#dc2626",
    accentBadge: "rose",
  },
  {
    id: "banner-12",
    name: "Safari Dourado",
    category: "Natureza",
    gradient: "from-amber-500 via-yellow-600 to-stone-700",
    stripColor: "bg-yellow-600",
    stripHex: "#ca8a04",
    accentBadge: "amber",
  },
  {
    id: "banner-13",
    name: "Bambu Zen",
    category: "Natureza",
    gradient: "from-lime-500 via-emerald-600 to-teal-700",
    stripColor: "bg-lime-600",
    stripHex: "#65a30d",
    accentBadge: "emerald",
  },
  {
    id: "banner-14",
    name: "Chic Coral",
    category: "Criativo",
    gradient: "from-rose-400 via-pink-500 to-red-500",
    stripColor: "bg-rose-500",
    stripHex: "#f43f5e",
    accentBadge: "rose",
  },
  {
    id: "banner-15",
    name: "Menta Fresca",
    category: "Natureza",
    gradient: "from-teal-300 via-emerald-400 to-green-500",
    stripColor: "bg-teal-400",
    stripHex: "#2dd4bf",
    accentBadge: "emerald",
  },

  // 16-20: Tons Noturnos, Minimalistas e Futuristas
  {
    id: "banner-16",
    name: "Midnight Titanium",
    category: "Minimalista",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    stripColor: "bg-zinc-700",
    stripHex: "#3f3f46",
    accentBadge: "zinc",
  },
  {
    id: "banner-17",
    name: "Indigo Galaxy",
    category: "Moderno",
    gradient: "from-blue-700 via-indigo-800 to-slate-900",
    stripColor: "bg-indigo-600",
    stripHex: "#4f46e5",
    accentBadge: "blue",
  },
  {
    id: "banner-18",
    name: "Matrix Code",
    category: "Neon & Dark",
    gradient: "from-zinc-950 via-emerald-950 to-green-900",
    stripColor: "bg-emerald-500",
    stripHex: "#10b981",
    accentBadge: "emerald",
  },
  {
    id: "banner-19",
    name: "Ametista Real",
    category: "Moderno",
    gradient: "from-purple-700 via-fuchsia-800 to-indigo-900",
    stripColor: "bg-purple-700",
    stripHex: "#7e22ce",
    accentBadge: "purple",
  },
  {
    id: "banner-20",
    name: "Aqua Splash",
    category: "Gradiente",
    gradient: "from-sky-400 via-cyan-500 to-blue-600",
    stripColor: "bg-cyan-500",
    stripHex: "#06b6d4",
    accentBadge: "blue",
  },

  // 21-25: Estilo Acadêmico & Criativo
  {
    id: "banner-21",
    name: "Outono Dourado",
    category: "Natureza",
    gradient: "from-orange-500 via-amber-600 to-yellow-700",
    stripColor: "bg-orange-600",
    stripHex: "#ea580c",
    accentBadge: "amber",
  },
  {
    id: "banner-22",
    name: "Caramelo & Canela",
    category: "Criativo",
    gradient: "from-amber-600 via-orange-700 to-stone-800",
    stripColor: "bg-amber-700",
    stripHex: "#b45309",
    accentBadge: "amber",
  },
  {
    id: "banner-23",
    name: "Céu de Verão",
    category: "Gradiente",
    gradient: "from-blue-400 via-sky-300 to-cyan-400",
    stripColor: "bg-sky-400",
    stripHex: "#38bdf8",
    accentBadge: "blue",
  },
  {
    id: "banner-24",
    name: "Berry Smoothie",
    category: "Criativo",
    gradient: "from-pink-500 via-rose-600 to-purple-700",
    stripColor: "bg-pink-600",
    stripHex: "#db2777",
    accentBadge: "rose",
  },
  {
    id: "banner-25",
    name: "Café Espresso",
    category: "Minimalista",
    gradient: "from-stone-800 via-amber-950 to-neutral-900",
    stripColor: "bg-amber-900",
    stripHex: "#78350f",
    accentBadge: "zinc",
  },

  // 26-30: Alto Contraste & Apple Glass
  {
    id: "banner-26",
    name: "Silver Platinum",
    category: "Minimalista",
    gradient: "from-slate-300 via-zinc-400 to-slate-500",
    stripColor: "bg-slate-400",
    stripHex: "#94a3b8",
    accentBadge: "zinc",
  },
  {
    id: "banner-27",
    name: "Ultra Violet Star",
    category: "Neon & Dark",
    gradient: "from-violet-900 via-purple-950 to-black",
    stripColor: "bg-violet-600",
    stripHex: "#7c3aed",
    accentBadge: "purple",
  },
  {
    id: "banner-28",
    name: "Pêssego Tropical",
    category: "Criativo",
    gradient: "from-orange-300 via-rose-400 to-pink-500",
    stripColor: "bg-orange-400",
    stripHex: "#fb923c",
    accentBadge: "amber",
  },
  {
    id: "banner-29",
    name: "Glacier Ice",
    category: "Moderno",
    gradient: "from-cyan-300 via-sky-400 to-blue-500",
    stripColor: "bg-cyan-400",
    stripHex: "#22d3ee",
    accentBadge: "blue",
  },
  {
    id: "banner-30",
    name: "Apple Glass Prata",
    category: "Minimalista",
    gradient: "from-zinc-100 via-slate-200 to-zinc-300",
    stripColor: "bg-blue-600",
    stripHex: "#2563eb",
    accentBadge: "blue",
  },
];

// Catálogo de 24 Figurinhas / Stickers temáticos para as salas
export interface RoomSticker {
  id: string;
  name: string;
  emoji: string;
  suggestedSubject: string;
}

export const ROOM_STICKERS: RoomSticker[] = [
  { id: "marketing", name: "Marketing & Mídia", emoji: "📊", suggestedSubject: "Marketing" },
  { id: "business", name: "Administração & Gestão", emoji: "💼", suggestedSubject: "Administração" },
  { id: "code", name: "Programação & TI", emoji: "💻", suggestedSubject: "Tecnologia" },
  { id: "chemistry", name: "Química & Farmácia", emoji: "🧪", suggestedSubject: "Química" },
  { id: "law", name: "Direito & Legislação", emoji: "⚖️", suggestedSubject: "Direito" },
  { id: "engineering", name: "Engenharia & Exatas", emoji: "📐", suggestedSubject: "Engenharia" },
  { id: "design", name: "Design & Artes", emoji: "🎨", suggestedSubject: "Design" },
  { id: "medicine", name: "Medicina & Saúde", emoji: "🩺", suggestedSubject: "Saúde" },
  { id: "psychology", name: "Psicologia & Humanas", emoji: "🧠", suggestedSubject: "Psicologia" },
  { id: "literature", name: "Literatura & Redação", emoji: "📚", suggestedSubject: "Português" },
  { id: "physics", name: "Física & Espaço", emoji: "⚡", suggestedSubject: "Física" },
  { id: "biology", name: "Biologia & Genética", emoji: "🔬", suggestedSubject: "Biologia" },
  { id: "startup", name: "Inovação & Startups", emoji: "🚀", suggestedSubject: "Empreendedorismo" },
  { id: "finance", name: "Economia & Finanças", emoji: "📈", suggestedSubject: "Economia" },
  { id: "geography", name: "Geografia & Clima", emoji: "🌍", suggestedSubject: "Geografia" },
  { id: "history", name: "História & Cultura", emoji: "🏛️", suggestedSubject: "História" },
  { id: "languages", name: "Idiomas & Global", emoji: "🌐", suggestedSubject: "Idiomas" },
  { id: "music", name: "Música & Audiovisual", emoji: "🎵", suggestedSubject: "Música" },
  { id: "games", name: "Jogos & 3D", emoji: "🎮", suggestedSubject: "Game Dev" },
  { id: "nutrition", name: "Nutrição & Esportes", emoji: "🥑", suggestedSubject: "Nutrição" },
  { id: "robotics", name: "Robótica & IA", emoji: "🤖", suggestedSubject: "Robótica" },
  { id: "math", name: "Matemática Pura", emoji: "🔢", suggestedSubject: "Matemática" },
  { id: "general", name: "Grupo Geral de Estudos", emoji: "✨", suggestedSubject: "Geral" },
  { id: "stars", name: "Turma Destaque", emoji: "🏆", suggestedSubject: "Projetos" },
];

export function getBannerPreset(idOrIndex?: string | number): RoomBannerPreset {
  if (typeof idOrIndex === "number") {
    return ROOM_BANNER_PRESETS[idOrIndex % ROOM_BANNER_PRESETS.length];
  }
  if (typeof idOrIndex === "string") {
    const found = ROOM_BANNER_PRESETS.find((b) => b.id === idOrIndex || b.gradient === idOrIndex);
    if (found) return found;
  }
  return ROOM_BANNER_PRESETS[0];
}

export function getSticker(idOrEmoji?: string): RoomSticker {
  if (typeof idOrEmoji === "string") {
    const found = ROOM_STICKERS.find((s) => s.id === idOrEmoji || s.emoji === idOrEmoji);
    if (found) return found;
  }
  return ROOM_STICKERS[0];
}
