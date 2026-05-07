# Usando o Gemma 4 no Agente

Este projeto já está preparado para usar qualquer provedor compatível com o padrão OpenAI. Para ativar o Gemma 4 (Groq ou OpenRouter), siga estes passos:

## 1. Configure as variáveis de ambiente
Você pode fazer isso localmente (`.env.local`) ou na Vercel (Dashboard > Settings > Environment Variables).

| Variável | Valor sugerido | Observações |
| --- | --- | --- |
| `OPENAI_API_KEY` | chave da Groq ou OpenRouter que dá acesso ao Gemma 4 | Ex: `sk-...` da Groq ou `or-sk-...` da OpenRouter |
| `AI_BASE_URL` | endpoint do provedor | Groq: `https://api.groq.com/openai/v1`
| | | OpenRouter: `https://openrouter.ai/api/v1`
| `AI_MODEL_NAME` | nome exato do modelo | Groq Gemma 4: `gemma2-9b-it` ou `gemma4` se disponível |

## 2. Defina o modelo no frontend
O backend já lê `process.env.AI_MODEL_NAME` em `src/app/api/chat/route.ts`, então não é necessário alterar código. Apenas certifique-se de que o valor esteja correto e que a chave de API tenha acesso ao modelo.

## 3. Deploy
Depois de ajustar as variáveis, rode o deploy:

```bash
npx vercel@latest deploy --yes --prod
```

## 4. Verifique no ambiente de produção
- Acesse `/vercel` ou o dashboard do Vercel para confirmar que as variáveis foram aplicadas.
- Inicie uma conversa no chat e observe o texto do `role: "assistant"` — se o endpoint estiver funcionando, verá respostas do Gemma 4.

## 5. Problemas comuns
- **401 Unauthorized**: verifique se a chave está correta e ativa.
- **Modelo não encontrado**: talvez sua conta não tenha acesso ao Gemma 4 específico; confirme o nome exato.
- **Resposta lenta**: alguns modelos de 9B são mais lentos, mas estão funcionando.

Se quiser, posso automatizar isso criando um script ou validação. Deseja isso também?
