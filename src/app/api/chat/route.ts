import { OpenAI } from "openai";

// Configuração da API para suportar OpenAI, Groq, Ollama, LM Studio, etc.
const hasApiConfig = process.env.OPENAI_API_KEY || process.env.AI_BASE_URL;

let openai: OpenAI | null = null;
if (hasApiConfig) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "sk-local-no-key-required",
    baseURL: process.env.AI_BASE_URL,
  });
}

export const runtime = "edge";

interface ChatContext {
  userName?: string;
  partnerName?: string;
  relationshipType?: string;
  situation?: string;
  desiredOutcome?: string;
  feelings?: string;
  photos?: string[]; // base64 encoded photos
}

function buildSystemPrompt(context?: ChatContext): string {
  let prompt = `Você é um mentor de relacionamentos altamente empático, analítico e equilibrado. Sua missão é guiar o usuário através de dilemas emocionais, conflitos de comunicação e dinâmicas de casal, oferecendo conselhos práticos e psicologicamente fundamentados.

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
- Se houver relato de abuso ou violência, recomende ajuda profissional e autoridades imediatamente.`;

  if (context) {
    prompt += `\n\n## Contexto Personalizado do Usuário\n`;
    if (context.userName) prompt += `- Nome do usuário: ${context.userName}\n`;
    if (context.partnerName) prompt += `- Nome da pessoa: ${context.partnerName}\n`;
    if (context.relationshipType) prompt += `- Tipo de relacionamento: ${context.relationshipType}\n`;
    if (context.situation) prompt += `- Situação atual: ${context.situation}\n`;
    if (context.desiredOutcome) prompt += `- Resultado desejado: ${context.desiredOutcome}\n`;
    if (context.feelings) prompt += `- Como se sente: ${context.feelings}\n`;
    if (context.photos && context.photos.length > 0) {
      prompt += `- Fotos foram compartilhadas para análise de contexto\n`;
    }
    prompt += `\nUse esse contexto para personalizar suas respostas. Seja específico e relevante à situação do usuário.`;
  }

  return prompt;
}

// Mock responses when API is not available
function getMockResponse(messages: any[], context?: ChatContext): string {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
  const userName = context?.userName || "";
  const partnerName = context?.partnerName || "a pessoa";
  
  const greetings = [
    `Olá${userName ? `, ${userName}` : ""}! Entendo que está passando por algo desafiador com ${partnerName}. Vamos trabalhar juntos nisso.`,
    `Oi${userName ? ` ${userName}` : ""}! Obrigado por compartilhar isso comigo. Situações como essa com ${partnerName} são realmente complexas.`,
    `Olá${userName ? `, ${userName}` : ""}! Estou aqui para ajudar você a navegar por essa situação com ${partnerName}.`,
  ];
  
  if (lastMessage.includes("oi") || lastMessage.includes("olá") || lastMessage.includes("hello")) {
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  if (lastMessage.includes("não responde") || lastMessage.includes("ignorou") || lastMessage.includes("silêncio")) {
    return `Entendo que a ansiedade bate forte nessas horas${userName ? `, ${userName}` : ""}. Respire fundo. O silêncio raramente é sobre você, pode ser apenas a rotina dele/dela. Antes de mandar outra mensagem, vamos focar em algo que você controla?

**Análise:** Você está externalizando sua segurança emocional na resposta de ${partnerName}.

**Plano de Ação:**
1. Espere 24h antes de enviar nova mensagem
2. Não mande mensagens emocionais no calor do momento
3. Use esse tempo para se centrar - faça algo que te faça bem

**Script para depois:** "Oi ${partnerName}, tudo bem? Só queria saber como foi seu dia." (Simples, sem cobrança)`;
  }
  
  if (lastMessage.includes("ciúme") || lastMessage.includes("insegurança") || lastMessage.includes("desconfiança")) {
    return `Sinto muito que esteja se sentindo assim${userName ? `, ${userName}` : ""}. A insegurança é um gatilho comum, mas precisamos entender a raiz.

**Análise:** O ciúme geralmente vem de:
- Experiências passadas não resolvidas
- Baixa autoestima
- Falta de comunicação no relacionamento

**Plano de Ação:**
1. Reflita: Esse ciúme tem base em fatos ou suposições?
2. Comunique seus sentimentos sem acusações: "Eu me sinto inseguro quando..." em vez de "Você sempre..."
3. Trabalhe sua autoestima - o ciúme diminui quando nos sentimos seguros conosco

Lembre-se: confiança é construída com transparência, não vigilância.`;
  }
  
  if (lastMessage.includes("terminar") || lastMessage.includes("término") || lastMessage.includes("acabou")) {
    return `Entendo que está considerando terminar${userName ? `, ${userName}` : ""}. Essa é uma decisão importante que merece reflexão.

**Antes de decidir, pergunte-se:**
1. Já tentamos resolver os problemas juntos?
2. O que meu parceiro precisa que eu mude?
3. O que eu preciso que meu parceiro mude?
4. Estou considerando término por impulso ou reflexão genuína?

**Se decidir conversar:**
"${partnerName}, precisamos conversar sobre algo importante. Quando seria um bom momento?"

**Se decidir terminar:**
Faça pessoalmente, com respeito e clareza. Não desapareça (ghosting) e não termine por mensagem a menos que haja perigo.

Quer explorar alguma dessas opções mais a fundo?`;
  }
  
  // Default response
  return `Agradeço por compartilhar isso comigo${userName ? `, ${userName}` : ""}. Entendo que cada relacionamento tem suas particularidades, e situações como essa com ${partnerName} requerem análise cuidadosa.

**Análise:** Parece que você está lidando com uma dinâmica que envolve comunicação e expectativas não alinhadas.

**Plano de Ação:**
1. **Autoconhecimento primeiro:** O que essa situação desperta em você? Medo? Insegurança?
2. **Perspectiva do outro:** Tente ver a situação pelos olhos de ${partnerName}. O que ele/ela pode estar sentindo?
3. **Comunicação CNV:** Quando estiver calmo(a), expresse seus sentimentos usando "Eu" em vez de "Você"

**Script sugerido:** 
"Quando aconteceu X, eu me senti Y porque preciso de Z. Você poderia me ajudar a entender sua perspectiva?"

Quer que aprofundemos algum desses pontos?`;
}

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    const systemPrompt = buildSystemPrompt(context);

    // If no API configured, use mock responses
    if (!openai) {
      const mockContent = getMockResponse(messages, context);
      return new Response(
        JSON.stringify({
          role: "assistant",
          content: mockContent,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL_NAME || "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
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
    console.error("Chat API error:", error);
    // Fallback to mock even on error
    const { messages, context } = await req.json().catch(() => ({ messages: [], context: undefined }));
    const mockContent = getMockResponse(messages, context);
    return new Response(
      JSON.stringify({
        role: "assistant",
        content: mockContent,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
