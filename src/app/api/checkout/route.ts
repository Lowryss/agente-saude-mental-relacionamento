import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

const PLANS = {
  basic: {
    price: 499, // R$ 4,99 em centavos
    name: "Plano Básico - 5 Respostas",
    description:
      "Conselhos rápidos: Receba até 5 orientações detalhadas do Mentor IA.",
  },
  plus: {
    price: 990, // R$ 9,90 em centavos
    name: "Plano Plus - 15 Respostas",
    description:
      "Aprofunde a conversa: Receba até 15 orientações detalhadas do Mentor IA.",
  },
  premium: {
    price: 2990, // R$ 29,90 em centavos
    name: "Plano Premium - 50 Respostas",
    description:
      "Acompanhamento contínuo: Receba até 50 orientações detalhadas do Mentor IA.",
  },
};

export async function POST(req: Request) {
  try {
    // Tenta ler o corpo da requisição para ver qual plano foi escolhido
    const body = await req.json().catch(() => ({}));
    const tier = (body.tier as keyof typeof PLANS) || "premium";

    // Modo de teste - não requer Stripe
    if (body.testMode === true) {
      const mockUserId = `test_user_${Date.now()}`;
      const testCredits = 10; // Créditos gratuitos para teste

      return NextResponse.json({
        userId: mockUserId,
        credits: testCredits,
        tier: "test",
        message: "Modo de teste ativado - créditos gratuitos concedidos",
      });
    }

    const plan = PLANS[tier] || PLANS.premium;

    const headers = req.headers;
    const origin = headers.get("origin") || "http://localhost:3000";

    // Cria a sessão de checkout no Stripe com o plano selecionado
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/chat?payment=success&tier=${tier}`,
      cancel_url: `${origin}/?payment=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erro ao gerar checkout Stripe:", error);
    return NextResponse.json(
      {
        error: "Não foi possível iniciar o pagamento.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
