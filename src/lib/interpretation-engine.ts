// ============================================
// INTERPRETATION ENGINE V2
// Motor de interpretación de tarot sin IA
// Usa la estructura enriquecida del JSON v2
// ============================================

export interface TarotCardV2 {
  id: string;
  slug: string;
  name: string;
  arcanaType: 'major' | 'minor';
  suit?: string;
  element?: string;
  number?: number;
  rank?: string;
  keywords: string[];
  coreMeaning: string;
  description: string;
  uprightMeaning: string;
  reversed?: {
    meaning: string;
    warning?: string;
    advice?: string;
    commonManifestations?: string[];
  };
  positionMeanings?: {
    situacion_actual?: string;
    bloqueo?: string;
    consejo?: string;
    resultado?: string;
    pasado?: string;
    presente?: string;
    futuro?: string;
  };
  practicalInterpretation?: {
    core: string;
    shadow: string;
    advice: string;
    warning: string;
  };
  contexts?: {
    general?: string;
    love?: string;
    career?: string;
    spiritual?: string;
    project?: string;
    selfKnowledge?: string;
    decisionMaking?: string;
  };
  learningContent?: {
    simpleMeaning: string;
    howToRecognizeIt: string;
    commonMistakes: string[];
    whenItAppears: string;
  };
  interpretationRules?: {
    energy: string[];
    polarity: 'constructive' | 'challenging' | 'neutral';
    intensity: number;
    adviceMode: string;
    timeSense: string;
  };
  lessons?: string[];
  questions?: string[];
}

export interface Position {
  key: string;
  label: string;
  intent: string;
}

export interface SpreadDefinition {
  name: string;
  positions: Position[];
}

export interface DrawnCard {
  card: TarotCardV2;
  position: Position;
  isReversed: boolean;
}

export interface InterpretationResult {
  cardInterpretations: CardInterpretation[];
  synthesis: string;
  overallEnergy: {
    polarity: string;
    intensity: number;
    dominantEnergies: string[];
  };
  advice: string;
  warning: string;
  reflectionQuestions: string[];
}

export interface CardInterpretation {
  cardName: string;
  position: string;
  isReversed: boolean;
  meaning: string;
  shadow: string;
  advice: string;
  contextMeaning?: string;
}

export interface InterpretationContext {
  question: string;
  category: 'general' | 'love' | 'career' | 'spiritual' | 'project' | 'selfKnowledge' | 'decisionMaking';
}

// Templates de interpretación
const templates = {
  individual: '{card} en {position} sugiere {meaning}.',
  contextual: 'En relación con tu pregunta sobre {domain}, esta carta habla de {contextMeaning}.',
  shadow: 'Sin embargo, su sombra indica {shadow}.',
  advice: 'El consejo que ofrece es: {advice}.',
  summary: 'La lectura sugiere {summary}.',
};

// ============================================
// MOTOR DE INTERPRETACIÓN PRINCIPAL
// ============================================

export function generateInterpretation(
  drawnCards: DrawnCard[],
  context: InterpretationContext,
  spreadDef: SpreadDefinition
): InterpretationResult {
  
  // 1. Interpretar cada carta individualmente
  const cardInterpretations = drawnCards.map(dc => 
    interpretCard(dc.card, dc.position, dc.isReversed, context)
  );

  // 2. Calcular energía general de la tirada
  const overallEnergy = calculateOverallEnergy(drawnCards);

  // 3. Generar síntesis narrativa
  const synthesis = generateSynthesis(cardInterpretations, context, overallEnergy);

  // 4. Extraer consejos y advertencias
  const advice = extractAdvice(cardInterpretations);
  const warning = extractWarning(cardInterpretations);

  // 5. Generar preguntas de reflexión
  const reflectionQuestions = generateReflectionQuestions(drawnCards, context);

  return {
    cardInterpretations,
    synthesis,
    overallEnergy,
    advice,
    warning,
    reflectionQuestions,
  };
}

// ============================================
// INTERPRETACIÓN INDIVIDUAL DE CARTA
// ============================================

