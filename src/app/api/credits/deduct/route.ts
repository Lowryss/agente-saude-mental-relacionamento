import { NextResponse } from "next/server";

// Armazena créditos em memória para usuários de teste (compartilhado com check)
const testUserCredits: Record<string, number> = {};

export async function POST(req: Request) {
  try {
    const { userId, amount = 1 } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId obrigatório" },
        { status: 400 }
      );
    }

    // Para usuários de teste, gerenciar créditos em memória
    if (userId.startsWith("test_user_")) {
      // Inicializa se não existir
      if (!(userId in testUserCredits)) {
        testUserCredits[userId] = 10;
      }

      // Verifica se tem créditos suficientes
      if (testUserCredits[userId] < amount) {
        return NextResponse.json(
          { error: "Créditos insuficientes" },
          { status: 402 }
        );
      }

      // Deduz créditos
      testUserCredits[userId] -= amount;

      return NextResponse.json({
        success: true,
        remainingCredits: testUserCredits[userId],
      });
    }

    // Mock para usuários normais - sempre retorna créditos suficientes
    return NextResponse.json({
      success: true,
      remainingCredits: 50,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
