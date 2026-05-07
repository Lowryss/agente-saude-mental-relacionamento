# 🏗️ Arquitetura do Sistema - Mentor IA para Relacionamentos

## 📊 Fluxo Geral do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIO FINAL                           │
└────────────┬──────────────────────────────────────────────┬─────┘
             │                                              │
             ▼                                              ▼
    ┌──────────────────┐                        ┌──────────────────┐
    │   Landing Page   │                        │  Chat Page       │
    │   (Next.js)      │                        │  (Next.js)       │
    └─────────┬────────┘                        └────────┬─────────┘
              │                                         │
              │ Clica em "Comprar"                      │ Envia pergunta
              ▼                                         ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                    STRIPE PAYMENT                            │
    │  API: /api/checkout                                         │
    │  - Cria sessão de checkout                                 │
    │  - Redireciona para Stripe hosted checkout                 │
    │  - Retorna para /chat?payment=success                      │
    └─────────┬──────────────────────────────────────────────┬────┘
              │                                              │
              ▼                                              ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                   BACKEND (Next.js)                         │
    │  ┌──────────────────────────────────────────────────────┐   │
    │  │ API Routes:                                          │   │
    │  │  • /api/checkout     → Stripe checkout              │   │
    │  │  • /api/session      → Valida pagamento + cria user │   │
    │  │  • /api/chat         → Chama a IA (Ollama/OpenAI)   │   │
    │  │  • /api/credits/*    → Gerencia créditos            │   │
    │  └──────────────────────────────────────────────────────┘   │
    └──────────┬──────────────────────────────────────────────┬───┘
               │                                              │
               ▼                                              ▼
    ┌──────────────────────┐            ┌──────────────────────────┐
    │ SUPABASE (Database)  │            │  OLLAMA (Local IA)       │
    │ - users table        │            │  - Gemma model           │
    │ - purchases table    │            │  - Responde em português │
    │ - credits tracking   │            │  - 0 custo de API        │
    └──────────────────────┘            └──────────────────────────┘
```

## 🔄 Fluxo de Compra (Detailed)

1. **Usuário clica em "Comprar"**
   - Seleciona um plano (Basic/Plus/Premium)
   - Front-end envia: `POST /api/checkout` com `{ tier }`

2. **Servidor cria sessão Stripe**
   - `/api/checkout/route.ts`:
     - Define preço baseado no tier (R$4,99 / R$9,90 / R$29,90)
     - Cria `stripe.checkout.sessions.create()`
     - Retorna URL do Stripe

3. **Stripe processa pagamento**
   - Usuário preenche dados do cartão
   - Stripe valida e cobra
   - Redireciona para `/chat?payment=success&tier=TIER`

4. **Sistema processa sucesso**
   - `/api/session/route.ts`:
     - Valida sessionId com Stripe
     - Cria usuário no Supabase
     - Adiciona créditos (5/15/50)
     - Retorna userId
   - Front-end salva userId no localStorage
   - Chat carrega e permite mensagens

## 💬 Fluxo de Mensagem (Detailed)

1. **Usuário digita pergunta e envia**
   - Front-end valida: usuário existe? tem créditos?

2. **Sistema desconta 1 crédito**
   - `POST /api/credits/deduct`
   - Supabase: `UPDATE users SET credits = credits - 1`
   - Se créditos < 0: retorna erro 402

3. **Envia pergunta para a IA (Ollama)**
   - `POST /api/chat`
   - Ollama processa em `http://127.0.0.1:11434/v1`
   - Usa modelo `gemma` com System Prompt de relacionamento

4. **IA responde**
   - Resposta é validada (max 1000 tokens)
   - Exibida no chat do usuário
   - Créditos atualizados em tempo real

## 📁 Estrutura de Arquivos

```
Agente de Saude mental para relacionamento/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (venda)
│   │   ├── chat/
│   │   │   └── page.tsx          # Chat (produto)
│   │   ├── layout.tsx            # Layout principal
│   │   └── api/
│   │       ├── checkout/
│   │       │   └── route.ts      # Cria sessão Stripe
│   │       ├── session/
│   │       │   └── route.ts      # Processa pagamento
│   │       ├── chat/
│   │       │   └── route.ts      # Integra com IA
│   │       └── credits/
│   │           ├── deduct/
│   │           │   └── route.ts  # Desconta crédito
│   │           └── check/
│   │               └── route.ts  # Consulta saldo
│   ├── lib/
│   │   ├── supabase-client.ts   # Cliente Supabase
│   │   ├── supabase-server.ts   # Servidor Supabase
│   │   └── types.ts             # TypeScript types
│   └── styles/
│       └── globals.css          # Design system
├── .env.local                   # Variáveis (dev)
├── SQL_SETUP.sql               # Schema do banco
├── SETUP_SUPABASE.md           # Guia Supabase
├── CHECKLIST_FINAL.md          # Pre-launch checklist
└── README.md                   # Documentação
```

## 🔐 Fluxo de Segurança

### Dados do Usuário
```
Navegador (localStorage)           Supabase (Database)
    └── userId                        └── Encrypted
    └── credits (local cache)         └── Row-level Security
```

### Credenciais Sensíveis
```
.env.local (NUNCA commitar!)
├── STRIPE_SECRET_KEY         → Servidor apenas
├── SUPABASE_SERVICE_KEY      → Servidor apenas
├── SUPABASE_ANON_KEY         → Cliente (limitado)
└── AI_BASE_URL               → Pode ser pública
```

## 💰 Modelo Financeiro

### Custos
- **Ollama Gemma**: R$ 0,00 (roda localmente)
- **Supabase**: R$ 0,00 (plano gratuito, até 500k requisições)
- **Stripe**: 2,99% + R$ 0,30 por transação
- **Hosting (Vercel)**: R$ 0,00 (gratuito até 100k req/mês)

### Receita
- Basic (5 respostas): R$ 4,99 → Lucro: R$ 4,50 (90%)
- Plus (15 respostas): R$ 9,90 → Lucro: R$ 9,35 (94%)
- Premium (50 respostas): R$ 29,90 → Lucro: R$ 28,94 (97%)

## 🎯 Próximos Passos

1. **Setup Supabase** (30 min)
   - Criar conta
   - Executar SQL_SETUP.sql
   - Salvar credenciais

2. **Setup Ollama** (20 min)
   - Instalar Ollama
   - Executar: `ollama pull gemma`
   - Verificar: `http://127.0.0.1:11434`

3. **Atualizar .env.local** (10 min)
   - Adicionar todas as variáveis
   - Testar `npm run dev`

4. **Testar Fluxo Completo** (30 min)
   - Comprar pacote (Stripe test mode)
   - Fazer perguntas
   - Verificar créditos no Supabase

5. **Deploy** (60 min)
   - Push para GitHub
   - Deploy em Vercel (conecta automaticamente)
   - Configurar variáveis de produção

---

**Status**: 🟢 Arquitetura pronta | ⚠️ Precisa setup de credenciais