function interpretCard(
  card: TarotCardV2,
  position: Position,
  isReversed: boolean,
  context: InterpretationContext
): CardInterpretation {
  
  // 1. Obtener significado base por posición
  const positionMeaning = getPositionMeaning(card, position.key, isReversed);
  
  // 2. Obtener significado por contexto
  const contextMeaning = getContextMeaning(card, context.category, isReversed);
  
  // 3. Obtener interpretación práctica
  const practical = card.practicalInterpretation || {
    core: card.uprightMeaning,
    shadow: card.reversed?.meaning || '',
    advice: '',
    warning: '',
  };

  // 4. Construir significado principal
  let meaning = positionMeaning || (isReversed 
    ? (card.reversed?.meaning || card.uprightMeaning)
    : card.uprightMeaning);

  // Si hay significado contextual, enriquecer la interpretación
  if (contextMeaning && context.category !== 'general') {
    meaning += `\n\nEn el contexto de ${getCategoryLabel(context.category)}: ${contextMeaning}`;
  }

  // 5. Construir sombra
  const shadow = isReversed
    ? practical.core
    : (practical.shadow || card.reversed?.meaning || '');

  // 6. Obtener consejo
  const advice = practical.advice || card.reversed?.advice || '';

  return {
    cardName: card.name,
    position: position.label,
    isReversed,
    meaning,
    shadow,
    advice,
    contextMeaning,
  };
}

// ============================================
// SIGNIFICADO POR POSICIÓN
// ============================================

function getPositionMeaning(
  card: TarotCardV2,
  positionKey: string,
  isReversed: boolean
): string | null {
  const positionMeanings = card.positionMeanings;
  
  if (!positionMeanings) return null;

  const positionKeyMap: Record<string, keyof typeof positionMeanings> = {
    'situacion_actual': 'situacion_actual',
    'bloqueo': 'bloqueo',
    'consejo': 'consejo',
    'resultado': 'resultado',
    'pasado': 'pasado',
    'presente': 'presente',
    'futuro': 'futuro',
  };

  const key = positionKeyMap[positionKey];
  return positionMeanings[key] || null;
}

// ============================================
// SIGNIFICADO POR CONTEXTO
// ============================================

function getContextMeaning(
  card: TarotCardV2,
  category: string,
  isReversed: boolean
): string | null {
  const contexts = card.contexts;
  
  if (!contexts) return null;

  const categoryKey = category as keyof typeof contexts;
  return contexts[categoryKey] || contexts.general || null;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    general: 'tu situación general',
    love: 'el amor y las relaciones',
    career: 'el trabajo y la carrera',
    spiritual: 'tu crecimiento espiritual',
    project: 'tus proyectos',
    selfKnowledge: 'tu autoconocimiento',
    decisionMaking: 'tus decisiones',
  };
  return labels[category] || 'tu situación';
}

// ============================================
// CÁLCULO DE ENERGÍA GENERAL
// ============================================

function calculateOverallEnergy(
  drawnCards: DrawnCard[]
): { polarity: string; intensity: number; dominantEnergies: string[] } {
  
  const energies: string[] = [];
  let totalIntensity = 0;
  let constructiveCount = 0;
  let challengingCount = 0;

  for (const dc of drawnCards) {
    const rules = dc.card.interpretationRules;
    
    if (rules) {
      energies.push(...(rules.energy || []));
      totalIntensity += rules.intensity || 0.5;
      
      if (dc.isReversed) {
        challengingCount++;
      } else {
        if (rules.polarity === 'constructive') constructiveCount++;
        else if (rules.polarity === 'challenging') challengingCount++;
      }
    } else {
      totalIntensity += 0.5;
      if (dc.isReversed) challengingCount++;
      else constructiveCount++;
    }
  }

  // Determinar polaridad general
  let polarity = 'equilibrada';
  if (constructiveCount > challengingCount + 1) polarity = 'predominantemente constructiva';
  else if (challengingCount > constructiveCount + 1) polarity = 'con desafíos significativos';

  // Encontrar energías dominantes
  const energyCounts: Record<string, number> = {};
  for (const e of energies) {
    energyCounts[e] = (energyCounts[e] || 0) + 1;
  }
  
  const dominantEnergies = Object.entries(energyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([e]) => e);

  return {
    polarity,
    intensity: totalIntensity / drawnCards.length,
    dominantEnergies,
  };
}

