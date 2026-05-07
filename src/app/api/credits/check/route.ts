import { NextResponse } from "next/server";

// Armazena créditos em memória para usuários de teste
const testUserCredits: Record<string, number> = {};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId obrigatório" },
        { status: 400 }
      );
    }

    // Se é usuário de teste, inicializa com 10 créditos se não existir
    if (userId.startsWith("test_user_")) {
      if (!(userId in testUserCredits)) {
        testUserCredits[userId] = 10;
      }
      return NextResponse.json({
        userId: userId,
        credits: testUserCredits[userId],
        tier: "test",
      });
    }

    // Mock para usuários normais
    return NextResponse.json({
      userId: userId,
      credits: 50,
      tier: "premium",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
