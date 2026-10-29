// Catálogo oficial de 40 avatares de animais com fundos de cor sólida
// Criados para o Lumina: 100% livres de fotos humanas, leves, rápidos e com alto contraste

export interface AnimalAvatar {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  bgHex: string;
  url: string;
}

export function createAnimalSvg(emoji: string, bgHex: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="32" fill="${bgHex}"/><text x="50" y="58" font-size="52" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const ANIMAL_AVATARS: AnimalAvatar[] = [
  { id: "gato", name: "Gatinho", emoji: "🐱", bgColor: "bg-amber-100", bgHex: "#fef3c7", url: createAnimalSvg("🐱", "#fef3c7") },
  { id: "cachorro", name: "Cachorrinho", emoji: "🐶", bgColor: "bg-blue-100", bgHex: "#dbeafe", url: createAnimalSvg("🐶", "#dbeafe") },
  { id: "raposa", name: "Raposinha", emoji: "🦊", bgColor: "bg-orange-100", bgHex: "#ffedd5", url: createAnimalSvg("🦊", "#ffedd5") },
  { id: "panda", name: "Panda", emoji: "🐼", bgColor: "bg-emerald-100", bgHex: "#d1fae5", url: createAnimalSvg("🐼", "#d1fae5") },
  { id: "leao", name: "Leãozinho", emoji: "🦁", bgColor: "bg-yellow-100", bgHex: "#fef9c3", url: createAnimalSvg("🦁", "#fef9c3") },
  { id: "lobo", name: "Lobinho", emoji: "🐺", bgColor: "bg-slate-200", bgHex: "#e2e8f0", url: createAnimalSvg("🐺", "#e2e8f0") },
  { id: "coruja", name: "Corujinha", emoji: "🦉", bgColor: "bg-purple-100", bgHex: "#f3e8ff", url: createAnimalSvg("🦉", "#f3e8ff") },
  { id: "coelho", name: "Coelhinho", emoji: "🐰", bgColor: "bg-pink-100", bgHex: "#fce7f3", url: createAnimalSvg("🐰", "#fce7f3") },
  { id: "urso", name: "Ursinho", emoji: "🐻", bgColor: "bg-amber-200", bgHex: "#fed7aa", url: createAnimalSvg("🐻", "#fed7aa") },
  { id: "pinguim", name: "Pinguim", emoji: "🐧", bgColor: "bg-cyan-100", bgHex: "#cffafe", url: createAnimalSvg("🐧", "#cffafe") },
  { id: "tigre", name: "Tigrinho", emoji: "🐯", bgColor: "bg-orange-200", bgHex: "#fed7aa", url: createAnimalSvg("🐯", "#fed7aa") },
  { id: "coala", name: "Coala", emoji: "🐨", bgColor: "bg-teal-100", bgHex: "#ccfbf1", url: createAnimalSvg("🐨", "#ccfbf1") },
  { id: "macaco", name: "Macaquinho", emoji: "🐵", bgColor: "bg-yellow-200", bgHex: "#fef08a", url: createAnimalSvg("🐵", "#fef08a") },
  { id: "cervo", name: "Cervo", emoji: "🦌", bgColor: "bg-lime-100", bgHex: "#ecfccb", url: createAnimalSvg("🦌", "#ecfccb") },
  { id: "golfinho", name: "Golfinho", emoji: "🐬", bgColor: "bg-sky-100", bgHex: "#e0f2fe", url: createAnimalSvg("🐬", "#e0f2fe") },
  { id: "tartaruga", name: "Tartaruga", emoji: "🐢", bgColor: "bg-green-100", bgHex: "#dcfce7", url: createAnimalSvg("🐢", "#dcfce7") },
  { id: "polvo", name: "Polvinho", emoji: "🐙", bgColor: "bg-violet-100", bgHex: "#ede9fe", url: createAnimalSvg("🐙", "#ede9fe") },
  { id: "elefante", name: "Elefantinho", emoji: "🐘", bgColor: "bg-indigo-100", bgHex: "#e0e7ff", url: createAnimalSvg("🐘", "#e0e7ff") },
  { id: "girafa", name: "Girafinha", emoji: "🦒", bgColor: "bg-amber-100", bgHex: "#fef3c7", url: createAnimalSvg("🦒", "#fef3c7") },
  { id: "zebra", name: "Zebrinha", emoji: "🦓", bgColor: "bg-neutral-200", bgHex: "#e5e5e5", url: createAnimalSvg("🦓", "#e5e5e5") },
  { id: "lhama", name: "Lhama", emoji: "🦙", bgColor: "bg-rose-100", bgHex: "#ffe4e6", url: createAnimalSvg("🦙", "#ffe4e6") },
  { id: "ourico", name: "Ouriço", emoji: "🦔", bgColor: "bg-stone-200", bgHex: "#e7e5e4", url: createAnimalSvg("🦔", "#e7e5e4") },
  { id: "preguica", name: "Preguicinha", emoji: "🦥", bgColor: "bg-lime-200", bgHex: "#d9f99d", url: createAnimalSvg("🦥", "#d9f99d") },
  { id: "lontra", name: "Lontrinha", emoji: "🦦", bgColor: "bg-sky-200", bgHex: "#bae6fd", url: createAnimalSvg("🦦", "#bae6fd") },
  { id: "canguru", name: "Canguru", emoji: "🦘", bgColor: "bg-orange-100", bgHex: "#ffedd5", url: createAnimalSvg("🦘", "#ffedd5") },
  { id: "guaxinim", name: "Guaxinim", emoji: "🦝", bgColor: "bg-zinc-200", bgHex: "#e4e4e7", url: createAnimalSvg("🦝", "#e4e4e7") },
  { id: "papagaio", name: "Papagaio", emoji: "🦜", bgColor: "bg-emerald-200", bgHex: "#a7f3d0", url: createAnimalSvg("🦜", "#a7f3d0") },
  { id: "flamingo", name: "Flamingo", emoji: "🦩", bgColor: "bg-pink-200", bgHex: "#fbcfe8", url: createAnimalSvg("🦩", "#fbcfe8") },
  { id: "abelha", name: "Abelhinha", emoji: "🐝", bgColor: "bg-yellow-300", bgHex: "#fde047", url: createAnimalSvg("🐝", "#fde047") },
  { id: "sapo", name: "Sapinho", emoji: "🐸", bgColor: "bg-green-200", bgHex: "#bbf7d0", url: createAnimalSvg("🐸", "#bbf7d0") },
  { id: "baleia", name: "Baleia", emoji: "🐳", bgColor: "bg-blue-200", bgHex: "#bfdbfe", url: createAnimalSvg("🐳", "#bfdbfe") },
  { id: "foca", name: "Foca", emoji: "🦭", bgColor: "bg-cyan-200", bgHex: "#a5f3fc", url: createAnimalSvg("🦭", "#a5f3fc") },
  { id: "camaleao", name: "Camaleão", emoji: "🦎", bgColor: "bg-teal-200", bgHex: "#99f6e4", url: createAnimalSvg("🦎", "#99f6e4") },
  { id: "pato", name: "Patinho", emoji: "🦆", bgColor: "bg-amber-200", bgHex: "#fde68a", url: createAnimalSvg("🦆", "#fde68a") },
  { id: "esquilo", name: "Esquilo", emoji: "🐿️", bgColor: "bg-orange-200", bgHex: "#fed7aa", url: createAnimalSvg("🐿️", "#fed7aa") },
  { id: "castor", name: "Castor", emoji: "🦫", bgColor: "bg-stone-300", bgHex: "#d6d3d1", url: createAnimalSvg("🦫", "#d6d3d1") },
  { id: "hipopotamo", name: "Hipopótamo", emoji: "🦛", bgColor: "bg-purple-200", bgHex: "#e9d5ff", url: createAnimalSvg("🦛", "#e9d5ff") },
  { id: "rinoceronte", name: "Rinoceronte", emoji: "🦏", bgColor: "bg-slate-300", bgHex: "#cbd5e1", url: createAnimalSvg("🦏", "#cbd5e1") },
  { id: "morcego", name: "Morceguinho", emoji: "🦇", bgColor: "bg-indigo-200", bgHex: "#c7d2fe", url: createAnimalSvg("🦇", "#c7d2fe") },
  { id: "hamster", name: "Hamster", emoji: "🐹", bgColor: "bg-rose-200", bgHex: "#fecdd3", url: createAnimalSvg("🐹", "#fecdd3") }
];

export function getAnimalAvatar(idOrIndex?: string | number): AnimalAvatar {
  if (typeof idOrIndex === "number") {
    return ANIMAL_AVATARS[idOrIndex % ANIMAL_AVATARS.length];
  }
  if (typeof idOrIndex === "string") {
    const found = ANIMAL_AVATARS.find((a) => a.id === idOrIndex || a.url === idOrIndex);
    if (found) return found;
  }
  return ANIMAL_AVATARS[0];
}
