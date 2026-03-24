import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET - Get user's reading history
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const session = await db.session.findUnique({
      where: { token },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Sesión expirada' },
        { status: 401 }
      );
    }

    const readings = await db.spreadSession.findMany({
      where: { userId: session.userId },
      include: {
        question: true,
        cardResults: {
          include: {
            card: true,
          },
        },
        interpretations: true,
      },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ readings });
  } catch (error) {
    console.error('Get readings error:', error);
    return NextResponse.json(
      { error: 'Error al obtener lecturas' },
      { status: 500 }
    );
  }
}

// POST - Save a new reading (supports multiple draws)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const session = await db.session.findUnique({
      where: { token },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Sesión expirada' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { question, category, cards, interpretations, allDraws } = body;

    // Create question
    const userQuestion = await db.userQuestion.create({
      data: {
        userId: session.userId,
        question,
        category: category || null,
      },
    });

    // Calculate total steps based on number of draws
    const totalDraws = allDraws?.length || 1;
    const totalInterpretations = allDraws?.reduce((acc: number, d: any) => acc + 1, 0) || interpretations?.length || 1;

    // Create spread session
    const spreadSession = await db.spreadSession.create({
      data: {
        id: uuidv4(),
        userId: session.userId,
        questionId: userQuestion.id,
        spreadType: 'THREE_CARD',
        totalSteps: totalInterpretations,
        currentStep: totalInterpretations,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // If we have allDraws, save each draw separately
    if (allDraws && allDraws.length > 0) {
      for (let drawIndex = 0; drawIndex < allDraws.length; drawIndex++) {
        const draw = allDraws[drawIndex];
        const drawStep = drawIndex + 1;
        
        // Create card results for this draw
        for (const cardData of draw.cards) {
          await db.spreadCardResult.create({
            data: {
              sessionId: spreadSession.id,
              cardId: cardData.card.id,
              position: cardData.position,
              positionName: cardData.positionName,
              isReversed: cardData.isReversed,
              step: drawStep,
            },
          });
        }
        
        // Create interpretation for this draw
        if (draw.interpretation) {
          await db.interpretation.create({
            data: {
              sessionId: spreadSession.id,
              step: drawStep,
              content: draw.interpretation,
              focus: draw.aspect || `Tirada ${drawStep}`,
            },
          });
        }
      }
    } else {
      // Fallback: save single draw (backward compatibility)
      for (const cardData of cards) {
        await db.spreadCardResult.create({
          data: {
            sessionId: spreadSession.id,
            cardId: cardData.card.id,
            position: cardData.position,
            positionName: cardData.positionName,
            isReversed: cardData.isReversed,
            step: 1,
          },
        });
      }

      for (let i = 0; i < (interpretations?.length || 0); i++) {
        await db.interpretation.create({
          data: {
            sessionId: spreadSession.id,
            step: i + 1,
            content: interpretations[i],
            focus: i === 0 ? 'Individual' : i === 1 ? 'Relacional' : 'Síntesis',
          },
        });
      }
    }

    // Update user stats
    await db.user.update({
      where: { id: session.userId },
      data: {
        readingsDone: { increment: 1 },
        experience: { increment: 10 * totalDraws },
      },
    });

    return NextResponse.json({ 
      success: true, 
      readingId: spreadSession.id 
    });
  } catch (error) {
    console.error('Save reading error:', error);
    return NextResponse.json(
      { error: 'Error al guardar lectura' },
      { status: 500 }
    );
  }
}
