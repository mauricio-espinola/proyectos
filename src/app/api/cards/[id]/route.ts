import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const card = await db.tarotCard.findUnique({
      where: { id }
    });

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const parsedCard = {
      ...card,
      keywords: JSON.parse(card.keywords as string),
      symbolism: JSON.parse(card.symbolism as string),
      lessons: card.lessons ? JSON.parse(card.lessons as string) : null,
      questions: card.questions ? JSON.parse(card.questions as string) : null,
      symbols: card.symbols ? JSON.parse(card.symbols as string) : null,
      examples: card.examples ? JSON.parse(card.examples as string) : null,
      combinations: card.combinations ? JSON.parse(card.combinations as string) : null
    };

    return NextResponse.json({ card: parsedCard });
  } catch (error) {
    console.error('Get card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
