import { NextResponse } from "next/server";

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

    // Mock para teste
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
