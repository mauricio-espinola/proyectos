import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const suit = searchParams.get('suit');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const where: any = { isActive: true };

    if (suit && suit !== 'all') {
      where.suit = suit;
    }

    if (type === 'major') {
      where.cardType = 'MAJOR_ARCANA';
    } else if (type === 'minor') {
      where.cardType = 'MINOR_ARCANA';
    }

    if (search) {
      where.name = {
        contains: search,
      };
    }

    const cards = await db.tarotCard.findMany({
      where,
      orderBy: { position: 'asc' },
    });

    // Transform JSON fields to arrays
    const transformedCards = cards.map(card => ({
      ...card,
      keywords: JSON.parse(JSON.stringify(card.keywords)) as string[],
      symbolism: JSON.parse(JSON.stringify(card.symbolism)) as string[],
      lessons: card.lessons ? JSON.parse(JSON.stringify(card.lessons)) as string[] : null,
      questions: card.questions ? JSON.parse(JSON.stringify(card.questions)) as string[] : null,
      symbols: card.symbols ? JSON.parse(JSON.stringify(card.symbols)) as Record<string, string> : null,
      examples: card.examples ? JSON.parse(JSON.stringify(card.examples)) as string[] : null,
    }));

    return NextResponse.json({ cards: transformedCards });
  } catch (error) {
    console.error('Get cards error:', error);
    return NextResponse.json(
      { error: 'Error al obtener cartas' },
      { status: 500 }
    );
  }
}
