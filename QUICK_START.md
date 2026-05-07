# ⚡ Quick Start - Seu Mentor IA em 2 Horas

## Resumo do que você tem:

✅ **Landing Page** com 3 planos (R$ 4,99 / R$ 9,90 / R$ 29,90)
✅ **Chat IA** com gerenciamento de créditos
✅ **Stripe** para cobrar os clientes
✅ **Supabase** para guardar dados
✅ **Ollama Gemma** para responder (0 custo!)

---

## PASSO 1: Setup Supabase (30 minutos)

### 1. Criar Conta
- Vai em https://supabase.com
- Clica "Sign Up" 
- Faz login com Google/GitHub

### 2. Criar Projeto
- Clica em "New Project"
- Nome: `mentor-relacionamento` (ou qualquer nome)
- Password: salva em um lugar seguro (você vai precisar)
- Region: `São Paulo` (sa-east-1)
- Clica "Create new project"
- **AGUARDA 2-5 MINUTOS** (Supabase cria o banco)

### 3. Pegar Credenciais
- Clica em **Settings** (engrenagem no canto inferior esquerdo)
- Clica em **API**
- Copia:
  - **Project URL** → é seu `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public key** → é seu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role secret** → é seu `SUPABASE_SERVICE_KEY`

### 4. Criar Tabelas
- Volta para a dashboard
- Clica em **SQL Editor** (no menu da esquerda)
- Clica em **New Query**
- Copia TODO o conteúdo de `SQL_SETUP.sql` do seu projeto
- Cola na query
- Clica em **Run** (botão play ▶️)
- **DONE!** Vê em **Table Editor** as tabelas `users` e `purchases`

---

## PASSO 2: Setup Variáveis de Ambiente (10 minutos)

### 1. Criar .env.local
Na raiz do seu projeto, cria um arquivo chamado `.env.local`:

```env
# Ollama Local
AI_BASE_URL=http://127.0.0.1:11434/v1
AI_MODEL_NAME=gemma

# Stripe (já tem, só verifica)
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SfEyq9K784xcK8nqAYkw67QyWHvuew1Gbsr2zmjq0U0RlTFAjqavEYn1idxN5ZQN7vUS07am6pJXD1evTgyyssC00cm36IbDM

# Supabase (add as credenciais que copiou)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsIn...
SUPABASE_URL=https://xxxxxxx.supabase.co
```

### 2. Salvar
- Salva o arquivo (Ctrl+S)
- **NÃO commita** esse arquivo no Git! (já deve estar no .gitignore)

---

## PASSO 3: Testar Localmente (30 minutos)

### 1. Verificar Ollama
Abre um terminal e testa:
```bash
curl http://127.0.0.1:11434/api/tags
```

Se retornar um JSON com modelos, você tem Ollama rodando. Se não:
- Abre o Ollama da sua máquina
- Espera ele iniciar
- Tenta novamente

### 2. Rodar o projeto
```bash
npm run dev
```

Deve abrir em `http://localhost:3000`

### 3. Testar Fluxo
1. **Vai para `/` (landing page)**
   - Vê os 3 planos
   - Design lindo? ✓

2. **Clica em um plano (ex: "Escolher Premium")**
   - Abre checkout do Stripe
   - No modo teste, usa: **4242 4242 4242 4242** (cartão de teste)
   - Data futura qualquer (ex: 12/25)
   - CVC: 123
   - Email: qualquer um
   - Clica "Pay"

3. **Deve redirecionar para `/chat`**
   - Vê créditos (deve ser 50 ou 15 ou 5)
   - Digita uma pergunta: "Como reconquistar meu ex?"
   - Envia
   - **A IA responde** (Gemma via Ollama)
   - Créditos decrementam (-1)

4. **Verifica no Supabase**
   - Vai em `https://app.supabase.com`
   - Seu projeto → **Table Editor**
   - Clica em `users` → vê seu usuário com créditos
   - Clica em `purchases` → vê a compra registrada

---

## PASSO 4: Deploy (30 minutos)

### 1. Push para GitHub
```bash
git add .
git commit -m "feat: sistema de mentoria em relacionamentos com créditos"
git push origin main
```

### 2. Deploy em Vercel
- Vai em https://vercel.com
- Conecta seu GitHub
- Clica em "Import Project"
- Seleciona este repositório
- Clica "Deploy"
- Vercel copia as variáveis de `.env.local`? **NÃO!** Você precisa adicionar:

### 3. Variáveis de Produção
No dashboard Vercel do seu projeto:
- Vai em **Settings** → **Environment Variables**
- Adiciona todas as variáveis de `.env.local`
- **Importante**: Para produção, você precisa:
  - `STRIPE_SECRET_KEY` real (live, não teste)
  - `SUPABASE_SERVICE_KEY` real
  - `AI_BASE_URL` = URL pública da sua IA (ou manter local se não mudar)

### 4. Redeploy
- Vai em **Deployments**
- Clica em **Redeploy** na mais recente
- Aguarda (2-3 minutos)
- **LIVE!** Seu domínio Vercel está funcionando

---

## 🎯 Checklist Final

- [ ] Supabase criado e tabelas criadas
- [ ] .env.local preenchido com todas as credenciais
- [ ] `npm run dev` funciona sem erros
- [ ] Landing page abre em `http://localhost:3000`
- [ ] Fluxo de compra funciona (Stripe test mode)
- [ ] Chat responde com Ollama Gemma
- [ ] Créditos são decontados
- [ ] Dados aparecem no Supabase
- [ ] Push para GitHub
- [ ] Deploy em Vercel
- [ ] Variáveis de produção configuradas
- [ ] Site está live em seu domínio Vercel

---

## 💡 Troubleshooting Rápido

### Erro: "Ollama não responde"
```
Solução: Abre o app Ollama e aguarda carregar.
Se não tiver instalado: https://ollama.ai
```

### Erro: "Supabase keys inválidas"
```
Solução: Copia novamente as chaves (sem espaços extras)
Vai em Project Settings → API novamente
```

### Erro: "Stripe key inválida"
```
Solução: Usa as chaves que você já tem no .env
(pk_live_... é pública, pode ficar no código)
(sk_live_... é secreta, nunca mostre)
```

### Chat não responde
```
Solução: 
1. Verifica se Ollama está rodando: curl http://127.0.0.1:11434/api/tags
2. Verifica se AI_MODEL_NAME é "gemma" ou o nome exato do seu modelo
3. Verifica erro no console (F12 → Console)
```

---

## 🚀 Próximos Passos (Pós-Lançamento)

1. **Marketing**: Instagram, TikTok com cases de sucesso
2. **Melhorias**: 
   - Histórico de conversa salvo
   - Exportar conversa em PDF
   - Comunidade de usuários
   - Mais especializações (não só relacionamento)
3. **Monetização Extra**:
   - Assinatura mensal (créditos automáticos)
   - Consultoria 1-on-1 com psicólogo (via seu site)
   - Integrações (WhatsApp, Discord)

---

**Você consegue! Qualquer dúvida, relê este guia ou a arquitetura. Bora vender! 🚀**
