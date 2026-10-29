import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/lib/user-context";
import { UserOnboardingModal } from "@/components/auth/user-onboarding-modal";

export const metadata: Metadata = {
  title: "Lumina | Plataforma Colaborativa de Estudos",
  description:
    "Salas privadas, mural de prazos, caderno Notion-style, chat em tempo real e integração Canva. 100% Free Tier (Vercel, Supabase, Resend, Railway).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen antialiased selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-300">
        <ThemeProvider>
          <UserProvider>
            {children}
            <UserOnboardingModal />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