// ============================================
// SÍNTESIS NARRATIVA
// ============================================

function generateSynthesis(
  interpretations: CardInterpretation[],
  context: InterpretationContext,
  overallEnergy: { polarity: string; intensity: number; dominantEnergies: string[] }
): string {
  
  const parts: string[] = [];

  // Introducción
  parts.push(`## Lectura de Tarot`);
  parts.push(`\nTu consulta sobre **${getCategoryLabel(context.category)}** revela una energía ${overallEnergy.polarity}.`);
  
  // Energías presentes
  if (overallEnergy.dominantEnergies.length > 0) {
    parts.push(`\nLas energías que predominan son: **${overallEnergy.dominantEnergies.join(', ')}**.`);
  }

  // Interpretación de cada carta
  parts.push(`\n### Las Cartas\n`);
  
  for (const interp of interpretations) {
    parts.push(`**${interp.cardName}** (${interp.position}${interp.isReversed ? ', invertida' : ''})`);
    parts.push(`${interp.meaning}`);
    if (interp.shadow) {
      parts.push(`*Sombras a considerar:* ${interp.shadow}`);
    }
    parts.push('');
  }

  // Cierre
  parts.push(`### Síntesis`);
  parts.push(`\nEsta tirada te invita a reflexionar sobre los aspectos que las cartas han revelado.`);
  parts.push(`La intensidad energética es de **${Math.round(overallEnergy.intensity * 100)}%**, lo que indica una lectura ${overallEnergy.intensity > 0.7 ? 'intensa y significativa' : overallEnergy.intensity > 0.4 ? 'moderada con matices' : 'sutil pero relevante'}.`);

  return parts.join('\n');
}

// ============================================
// EXTRACCIÓN DE CONSEJOS
// ============================================

function extractAdvice(interpretations: CardInterpretation[]): string {
  const advices = interpretations
    .filter(i => i.advice)
    .map(i => `**${i.cardName}**: ${i.advice}`);
  
  if (advices.length === 0) return 'Confía en tu intuición para encontrar tu propio camino.';
  
  return advices.join('\n\n');
}

// ============================================
// EXTRACCIÓN DE ADVERTENCIAS
// ============================================

function extractWarning(interpretations: CardInterpretation[]): string {
  const warnings = interpretations
    .filter(i => i.shadow)
    .map(i => `**${i.cardName}**: ${i.shadow}`);
  
  if (warnings.length === 0) return 'No hay advertencias significativas en esta lectura.';
  
  return warnings.join('\n\n');
}

// ============================================
// PREGUNTAS DE REFLEXIÓN
// ============================================

function generateReflectionQuestions(
  drawnCards: DrawnCard[],
  context: InterpretationContext
): string[] {
  const questions: string[] = [];

  for (const dc of drawnCards) {
    if (dc.card.questions && dc.card.questions.length > 0) {
      // Tomar una pregunta aleatoria de cada carta
      const randomIndex = Math.floor(Math.random() * dc.card.questions.length);
      questions.push(dc.card.questions[randomIndex]);
    }
  }

  // Limitar a 3-4 preguntas
  return questions.slice(0, 4);
}

// ============================================
// UTILIDADES
// ============================================

export function formatInterpretationAsMarkdown(result: InterpretationResult): string {
  const parts: string[] = [];

  parts.push(result.synthesis);

  if (result.advice && result.advice !== 'Confía en tu intuición para encontrar tu propio camino.') {
    parts.push(`\n### 💡 Consejos`);
    parts.push(result.advice);
  }

  if (result.warning && result.warning !== 'No hay advertencias significativas en esta lectura.') {
    parts.push(`\n### ⚠️ Aspectos a considerar`);
    parts.push(result.warning);
  }

  if (result.reflectionQuestions.length > 0) {
    parts.push(`\n### 🔮 Preguntas para reflexionar`);
    for (const q of result.reflectionQuestions) {
      parts.push(`• ${q}`);
    }
  }

  return parts.join('\n');
}

export default {
  generateInterpretation,
  formatInterpretationAsMarkdown,
};
