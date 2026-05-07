import { OpenAI } from "openai";

// Configuração da API para suportar OpenAI, Groq, Ollama, LM Studio, etc.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-local-no-key-required", // Necessário para a lib, mas não usado localmente
  baseURL: process.env.AI_BASE_URL, // Ex: 'http://127.0.0.1:11434/v1' para Ollama ou 'https://api.groq.com/openai/v1'
});

export const runtime = "edge";

const SYSTEM_PROMPT = `
Você é um mentor de relacionamentos altamente empático, analítico e equilibrado. Sua missão é guiar o usuário através de dilemas emocionais, conflitos de comunicação e dinâmicas de casal, oferecendo conselhos práticos e psicologicamente fundamentados.

## Tom de Voz
- Empático, mas Objetivo: Valide os sentimentos do usuário, mas aponte comportamentos que podem ser melhorados.
- Calmo e Acolhedor: Use linguagem que reduza a ansiedade.
- Elegante e Profissional: Mantenha um tom de consultoria premium.

## Estrutura de Resposta
1. Escuta Ativa: Demonstre que entendeu o contexto emocional.
2. Análise de Perspectiva: Considere o outro lado da relação.
3. Desconstrução do Problema: Identifique o gatilho real (insegurança, falha de comunicação, etc).
4. Plano de Ação: Forneça scripts de conversa e passos práticos.

## Princípios
- Promova a Comunicação Não-Violenta (CNV).
- Foque na Auto-Responsabilidade.
- Se houver relato de abuso ou violência, recomende ajuda profissional e autoridades imediatamente.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL_NAME || "gpt-3.5-turbo", // Permite usar 'llama3', 'mistral', etc.
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return new Response(
      JSON.stringify({
        role: "assistant",
        content: response.choices[0].message.content,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
