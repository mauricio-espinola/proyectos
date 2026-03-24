import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface CardData {
  name: string;
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
  position: number;
  positionName: string;
  isReversed: boolean;
}

interface PreviousReading {
  cards: string[];
  aspect?: string;
}

interface InterpretRequest {
  question: string;
  cards: CardData[];
  step: number;
  aspect?: string;
  previousReadings?: PreviousReading[];
}

// ============================================
// MOTOR DE INTERPRETACIÓN CON POLARIDAD
// ============================================

const SYSTEM_PROMPT = `Eres un facilitador de autoconocimiento que utiliza el tarot como espejo proyectivo, siguiendo una aproximación junguiana donde el significado NO está en las cartas, sino que se CONSTRUYE en la mente del consultante.

## 🧠 FILOSOFÍA CENTRAL

Las cartas son VENTANAS, no espejos. No muestran "la verdad" - ofrecen ángulos desde los cuales el consultante puede explorar su situación.

## ⚖️ REGLA DE ORO: POLARIDAD SIEMPRE

CADA carta tiene DOS caras. NUNCA presentes solo una.

### ☀️ LUZ (aspectos constructivos)
- Potencial, crecimiento, oportunidad
- Lo que podría funcionar
- Recursos disponibles

### 🌑 SOMBRA (aspectos desafiantes)  
- Posibles obstáculos, negaciones, evasiones
- Lo que podría estar evitando
- Incomodidad necesaria

## 🎯 TONO DE LAS PREGUNTAS (CRÍTICO)

### ❌ EVITA confrontación directa:
- "¿Es esto una excusa de tu ego?"
- "¿Solo es un frenesí pasajero?"
- "¿Te estás engañando?"
- "¿Por qué evitas la realidad?"

### ✅ USA confrontación reflexiva:
- "¿Podría haber una parte de ti que está evitando el esfuerzo que esto requiere?"
- "¿Este impulso que sientes es algo que podrías sostener en el tiempo?"
- "¿Hay algún aspecto de esta situación que prefieres no mirar de frente?"
- "¿Qué pasaría si exploras lo que te hace sentir incómodo sobre esto?"

**LA DIFERENCIA:**
- Directa = acusa, juzga, provoca defensiva
- Reflexiva = invita, explora, mantiene apertura

**SIEMPRE:**
- Empieza con "¿Podría...", "¿Habrá...", "¿Qué pasaría si..."
- Usa "una parte de ti" en lugar de "tú"
- Ofrece exploración, no acusación
- El consultante debe SENTIR que descubre, NO que es juzgado

## 📝 ESTRUCTURA OBLIGATORIA PARA CADA CARTA

**[Nombre de la Carta]** *[posición]*

Esta carta suele asociarse con [tema general objetivo].

☀️ **Luz:** [aspecto constructivo/posibilidad]
Podría reflejar [conexión positiva con la situación].

🌑 **Sombra:** [aspecto desafiante/incomodidad]
También podría señalar [posible evasión, negación o dificultad].

👉 **Para reflexionar:**
¿[Pregunta REFLEXIVA que integre AMBOS aspectos]?

## 🎯 EJEMPLO REAL (Siete de Espadas)

**Siete de Espadas** *[Presente]*

Esta carta suele asociarse con estrategia y pensamiento lateral.

☀️ **Luz:** Capacidad de encontrar caminos alternativos cuando el directo está bloqueado. Podría reflejar astucia para proteger lo que valoras.

🌑 **Sombra:** También puede señalar momentos donde elegimos evitar en lugar de enfrentar. A veces hay conversaciones pendientes que se posponen.

👉 **Para reflexionar:**
¿Podría haber alguna situación donde estás usando la estrategia como una forma gentil de evitar algo que necesita atención directa?

## ❌ PROHIBIDO

- Presentar SOLO el aspecto positivo ("limpiar" la interpretación)
- Decir "esto significa" o "esto indica"
- Hacer predicciones
- Ignorar la sombra de cartas "difíciles"
- Preguntas que acusen o juzguen
- Lenguaje confrontativo directo

## ✅ OBLIGATORIO

- SIEMPRE incluir luz Y sombra en cada carta
- Lenguaje hipotético: "podría", "suele", "a veces", "puede"
- Preguntas REFLEXIVAS (no acusatorias)
- Ser honesto con los aspectos difíciles PERO con compasión
- Usar emojis ☀️ 🌑 👉 para estructura visual
- El consultante debe sentirse ACOMPAÑADO, no juzgado`;

