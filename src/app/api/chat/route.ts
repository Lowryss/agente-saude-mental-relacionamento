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
  photos?: string[];
}

// Prompts integrados (para edge runtime sem acesso ao filesystem)
const SYSTEM_PROMPT = `# Sistema do Mentor de Relacionamentos

## Identidade
Você é um assistente de apoio emocional e análise de relacionamento.

## Objetivo
- Ajudar o usuário a entender a situação com clareza.
- Reduzir ansiedade.
- Evitar ações impulsivas.
- Ajudar o usuário a manter dignidade, limites e autocontrole.
- Diferenciar interesse real, carência, conveniência e desinteresse.
- Dar respostas práticas, diretas e aplicáveis.

## Limites Éticos
Você NÃO é terapeuta clínico.
Você NÃO diagnostica transtornos.
Você NÃO incentiva manipulação emocional.
Você NÃO ensina jogos tóxicos.
Você NÃO reforça dependência emocional.

## Prioridade de Resposta
1. Segurança emocional do usuário.
2. Clareza factual.
3. Limites saudáveis.
4. Ação prática.
5. Respeito pela outra pessoa.`;

const PERSONALITY_PROMPT = `# Personalidade do Mentor

## Tom de Voz
- Direto.
- Firme.
- Humano.
- Sem romantizar.
- Sem motivação vazia.
- Com linguagem simples e forte.

## Estilo de Resposta
- Markdown.
- Títulos claros.
- Diagnóstico objetivo.
- Separar fato de interpretação.
- Usar frases curtas.
- Dar próximos passos.

## Proibido Responder
- "faz o que seu coração mandar"
- "talvez ela só esteja ocupada"
- "manda mais uma mensagem"
- "luta por ela"

## Obrigatório Incluir
- Leitura objetiva
- Riscos
- Melhor ação
- O que não fazer
- Próxima ação`;

const FRAMEWORK_PROMPT = `# Framework de Análise

## 1. Fato vs Interpretação
Sempre separar:
- **Fato**: o que aconteceu.
- **Interpretação**: o que o usuário está imaginando.
- **Ação recomendada**: o que fazer com base nos fatos.

## 2. Interesse Real vs Carência vs Conveniência
**Interesse Real:** Iniciativa, consistência, esforço equilibrado.
**Carência:** Procura quando está mal, some quando melhora.
**Conveniência:** Aceita favores, pouca reciprocidade.

## 3. Baixa Atração
Sinais: evita carinho, não beija, fica no celular.

## 4. Regra Central
**Nunca aumentar investimento quando o retorno está baixo.**`;

const DECISION_PROMPT = `# Regras de Decisão

## Ansiedade
NÃO recomendar mensagem longa nem conversa séria imediata.
Recomendar: pausa, respiração, atividade física.

## Pessoa Fria
Reduzir investimento. Não perseguir. Observar.

## Textão
Reduzir para 1 frase firme. Remover justificativas.

## Padrão de Sofrimento
Recomendar afastamento claro. Proteger usuário.

## Interesse Real
Responder leve. Manter reciprocidade.`;

const RESPONSE_STYLE_PROMPT = `# Formato de Resposta

## Estrutura Obrigatória

### 📊 Leitura objetiva
Explique os fatos.

### 🧠 O que isso significa
Explique a dinâmica emocional.

### ⚠️ Risco
Mostre o erro provável.

### 🧭 O que fazer agora
Dê ação clara.

### 💬 Se precisar responder
Dê uma frase pronta.

### 🔒 Regra de ouro
Uma frase memorável.

### Próxima ação
Uma linha prática.`;

const MESSAGE_COACH_PROMPT = `# Coach de Mensagens

## Regras
- Curta (máximo 2 linhas)
- Sem cobrança
- Sem carência
- Sem explicar demais

## Exemplos Bons
- "vou ser sincero, isso não tá me fazendo bem. prefiro me afastar"
- "e aí, ficou bem depois de hoje?"
- "bom dia 😄 tudo certo?"
- "acho melhor não hoje… tô precisando de um tempo"`;

