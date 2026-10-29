# 🏛️ Lumina Platform - Campus Colaborativo Apple-Style

> Plataforma completa para gestão de salas de aula privadas, mural de atividades, caderno de notas estilo Notion, chat em tempo real, feed de resumos estilo Knowunity e integração profunda com o Canva. Construída sobre uma arquitetura **100% Free Tier**.

---

## ⚡ Stack Tecnológica (Nível Gratuito / Free Tier)

| Serviço | Função | Nível Gratuito |
| :--- | :--- | :--- |
| **Vercel** | Hospedagem do Frontend & Rotas Serverless (Next.js 15/16 App Router) | Deploy contínuo ilimitado, HTTPS automático, borda global |
| **Supabase** | Banco PostgreSQL, RLS, Auth e WebSockets Realtime | 500 MB BD, 50.000 usuários ativos/mês, 200 conexões simultâneas |
| **Resend** | Disparo de e-mails transacionais e alertas de prazos | 3.000 e-mails/mês (100/dia) no plano Free |
| **Railway** | Microserviços opcionais / workers em background | $5 de crédito mensal de execução no Free Tier |
| **GitHub** | Repositório de código e integração nativa com Vercel | Repositórios públicos e privados ilimitados |

---

## 🚀 Como Iniciar o Projeto Localmente

### 1. Clonar e Instalar Dependências
```bash
cd lumina-study
npm install
```

### 2. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Abra seu navegador em [http://localhost:3000](http://localhost:3000). A aplicação já possui dados de demonstração interativos pré-carregados para navegação imediata.

---

## 🗄️ Configuração do Supabase (Banco de Dados & Auth)

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Acesse o **SQL Editor** do seu painel Supabase.
3. Copie todo o conteúdo do arquivo [`supabase/schema.sql`](supabase/schema.sql) e execute-o.
   - O script criará as tabelas: `profiles`, `rooms`, `room_members`, `notices`, `tasks`, `notes`, `messages`, `summaries`.
   - Habilitará o **Row Level Security (RLS)** em todas as tabelas com políticas de permissão.
   - Criará a trigger de criação automática de perfil a partir do `auth.users`.
   - Habilitará o **Realtime** para as mensagens e tarefas.
4. No arquivo `.env.local`, preencha as variáveis obtidas em *Project Settings > API*:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-secreta
   ```

---

## 📧 Configuração do Resend (Alertas de Prazo por E-mail)

1. Crie uma conta gratuita em [resend.com](https://resend.com).
2. Gere uma API Key em *API Keys*.
3. No arquivo `.env.local`:
   ```env
   RESEND_API_KEY=re_sua_chave_aqui
   NOTIFICATION_FROM_EMAIL=Lumina <onboarding@resend.dev>
   ```

---

## 🎨 Funcionalidades Principais & Design Apple

- **Design System Apple**: Superfícies translúcidas em vidro (`backdrop-blur-xl bg-white/70 dark:bg-black/75`), cantos arredondados contínuos (`rounded-2xl` / `rounded-3xl`), tipografia refinada e alternância fluida entre **Modo Claro** e **Modo Escuro**.
- **Entrada por Código**: Cada sala possui um código único (ex: `LUMINA-7821`, `APPLE-4092`).
- **Painel Administrativo da Sala**: Administradores podem banir/remover membros, criar prazos e fixar avisos no mural.
- **Espaço Pessoal (Estilo Notion)**: Bloco de notas flexível com suporte a markdown, ícones de capa, categorias e busca instantânea.
- **Feed de Resumos (Estilo Knowunity)**: Publicação e download de materiais com tags, contador de curtidas e embeds do Canva.
- **Central Canva**: Botões de acesso rápido para criar apresentações e cartazes, além de visualizador interativo embutido.
- **Perfis com Cargos Visíveis**: Escolha entre *Administrador*, *Moderador*, *Aluno Destaque*, *Monitor Acadêmico* e *Pesquisador*.