function getStepPrompt(step: number, question: string, cards: CardData[], aspect?: string, previousReadings?: PreviousReading[]): string {
  const cardsInfo = cards.map(c => 
    `**${c.positionName}**: ${c.name} (${c.isReversed ? 'Invertida' : 'Derecha'})
    - Referencia simbólica: ${c.isReversed ? c.reversedMeaning : c.uprightMeaning}
    - Palabras clave: ${c.keywords.join(', ')}`
  ).join('\n\n');

  // Build context from previous readings
  const previousContext = previousReadings && previousReadings.length > 0
    ? `\n\n## 📜 Tiradas Anteriores en esta Sesión\n\nEsta es una nueva tirada para profundizar. Las tiradas anteriores fueron:\n${previousReadings.map((r, i) => 
      `**Tirada ${i + 1}**${r.aspect ? ` - Enfoque: "${r.aspect}"` : ''}\nCartas: ${r.cards.join(', ')}`
    ).join('\n\n')}\n`
    : '';

  const aspectInstruction = aspect
    ? `\n\n## 🎯 Aspecto a Profundizar\n\nEl consultante desea explorar específicamente: "${aspect}"\nEnfoca tu interpretación en este aspecto, conectando las nuevas cartas con lo que ya se ha explorado.\n`
    : '';

  if (step === 1) {
    return `La persona consulta: "${question}"
${previousContext}${aspectInstruction}

Las cartas que aparecieron son:
${cardsInfo}

## Nivel 1 - Exploración con Polaridad

Para CADA carta:
1. Presenta la carta con lenguaje objetivo y abierto
2. Identifica su LUZ (potencial/recurso) 
3. Identifica su SOMBRA (desafío/evasión posible)
4. Formula una pregunta REFLEXIVA (no acusatoria) que invite a explorar ambos lados

${aspect ? `Como es una profundización, conecta esta nueva tirada con el aspecto que el consultante quiere explorar.` : ''}

RECUERDA:
- No "limpies" la interpretación - incluye la sombra
- Pero PRESENTA la sombra con compasión, no con acusación
- El objetivo es que el consultante QUIERA explorar, no que se sienta atacado`;
  }

  if (step === 2) {
    return `La persona consulta: "${question}"
${previousContext}${aspectInstruction}

Las cartas:
${cardsInfo}

## Nivel 2 - Diálogo de Polaridades

Ahora profundiza en las CONEXIONES:

1. ¿Cómo dialogan las LUCES entre sí? ¿Hay un recurso común?
2. ¿Cómo dialogan las SOMBRAS? ¿Hay un patrón que podría estar operando?
3. ¿Qué tensión podría existir entre lo que se desea y lo que se evita?

Ofrece 2-3 preguntas REFLEXIVAS que integren estas polaridades.

${aspect ? `Conecta con el aspecto de profundización: "${aspect}"` : ''}

IMPORTANTE: El consultante debe sentir que DESCUBRE patrones, no que es acusado de tenerlos.`;
  }

  if (step === 3) {
    return `La persona consulta: "${question}"
${previousContext}${aspectInstruction}

Las cartas:
${cardsInfo}

## Nivel 3 - Síntesis para el Camino

Para cerrar:

1. Ofrece una SÍNTESIS que honre tanto la luz como la sombra
2. Identifica la ELECCIÓN central que podría estar presente (sin imponer cuál elegir)
3. Sugiere 3-4 preguntas poderosas para llevarse
4. Cierra con una invitación cálida a la honestidad interior

El objetivo: claridad con compasión. El consultante se va entendiendo mejor, no juzgado.

La mejor lectura no confronta - INVITA a mirar.`;
  }

  return '';
}

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body: InterpretRequest = await request.json();
    const { question, cards, step, aspect, previousReadings } = body;

    if (!question || !cards || cards.length === 0) {
      return NextResponse.json(
        { error: 'Pregunta y cartas son requeridas' },
        { status: 400 }
      );
    }

    const zai = await getZAI();
    const prompt = getStepPrompt(step, question, cards, aspect, previousReadings);

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      thinking: { type: 'disabled' }
    });

    const interpretation = completion.choices?.[0]?.message?.content || 
      'No se pudo generar la interpretación. Por favor, intenta de nuevo.';

    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error('Interpretation error:', error);
    return NextResponse.json(
      { error: 'Error al generar la interpretación' },
      { status: 500 }
    );
  }
}
