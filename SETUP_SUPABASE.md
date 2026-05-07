# Guia Completo de Setup do Supabase

## Passo 1: Criar uma Conta Supabase (Gratuita)

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Sign Up"** ou **"Start Your Project"**
3. Escolha uma das opções de login:
   - Google
   - GitHub
   - Email + Senha
4. Complete a verificação de email se necessário
5. Você será direcionado para criar seu primeiro projeto

## Passo 2: Criar um Novo Projeto

1. Na dashboard do Supabase, clique em **"New Project"** ou **"Create a new project"**
2. Preencha os campos:
   - **Project Name**: Escolha um nome (ex: "mental-health-assistant")
   - **Database Password**: Crie uma senha forte (salve-a em um lugar seguro!)
   - **Region**: Escolha a região mais próxima (recomendado: São Paulo `sa-east-1` ou outra próxima)
   - **Pricing Plan**: Mantenha em **Free** para começar
3. Clique em **"Create new project"**
4. Aguarde 2-5 minutos enquanto o Supabase cria seu banco de dados

## Passo 3: Obter as Credenciais

### Opção A: ANON_KEY e URL (Para Cliente)

1. Na dashboard do seu projeto, clique em **"Settings"** (ícone de engrenagem, canto inferior esquerdo)
2. Na sidebar, vá para **"API"**
3. Você verá a seção **"Project API keys"**:
   - **URL do Projeto**: Copie a URL (ex: `https://xxxxx.supabase.co`)
   - **anon (public)**: Copie esta chave - é seu `ANON_KEY`
4. Salve em um local seguro

### Opção B: SERVICE_KEY (Para Servidor)

1. Na mesma página de **Settings > API**
2. Procure por **"service_role"** (também chamada de `SERVICE_KEY` ou `SECRET_KEY`)
3. Esta chave tem privilégios elevados - **NUNCA compartilhe** publicamente!
4. Use apenas no backend (arquivo `.env` do servidor, nunca no cliente)

## Passo 4: Executar o SQL de Setup

1. Na dashboard do seu projeto, clique em **"SQL Editor"** (ou **"Query"**)
2. Clique em **"New Query"**
3. Cole todo o conteúdo do arquivo `SQL_SETUP.sql`:

```sql
-- Criar tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  session_id TEXT UNIQUE,
  email TEXT,
  credits INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'basic',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de compras
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  stripe_session_id TEXT UNIQUE,
  amount INTEGER,
  credits INTEGER,
  tier TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_users_session ON users(session_id);
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_stripe ON purchases(stripe_session_id);
```

4. Clique no botão **"Run"** (▶️ play) ou pressione `Ctrl + Enter`
5. Você verá uma mensagem de sucesso confirmando que as tabelas foram criadas
6. Para verificar, vá em **"Table Editor"** na sidebar e você verá as tabelas `users` e `purchases`

## Passo 5: Adicionar as Credenciais ao Arquivo `.env`

Na raiz do seu projeto, crie ou edite um arquivo chamado `.env.local` (ou `.env` se for apenas desenvolvimento):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Explicação das Variáveis:

- **NEXT_PUBLIC_SUPABASE_URL**: URL do seu projeto Supabase (pública, pode ir no cliente)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Chave anônima para operações do cliente (pública)
- **SUPABASE_SERVICE_KEY**: Chave de serviço com privilégios elevados (PRIVADA, apenas servidor)

⚠️ **IMPORTANTE**: Variáveis que começam com `NEXT_PUBLIC_` serão expostas no cliente. Variáveis sem esse prefixo ficam privadas no servidor.

## Passo 6: Testar a Conexão (Opcional)

Crie um arquivo `test-supabase.js` na raiz do projeto:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const { data, error } = await supabase
  .from('users')
  .select('*')
  .limit(1)

if (error) {
  console.error('Erro:', error)
} else {
  console.log('Conexão bem-sucedida! Dados:', data)
}
```

Execute com:
```bash
node --loader dotenv/config test-supabase.js
```

## Troubleshooting

### Erro: "unauthorized"
- Verifique se você está usando a chave `anon` correta
- Verifique se a tabela tem as permissões corretas (RLS)

### Erro: "relation does not exist"
- Confirme que o SQL foi executado com sucesso
- Vá em **Table Editor** para ver se as tabelas existem

### Erro: "Invalid JWT"
- Verifique se a chave foi copiada completamente (sem espaços)
- Tente copiar novamente

### Chave não funciona após 5 minutos
- Supabase pode levar alguns minutos para propagar as chaves
- Aguarde 5 minutos e tente novamente

## Próximos Passos

1. ✅ Supabase está configurado
2. Configure autenticação (OAuth, Magic Link, etc.)
3. Configure Row-Level Security (RLS) para segurança
4. Configure backups automáticos (veja Settings > Backup)
5. Configure variáveis de ambiente para produção

Para mais informações, consulte a documentação oficial: [docs.supabase.com](https://docs.supabase.com)
