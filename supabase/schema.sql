-- ==============================================================================
-- 🏛️ LUMINA PLATFORM - SCHEMA COMPLETO SUPABASE (POSTGRESQL + RLS)
-- 100% Free Tier Compatible (Postgres, Row Level Security, Realtime, Triggers)
-- ==============================================================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE PERFIS DE USUÁRIO (profiles)
-- Vinculada à tabela de autenticação auth.users do Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL DEFAULT 'Novo Aluno',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio TEXT DEFAULT 'Estudante focado em aprendizado colaborativo.',
    custom_role TEXT NOT NULL DEFAULT 'Aluno Destaque' CHECK (
        custom_role IN ('Administrador', 'Moderador', 'Aluno Destaque', 'Monitor Acadêmico', 'Pesquisador')
    ),
    role_color TEXT NOT NULL DEFAULT 'indigo',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE SALAS PRIVADAS (rooms)
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT 'Geral',
    description TEXT,
    invite_code VARCHAR(12) UNIQUE NOT NULL,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    banner_color TEXT DEFAULT 'from-blue-500/20 to-purple-500/20',
    canva_presentation_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE MEMBROS DA SALA (room_members)
CREATE TABLE IF NOT EXISTS public.room_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- 5. TABELA DE AVISOS FIXADOS (notices)
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT TRUE,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'urgent')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE TAREFAS E PRAZOS DO MURAL (tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL DEFAULT 'Geral',
    due_date TIMESTAMPTZ NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    canva_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELA DE ESPAÇO PESSOAL / NOTAS (notes - Estilo Notion)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Sem Título',
    content TEXT DEFAULT '',
    icon TEXT DEFAULT '📝',
    category TEXT DEFAULT 'Caderno Principal',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABELA DE CHAT EM TEMPO REAL (messages)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    canva_attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABELA DE FEED DE RESUMOS (summaries - Estilo Knowunity)
CREATE TABLE IF NOT EXISTS public.summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    canva_embed_url TEXT,
    download_url TEXT,
    likes_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT ARRAY['Resumo', 'Revisão']::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 🔒 POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
CREATE POLICY "Perfis visíveis para todos os autenticados" 
    ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuário pode atualizar o próprio perfil" 
    ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Políticas para Salas (Rooms)
CREATE POLICY "Visualizar salas em que é membro ou dono" 
    ON public.rooms FOR SELECT TO authenticated 
    USING (
        owner_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.room_members 
            WHERE room_members.room_id = rooms.id 
            AND room_members.user_id = auth.uid() 
            AND room_members.is_banned = FALSE
        )
    );

CREATE POLICY "Criar novas salas" 
    ON public.rooms FOR INSERT TO authenticated 
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Donos e administradores podem atualizar sala" 
    ON public.rooms FOR UPDATE TO authenticated 
    USING (
        owner_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.room_members 
            WHERE room_members.room_id = rooms.id 
            AND room_members.user_id = auth.uid() 
            AND room_members.role IN ('owner', 'admin')
        )
    );

-- Políticas para Membros da Sala (Room Members)
CREATE POLICY "Membros da sala podem visualizar outros membros" 
    ON public.room_members FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.room_members AS rm 
            WHERE rm.room_id = room_members.room_id 
            AND rm.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuário pode se juntar à sala" 
    ON public.room_members FOR INSERT TO authenticated 
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Administradores podem gerenciar membros" 
    ON public.room_members FOR UPDATE TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.room_members AS admin_rm 
            WHERE admin_rm.room_id = room_members.room_id 
            AND admin_rm.user_id = auth.uid() 
            AND admin_rm.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Administradores podem remover membros" 
    ON public.room_members FOR DELETE TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.room_members AS admin_rm 
            WHERE admin_rm.room_id = room_members.room_id 
            AND admin_rm.user_id = auth.uid() 
            AND admin_rm.role IN ('owner', 'admin')
        )
    );

-- Políticas para Tarefas (Tasks)
CREATE POLICY "Membros da sala podem ver tarefas" 
    ON public.tasks FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.room_members 
            WHERE room_members.room_id = tasks.room_id 
            AND room_members.user_id = auth.uid() 
            AND room_members.is_banned = FALSE
        )
    );

CREATE POLICY "Membros autorizados podem criar tarefas" 
    ON public.tasks FOR INSERT TO authenticated 
    WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Criadores ou admins podem atualizar tarefas" 
    ON public.tasks FOR UPDATE TO authenticated 
    USING (
        creator_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.room_members 
            WHERE room_members.room_id = tasks.room_id 
            AND room_members.user_id = auth.uid() 
            AND room_members.role IN ('owner', 'admin', 'moderator')
        )
    );

-- Políticas para Notas Pessoais Estilo Notion (Notes)
CREATE POLICY "Usuário só vê suas próprias notas" 
    ON public.notes FOR ALL TO authenticated 
    USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid());

-- Políticas para Mensagens de Chat (Messages)
CREATE POLICY "Membros podem ver mensagens da sala" 
    ON public.messages FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.room_members 
            WHERE room_members.room_id = messages.room_id 
            AND room_members.user_id = auth.uid() 
            AND room_members.is_banned = FALSE
        )
    );

CREATE POLICY "Membros não banidos podem enviar mensagens" 
    ON public.messages FOR INSERT TO authenticated 
    WITH CHECK (
        user_id = auth.uid() AND 
        EXISTS (
            SELECT 1 FROM public.room_members 
            WHERE room_members.room_id = messages.room_id 
            AND room_members.user_id = auth.uid() 
            AND room_members.is_banned = FALSE
        )
    );

-- Políticas para Feed de Resumos (Summaries)
CREATE POLICY "Membros podem ver resumos da sala" 
    ON public.summaries FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.room_members 
            WHERE room_members.room_id = summaries.room_id 
            AND room_members.user_id = auth.uid() 
            AND room_members.is_banned = FALSE
        )
    );

CREATE POLICY "Membros podem publicar resumos" 
    ON public.summaries FOR INSERT TO authenticated 
    WITH CHECK (author_id = auth.uid());

-- ==============================================================================
-- ⚡ TRIGGERS AUTOMÁTICOS
-- ==============================================================================

-- 1. Criação automática de perfil ao registrar no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, avatar_url, custom_role, role_color)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
        COALESCE(new.raw_user_meta_data->>'custom_role', 'Aluno Destaque'),
        COALESCE(new.raw_user_meta_data->>'role_color', 'indigo')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Habilitação de Realtime no Supabase para tabelas de colaboração instantânea
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notices;
