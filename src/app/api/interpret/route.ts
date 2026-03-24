import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';
import { 
  generateInterpretation, 
  formatInterpretationAsMarkdown,
  TarotCardV2,
  Position,
  SpreadDefinition,
  InterpretationContext,
  DrawnCard
} from '@/lib/interpretation-engine';

// ============================================
// SPREAD DEFINITIONS (from JSON v2)
// ============================================

const spreadDefinitions: Record<string, SpreadDefinition> = {
  three_card_guided: {
    name: 'Tirada guiada de 3 cartas',
    positions: [
      { key: 'situacion_actual', label: 'Situación actual', intent: 'describir el estado de la energía' },
      { key: 'bloqueo', label: 'Bloqueo o desafío', intent: 'mostrar la fricción o patrón limitante' },
      { key: 'consejo', label: 'Consejo o dirección', intent: 'señalar el ajuste más útil' },
    ],
  },
  past_present_future: {
    name: 'Pasado, presente y futuro',
    positions: [
      { key: 'pasado', label: 'Pasado', intent: 'ubicar el origen o antecedente' },
      { key: 'presente', label: 'Presente', intent: 'ver la energía dominante actual' },
      { key: 'futuro', label: 'Futuro', intent: 'leer la tendencia si no cambia el patrón' },
    ],
  },
};

// Position names mapping for backwards compatibility
const positionNamesMap: Record<string, string> = {
  'Past': 'pasado',
  'Present': 'presente',
  'Future': 'futuro',
  'Pasado / Origen': 'pasado',
  'Presente / Situación': 'presente',
  'Futuro / Consejo': 'futuro',
  'Situación actual': 'situacion_actual',
  'Bloqueo': 'bloqueo',
  'Consejo': 'consejo',
};

// ============================================
// AI INTERPRETATION (fallback/enhancement)
// ============================================

const SYSTEM_PROMPT = `Eres un facilitador de autoconocimiento que utiliza el tarot como espejo proyectivo, siguiendo una aproximación junguiana.

## 🧠 FILOSOFÍA CENTRAL
Las cartas son VENTANAS, no espejos. No muestran "la verdad" - ofrecen ángulos desde los cuales el consultante puede explorar su situación.

## ⚖️ REGLA DE ORO: POLARIDAD SIEMPRE
CADA carta tiene DOS caras. NUNCA presentes solo una.
☀️ LUZ (aspectos constructivos)
🌑 SOMBRA (aspectos desafiantes)

## 📝 ESTRUCTURA OBLIGATORIA PARA CADA CARTA
**[Nombre de la Carta]** *[posición]*
Esta carta suele asociarse con [tema general].
☀️ **Luz:** [aspecto constructivo]
🌑 **Sombra:** [aspecto desafiante]
👉 **Para reflexionar:** ¿[Pregunta reflexiva]?`;

