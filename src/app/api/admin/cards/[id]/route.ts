import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('session-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = await db.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Build update data
    const updateData: Record<string, unknown> = {};
    
    const allowedFields = [
      'name', 'description', 'uprightMeaning', 'reversedMeaning',
      'loveMeaning', 'careerMeaning', 'spiritualMeaning', 'story',
      'keywords', 'symbolism', 'lessons', 'questions', 'symbols', 
      'examples', 'combinations', 'imageUrl'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // JSON fields need to be stringified
        if (['keywords', 'symbolism', 'lessons', 'questions', 'symbols', 'examples', 'combinations'].includes(field)) {
          updateData[field] = JSON.stringify(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedCard = await db.tarotCard.update({
      where: { id },
      data: updateData
    });

    // Create audit log
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE_CARD',
        entityType: 'TarotCard',
        entityId: id,
        newValue: updateData
      }
    });

    return NextResponse.json({ 
      card: {
        ...updatedCard,
        keywords: JSON.parse(updatedCard.keywords as string),
        symbolism: JSON.parse(updatedCard.symbolism as string)
      }
    });
  } catch (error) {
    console.error('Update card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('session-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = await db.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

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

    return NextResponse.json({
      card: {
        ...card,
        keywords: JSON.parse(card.keywords as string),
        symbolism: JSON.parse(card.symbolism as string),
        lessons: card.lessons ? JSON.parse(card.lessons as string) : null,
        questions: card.questions ? JSON.parse(card.questions as string) : null,
        symbols: card.symbols ? JSON.parse(card.symbols as string) : null,
        examples: card.examples ? JSON.parse(card.examples as string) : null,
        combinations: card.combinations ? JSON.parse(card.combinations as string) : null
      }
    });
  } catch (error) {
    console.error('Get card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
