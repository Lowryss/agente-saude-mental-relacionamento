# Checklist Final - Antes de Ir Para Produção

## 🔐 Segurança

- [ ] **Variáveis de Ambiente**
  - [ ] `.env.local` ou `.env` criado com todas as chaves
  - [ ] `.env.local` adicionado ao `.gitignore`
  - [ ] Nenhuma chave secreta commitada no Git
  - [ ] SERVICE_KEY nunca usado no código cliente
  - [ ] ANON_KEY tem permissões mínimas necessárias

- [ ] **Autenticação**
  - [ ] Sistema de login/signup implementado
  - [ ] Senhas com hash forte (bcrypt, argon2, etc)
  - [ ] Tokens JWT/Session com expiração apropriada
  - [ ] Rate limiting implementado para login
  - [ ] Proteção contra brute force

- [ ] **Row-Level Security (RLS)**
  - [ ] RLS habilitado nas tabelas `users` e `purchases`
  - [ ] Políticas de segurança definidas corretamente
  - [ ] Usuários só acessam seus próprios dados
  - [ ] Policies testadas com usuários diferentes

- [ ] **HTTPS/SSL**
  - [ ] Aplicação rodando em HTTPS em produção
  - [ ] Certificados SSL válidos
  - [ ] Sem warnings de segurança no navegador

## 💳 Pagamentos (Stripe)

- [ ] **Configuração Stripe**
  - [ ] Conta Stripe criada e verificada
  - [ ] Chaves Publishable Key e Secret Key obtidas
  - [ ] Chaves adicionadas ao `.env.local`
  - [ ] Modo de teste funcionando
  - [ ] Webhook configurado (`/api/webhook/stripe`)

- [ ] **Fluxo de Compra**
  - [ ] Checkout funciona sem erros
  - [ ] Valores são correctos (centavos)
  - [ ] Redirecionamento após pagamento funciona
  - [ ] Créditos são adicionados corretamente ao usuário
  - [ ] Email de confirmação enviado após compra

- [ ] **Segurança Stripe**
  - [ ] Secret Key nunca exposto no cliente
  - [ ] Webhook signature verificado
  - [ ] Valores de compra nunca vêm do cliente (validate on backend)

## 🗄️ Banco de Dados

- [ ] **Supabase Setup**
  - [ ] Projeto criado e funcional
  - [ ] Tabelas `users` e `purchases` criadas
  - [ ] Índices criados para performance
  - [ ] Chaves (URL e ANON_KEY) funcionando

- [ ] **Dados**
  - [ ] Backup automático habilitado
  - [ ] Política de retenção de dados definida
  - [ ] Dados sensíveis criptografados (se necessário)

- [ ] **Performance**
  - [ ] Índices criados nas colunas mais consultadas
  - [ ] Queries otimizadas
  - [ ] Cache implementado onde apropriado
  - [ ] Sem N+1 queries

## 🤖 Agente de Saúde Mental

- [ ] **Funcionalidades Core**
  - [ ] IA responde corretamente a perguntas sobre relacionamento
  - [ ] Histórico de conversa mantido
  - [ ] Sistema de créditos funcionando
  - [ ] Limite de créditos por usuário respeitado
  - [ ] Tiers de acesso funcionando corretamente

- [ ] **Qualidade**
  - [ ] Respostas são relevantes e úteis
  - [ ] Sem informações sensíveis expostas
  - [ ] Rate limiting implementado para API
  - [ ] Timeout configurado para requisições da IA

- [ ] **Tiers/Planos**
  - [ ] Tier "Basic" funciona corretamente
  - [ ] Tier "Premium" com mais créditos
  - [ ] Tier "Pro" com benefícios adicionais
  - [ ] Limite de créditos por tier respeitado
  - [ ] Upgrade de tier funciona

## 🧪 Testes

- [ ] **Testes Unitários**
  - [ ] Testes para lógica de negócio escrit
  - [ ] Testes para cálculo de créditos
  - [ ] Testes para validação de entrada
  - [ ] Cobertura de testes > 70%

- [ ] **Testes de Integração**
  - [ ] Fluxo de compra testado end-to-end
  - [ ] Autenticação testada
  - [ ] Integração com Supabase testada
  - [ ] Integração com Stripe testada

- [ ] **Testes Manuais**
  - [ ] Criar usuário novo
  - [ ] Fazer login
  - [ ] Fazer pergunta ao agente
  - [ ] Comprar créditos
  - [ ] Fazer pergunta após compra
  - [ ] Exaurir créditos e tentar pergunta
  - [ ] Logout e login novamente
  - [ ] Histórico de conversa persiste

