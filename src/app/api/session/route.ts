import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    
    // Mock para teste - simula um pagamento bem-sucedido
    const mockUserId = `user_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      userId: mockUserId,
      credits: 50,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
