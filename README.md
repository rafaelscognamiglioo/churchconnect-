# ChurchConnect 🔮

**O hub completo para conectar sua igreja.**

Gerencie eventos, membros e experiências da sua comunidade em um único lugar. Inspirado em Wellhub, Stripe e Notion. Feito para igrejas modernas.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilos | TailwindCSS + CSS Variables |
| Animações | Framer Motion |
| Componentes | Shadcn/ui + Radix UI |
| Banco | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Gráficos | Recharts |
| Deploy | Vercel |

---

## Setup local

### 1. Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```
Edite `.env.local` com suas credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Criar o banco de dados
No painel do Supabase → SQL Editor, execute o conteúdo de `supabase/schema.sql`.

### 5. Rodar em desenvolvimento
```bash
npm run dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

---

## Estrutura do projeto

```
churchconnect/
├── app/
│   ├── page.tsx                    # Landing page principal
│   ├── planos/page.tsx             # Página de planos
│   ├── como-funciona/page.tsx      # Como funciona
│   ├── eventos/
│   │   ├── page.tsx                # Descoberta pública de eventos
│   │   └── [id]/page.tsx           # Detalhe do evento
│   ├── igrejas/
│   │   ├── cadastro/page.tsx       # Cadastro de igreja
│   │   └── [slug]/page.tsx         # Página pública da igreja
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── registro/page.tsx
│   └── (dashboard)/
│       ├── dashboard/page.tsx      # Dashboard principal
│       ├── eventos/page.tsx        # Gestão de eventos
│       ├── membros/page.tsx        # Gestão de membros
│       └── configuracoes/page.tsx  # Configurações
├── components/
│   ├── marketing/                  # Componentes da landing page
│   └── dashboard/                  # Componentes do painel
├── lib/
│   ├── types.ts                    # Tipos TypeScript
│   ├── utils.ts                    # Utilidades
│   └── supabase.ts                 # Client Supabase
└── supabase/
    └── schema.sql                  # Schema completo do banco
```

---

## Páginas implementadas

| Página | Rota | Descrição |
|--------|------|-----------|
| Landing Page | `/` | Hero, features, pricing, testimonials, FAQ |
| Planos | `/planos` | Comparação de planos |
| Como funciona | `/como-funciona` | Guia passo a passo |
| Cadastro Igreja | `/igrejas/cadastro` | CTA de cadastro |
| Login | `/login` | Autenticação |
| Registro | `/registro` | Cadastro em 3 etapas |
| Eventos públicos | `/eventos` | Descoberta de eventos |
| Evento detalhe | `/eventos/[id]` | Inscrição em evento |
| Dashboard | `/dashboard` | Painel principal com analytics |
| Gestão de Eventos | `/dashboard/eventos` | CRUD de eventos |
| Gestão de Membros | `/dashboard/membros` | Tabela de membros |
| Configurações | `/dashboard/configuracoes` | Perfil, notificações, plano |

---

## Deploy na Vercel

```bash
npm install -g vercel
vercel --prod
```

Configure as variáveis de ambiente no painel da Vercel.

---

## Planos disponíveis

| Plano | Preço | Membros | Eventos |
|-------|-------|---------|---------|
| Starter | Grátis | 50 | 5/mês |
| Growth | R$ 97/mês | 300 | 30/mês |
| Revival | R$ 197/mês | 1.000 | Ilimitados |
| Legacy | R$ 397/mês | Ilimitados | Ilimitados |

---

Feito com ♥ para igrejas do Brasil · ChurchConnect © 2025
