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