## 📱 Frontend

- [ ] **Responsive Design**
  - [ ] Mobile responsivo (testado em iPhone/Android)
  - [ ] Tablet responsivo
  - [ ] Desktop responsivo
  - [ ] Sem overflow de conteúdo

- [ ] **Acessibilidade**
  - [ ] Contraste de cores adequado (WCAG AA)
  - [ ] Tudo funcionável com teclado
  - [ ] Screen reader compatible
  - [ ] Alt text em imagens

- [ ] **Performance**
  - [ ] Tempo de carregamento < 3 segundos
  - [ ] Lighthouse score > 80
  - [ ] Imagens otimizadas
  - [ ] Code splitting implementado
  - [ ] Sem console errors

- [ ] **UI/UX**
  - [ ] Design consistente
  - [ ] Navegação clara
  - [ ] Botões CTA óbvios
  - [ ] Feedback visual adequado (loading, success, error)
  - [ ] Mensagens de erro úteis

## 🔧 DevOps/Deployment

- [ ] **Variáveis de Ambiente**
  - [ ] Configuradas no hosting (Vercel, Railway, etc)
  - [ ] Diferentes para dev/staging/prod
  - [ ] Nenhuma informação sensível no repositório

- [ ] **Deployment**
  - [ ] CI/CD pipeline funcionando
  - [ ] Testes rodando antes de deploy
  - [ ] Deploy automático em push (ou manual)
  - [ ] Rollback preparado

- [ ] **Monitoramento**
  - [ ] Error tracking configurado (Sentry, etc)
  - [ ] Logs sendo capturados
  - [ ] Alertas configurados para erros críticos
  - [ ] Analytics/Telemetria implementado

## 📋 Documentação

- [ ] **Código**
  - [ ] Código comentado nas partes complexas
  - [ ] README.md atualizado
  - [ ] API endpoints documentados
  - [ ] Arquitetura do projeto explicada

- [ ] **Usuário**
  - [ ] Termos de Serviço redigidos
  - [ ] Política de Privacidade redigida
  - [ ] FAQ ou Help page
  - [ ] Email de boas-vindas com instruções

## 📊 Antes do Lançamento

- [ ] **Testes de Carga**
  - [ ] Testar com múltiplos usuários simultâneos
  - [ ] Verificar rate limiting
  - [ ] Verificar timeouts

- [ ] **Segurança Final**
  - [ ] Audit de segurança realizado
  - [ ] OWASP Top 10 checado
  - [ ] Dependency vulnerabilities: `npm audit` sem críticos
  - [ ] Senhas de admin fortes

- [ ] **Backup & Disaster Recovery**
  - [ ] Backup automático configurado
  - [ ] Plano de recuperação documentado
  - [ ] Teste de restore realizado

- [ ] **Comunicação**
  - [ ] Equipe alinhada no lançamento
  - [ ] Plano de suporte definido
  - [ ] Canais de feedback configurados

## 🚀 Lançamento

- [ ] **Go Live**
  - [ ] DNS apontando para a aplicação
  - [ ] SSL certificate válido
  - [ ] Produção testada completamente
  - [ ] Suporte disponível
  - [ ] Announcement preparado

- [ ] **Pós-Lançamento**
  - [ ] Monitorar erros e performance por 24h
  - [ ] Responder a issues rapidamente
  - [ ] Coletar feedback dos usuários
  - [ ] Planejar melhorias

## 📝 Notas Importantes

- **Nunca commitar credenciais**: `.env`, chaves secretas, senhas
- **Sempre usar HTTPS em produção**: Dados sensíveis em trânsito
- **Testar tudo em staging primeiro**: Antes de prod
- **Ter backup de tudo**: Banco de dados, configurações, código
- **Documentar tudo**: Processos, arquitetura, deployment
- **Comunicar com a equipe**: Status, issues, planos

## Contato de Emergência

Se algo der errado após o lançamento:

1. **Erro crítico**: Rollback imediato
2. **Notificar stakeholders**: Status update
3. **Documentar**: O que aconteceu, como foi resolvido
4. **Implement fix**: Testes + deploy
5. **Post-mortem**: Lições aprendidas

---

**Status**: ⬜ Não iniciado | 🟡 Em progresso | ✅ Completo

Última atualização: [DATA]
