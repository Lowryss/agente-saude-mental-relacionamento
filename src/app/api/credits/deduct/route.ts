import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, amount = 1 } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId obrigatório" },
        { status: 400 }
      );
    }

    // Mock para teste - simula dedução de crédito
    return NextResponse.json({
      success: true,
      remainingCredits: 49,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