function getStepPrompt(step: number, question: string, cards: any[], aspect?: string, previousReadings?: any[]): string {
  const cardsInfo = cards.map(c => 
    `**${c.positionName}**: ${c.name} (${c.isReversed ? 'Invertida' : 'Derecha'})
    - ${c.isReversed ? c.reversedMeaning : c.uprightMeaning}`
  ).join('\n\n');

  const previousContext = previousReadings && previousReadings.length > 0
    ? `\n\n## 📜 Tiradas Anteriores\n${previousReadings.map((r, i) => 
        `**Tirada ${i + 1}**: ${r.cards.join(', ')}`
      ).join('\n\n')}\n`
    : '';

  return `La persona consulta: "${question}"
${previousContext}

Las cartas:
${cardsInfo}

## Nivel ${step} - Interpretación

Para CADA carta:
1. Presenta la carta con lenguaje objetivo
2. Identifica su LUZ (potencial)
3. Identifica su SOMBRA (desafío)
4. Formula una pregunta REFLEXIVA`;
}

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// ============================================
// MAIN API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      question, 
      cards, 
      step, 
      aspect, 
      previousReadings,
      useAI = true,
      spreadType = 'past_present_future',
      category = 'general'
    } = body;

    if (!question || !cards || cards.length === 0) {
      return NextResponse.json(
        { error: 'Pregunta y cartas son requeridas' },
        { status: 400 }
      );
    }

    // Get spread definition
    const spreadDef = spreadDefinitions[spreadType] || spreadDefinitions.past_present_future;

    // Convert cards to TarotCardV2 format with position info
    const drawnCards: DrawnCard[] = await Promise.all(cards.map(async (c: any, index: number) => {
      // Get full card data from database
      const dbCard = await db.tarotCard.findFirst({
        where: { name: c.name }
      });

      // Map position name to position key
      const positionKey = positionNamesMap[c.positionName] || spreadDef.positions[index]?.key || 'presente';
      const position = spreadDef.positions.find(p => p.key === positionKey) || {
        key: positionKey,
        label: c.positionName,
        intent: '',
      };

      // Convert database card to TarotCardV2 format
      const cardV2: TarotCardV2 = {
        id: dbCard?.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
        slug: dbCard?.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
        name: c.name,
        arcanaType: dbCard?.cardType === 'MAJOR_ARCANA' ? 'major' : 'minor',
        suit: dbCard?.suit,
        element: dbCard?.element,
        number: dbCard?.number || undefined,
        keywords: (dbCard?.keywords as string[]) || c.keywords || [],
        coreMeaning: dbCard?.coreMeaning || '',
        description: dbCard?.description || '',
        uprightMeaning: dbCard?.uprightMeaning || c.uprightMeaning,
        reversed: dbCard?.reversed as any || { meaning: c.reversedMeaning },
        positionMeanings: dbCard?.positionMeanings as any,
        practicalInterpretation: dbCard?.practicalInterpretation as any,
        contexts: dbCard?.contexts as any,
        learningContent: dbCard?.learningContent as any,
        interpretationRules: dbCard?.interpretationRules as any,
        lessons: (dbCard?.lessons as string[]) || [],
        questions: (dbCard?.questions as string[]) || [],
      };

      return {
        card: cardV2,
        position,
        isReversed: c.isReversed,
      };
    }));

    // Determine category from question context
    const contextCategory = determineCategory(question, category);

    // Try AI interpretation first (if enabled)
    if (useAI) {
      try {
        const zai = await getZAI();
        const prompt = getStepPrompt(step || 1, question, cards, aspect, previousReadings);

        const completion = await zai.chat.completions.create({
          messages: [
            { role: 'assistant', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ],
          thinking: { type: 'disabled' }
        });

        const aiInterpretation = completion.choices?.[0]?.message?.content;
        
        if (aiInterpretation) {
          return NextResponse.json({ 
            interpretation: aiInterpretation,
            source: 'ai',
            hasPositionData: drawnCards.some(dc => dc.card.positionMeanings),
          });
        }
      } catch (aiError: any) {
        console.log('AI interpretation failed, falling back to structured engine:', aiError.message);
      }
    }

    // Fallback: Use structured interpretation engine
    const context: InterpretationContext = {
      question,
      category: contextCategory as any,
    };

    const result = generateInterpretation(drawnCards, context, spreadDef);
    const interpretation = formatInterpretationAsMarkdown(result);

    return NextResponse.json({ 
      interpretation,
      source: 'structured',
      hasPositionData: true,
      overallEnergy: result.overallEnergy,
      reflectionQuestions: result.reflectionQuestions,
    });

  } catch (error) {
    console.error('Interpretation error:', error);
    return NextResponse.json(
      { error: 'Error al generar la interpretación' },
      { status: 500 }
    );
  }
}

// ============================================
// HELPERS
// ============================================

function determineCategory(question: string, explicitCategory: string): string {
  if (explicitCategory && explicitCategory !== 'general') {
    return explicitCategory;
  }

  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('amor') || lowerQuestion.includes('pareja') || lowerQuestion.includes('relación') || lowerQuestion.includes('corazón')) {
    return 'love';
  }
  if (lowerQuestion.includes('trabajo') || lowerQuestion.includes('carrera') || lowerQuestion.includes('empleo') || lowerQuestion.includes('dinero') || lowerQuestion.includes('negocio')) {
    return 'career';
  }
  if (lowerQuestion.includes('espiritual') || lowerQuestion.includes('alma') || lowerQuestion.includes('propósito') || lowerQuestion.includes('camino')) {
    return 'spiritual';
  }
  if (lowerQuestion.includes('proyecto') || lowerQuestion.includes('emprender') || lowerQuestion.includes('crear')) {
    return 'project';
  }
  if (lowerQuestion.includes('decidir') || lowerQuestion.includes('elección') || lowerQuestion.includes('decisión')) {
    return 'decisionMaking';
  }
  
  return 'general';
}