function buildSystemPrompt(context?: ChatContext): string {
  // Combina todos os prompts do sistema
  let prompt = `${SYSTEM_PROMPT}\n\n${PERSONALITY_PROMPT}\n\n${FRAMEWORK_PROMPT}\n\n${DECISION_PROMPT}\n\n${RESPONSE_STYLE_PROMPT}\n\n${MESSAGE_COACH_PROMPT}`;

  // Adiciona contexto personalizado
  if (context) {
    prompt += `\n\n## Contexto do Usuário\n`;
    if (context.userName) prompt += `- Nome: ${context.userName}\n`;
    if (context.partnerName) prompt += `- Pessoa: ${context.partnerName}\n`;
    if (context.relationshipType) prompt += `- Relacionamento: ${context.relationshipType}\n`;
    if (context.situation) prompt += `- Situação: ${context.situation}\n`;
    if (context.desiredOutcome) prompt += `- Objetivo: ${context.desiredOutcome}\n`;
    if (context.feelings) prompt += `- Sentimento: ${context.feelings}\n`;
    if (context.photos && context.photos.length > 0) {
      prompt += `- Fotos: ${context.photos.length} foto(s) anexada(s)\n`;
    }
  }

  return prompt;
}

// Mock responses when API is not available
function getMockResponse(messages: any[], context?: ChatContext): string {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
  const userName = context?.userName || "";
  const partnerName = context?.partnerName || "a pessoa";
  
  // Saudação personalizada
  if (lastMessage.includes("oi") || lastMessage.includes("olá") || lastMessage.includes("hello") || messages.length <= 2) {
    return `### 📊 Leitura objetiva
Você está começando uma conversa${userName ? `, ${userName}` : ""}. Estou aqui para ajudar a navegar a situação com ${partnerName}.

### 🧠 O que isso significa
Você busca clareza sobre uma dinâmica emocional. Isso já é um passo importante.

### ⚠️ Risco
Agir por impulso antes de entender os fatos reais.

### 🧭 O que fazer agora
Descreva brevemente a situação. O que aconteceu exatamente?

### 💬 Se precisar responder
"Oi, tudo bem? Como foi seu dia?"

### 🔒 Regra de ouro
**Fatos primeiro, interpretação depois.**

### Próxima ação
Me conte o que aconteceu na última interação com ${partnerName}.`;
  }
  
  // Não responde / silêncio
  if (lastMessage.includes("não responde") || lastMessage.includes("ignorou") || lastMessage.includes("silêncio") || lastMessage.includes("visualizou")) {
    return `### 📊 Leitura objetiva
${partnerName} visualizou e não respondeu. Tempo decorrido: algumas horas.

### 🧠 O que isso significa
Você está externalizando sua segurança emocional na resposta de ${partnerName}. Ansiedade de abandono ativada.

### ⚠️ Risco
Mandar mensagem no calor, parecer cobrança, reforçar desequilíbrio.

### 🧭 O que fazer agora
1. Respire fundo 3 vezes
2. Não mande mais nada hoje
3. Faça outra atividade (banho, caminhada, trabalho)

### 💬 Se precisar responder (depois de 24h)
"Oi ${partnerName}, tudo bem? Só queria saber como foi seu dia."

### 🔒 Regra de ouro
**Silêncio raramente é sobre você. Pode ser rotina, sono, trabalho.**

### Próxima ação
Desligue as notificações de ${partnerName} por 24 horas. Observe como se sente.`;
  }
  
  // Ciúme / Insegurança
  if (lastMessage.includes("ciúme") || lastMessage.includes("insegurança") || lastMessage.includes("desconfiança")) {
    return `### 📊 Leitura objetiva
Você sente ciúme/insegurança em relação a ${partnerName}.

### 🧠 O que isso significa
O ciúme geralmente vem de: experiências passadas não resolvidas, baixa autoestima, ou falta de comunicação.

### ⚠️ Risco
Vigilância, cobrança, acusações sem fundamento. Isso afasta.

### 🧭 O que fazer agora
1. Pergunte-se: "Isso tem base em FATOS ou suposições?"
2. Liste 3 fatos concretos vs 3 interpretações suas
3. Trabalhe sua autoestima (isso resolve mais que controlar o outro)

### 💬 Se precisar falar sobre isso
"Quando acontece X, eu me sinto inseguro. Não é sobre você, é algo meu que estou trabalhando."

### 🔒 Regra de ouro
**Confiança é construída com transparência, não vigilância.**

### Próxima ação
Antes de questionar ${partnerName}, regule sua emoção sozinho primeiro.`;
  }
  
  // Terminar / Término
  if (lastMessage.includes("terminar") || lastMessage.includes("término") || lastMessage.includes("acabou") || lastMessage.includes("cabo")) {
    return `### 📊 Leitura objetiva
Você está considerando terminar com ${partnerName}.

### 🧠 O que isso significa
Decisão de peso. Pode ser impulso emocional ou reflexão genuína.

### ⚠️ Risco
Terminar no calor e arrepender depois. Ou ficar em sofrimento prolongado.

### 🧭 O que fazer agora
Pergunte-se:
1. Já tentamos resolver juntos?
2. É situação ou caráter da pessoa?
3. Estou triste com ele/ela ou comigo mesmo?

### 💬 Se decidir conversar
"${partnerName}, precisamos conversar sobre algo importante. Quando seria um bom momento para você?"

### 💬 Se decidir terminar
"Vou ser sinciro contigo: isso não tá me fazendo bem e não faz mais sentido pra mim. Prefiro me afastar."

### 🔒 Regra de ouro
**Terminar é válido. Ficar sofrendo também é uma escolha.**

### Próxima ação
Não tome decisão hoje. Durma. Decida amanhã de manhã.`;
  }
  
  // Carência / Conforto
  if (lastMessage.includes("só me procura") || lastMessage.includes("quando precisa") || lastMessage.includes("conveniência")) {
    return `### 📊 Leitura objetiva
${partnerName} te procura em momentos específicos (crise, necessidade), não espontaneamente.

### 🧠 O que isso significa
**Isso é carência, não interesse real.** Você é apoio emocional, não escolha.

### ⚠️ Risco
Você virar terapeuta gratuito. Investir mais e receber migalhas.

### 🧭 O que fazer agora
1. Pare de responder imediatamente
2. Reduza disponibilidade emocional
3. Observe: ele/ela some quando está bem?

### 💬 Se precisar estabelecer limite
"Entendo que você tá passando por isso, mas não tô em posição de ajudar agora."

### 🔒 Regra de ouro
**Quem te procura só na crise, te usa, não te escolhe.**

### Próxima ação
Próxima vez que ${partnerName} procurar na crise: espere 4h antes de responder. Veja o que acontece.`;
  }
  
  // Default response
  return `### 📊 Leitura objetiva
Você descreveu uma situação com ${partnerName} que envolve comunicação e expectativas.

### 🧠 O que isso significa
Há um desalinhamento entre o que você espera e o que recebe. Isso gera ansiedade.

### ⚠️ Risco
Agir por impulso, mandar textão emocional, reforçar dinâmica desfavorável.

### 🧭 O que fazer agora
1. **Fato vs Interpretação**: O que de fato aconteceu vs o que você imaginou?
2. **Regule primeiro**: Não decida no pico emocional
3. **Perspectiva**: O que ${partnerName} pode estar sentindo?

### 💬 Se precisar responder
"Quando aconteceu X, eu me senti Y porque preciso de Z. Você pode me ajudar a entender sua perspectiva?"

### 🔒 Regra de ouro
**Nunca aumente investimento quando retorno está baixo.**

### Próxima ação
Descreva os FATOS (não interpretações) dos últimos 3 encontros com ${partnerName}.`;
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
