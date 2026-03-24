import { PrismaClient, CardType, Suit, Element } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Load the new JSON
const tarotData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../public/tarot-cards-v2.json'), 'utf-8')
);

// Map element strings to Prisma enum
function mapElement(element: string | undefined): Element {
  const elementMap: Record<string, Element> = {
    'fire': Element.FIRE,
    'water': Element.WATER,
    'air': Element.AIR,
    'earth': Element.EARTH,
    'spirit': Element.SPIRIT,
    'fuego': Element.FIRE,
    'agua': Element.WATER,
    'aire': Element.AIR,
    'tierra': Element.EARTH,
  };
  return elementMap[element?.toLowerCase() || ''] || Element.SPIRIT;
}

// Map suit strings to Prisma enum
function mapSuit(suit: string | undefined): Suit {
  const suitMap: Record<string, Suit> = {
    'cups': Suit.CUPS,
    'swords': Suit.SWORDS,
    'wands': Suit.WANDS,
    'pentacles': Suit.PENTACLES,
    'major': Suit.MAJOR,
    'copas': Suit.CUPS,
    'espadas': Suit.SWORDS,
    'bastos': Suit.WANDS,
    'oros': Suit.PENTACLES,
  };
  return suitMap[suit?.toLowerCase() || ''] || Suit.MAJOR;
}

async function main() {
  console.log('🌱 Starting seed with v2 JSON...');
  console.log(`📊 Total cards in JSON: ${tarotData.cards.length}`);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tarot.com' },
    update: {},
    create: {
      email: 'admin@tarot.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 10);
  const demo = await prisma.user.upsert({
    where: { email: 'demo@tarot.com' },
    update: {},
    create: {
      email: 'demo@tarot.com',
      name: 'Demo User',
      password: demoPassword,
      role: 'USER',
    },
  });
  console.log('✅ Demo user created:', demo.email);

  // Create all cards from v2 JSON
  console.log('🃏 Creating cards from v2 JSON...');
  
  for (let i = 0; i < tarotData.cards.length; i++) {
    const card = tarotData.cards[i];
    
    const cardType = card.arcanaType === 'major' 
      ? CardType.MAJOR_ARCANA 
      : CardType.MINOR_ARCANA;
    
    const suit = mapSuit(card.suit);
    const element = mapElement(card.element);
    
    // Get reversed meaning - handle both object and string formats
    const reversedData = typeof card.reversed === 'object' && card.reversed !== null
      ? card.reversed
      : { meaning: card.reversed || '' };
    
    try {
      await prisma.tarotCard.upsert({
        where: { name: card.name },
        update: {
          slug: card.slug,
          shortName: card.id?.replace('major.', '').replace('minor.', ''),
          cardType,
          suit,
          element,
          number: card.number,
          position: i,
          rank: card.rank,
          keywords: card.keywords || [],
          coreMeaning: card.coreMeaning,
          description: card.description || card.coreMeaning || '',
          symbolism: card.symbolism || [],
          symbolsDetailed: card.symbolsDetailed,
          uprightMeaning: card.uprightMeaning || card.coreMeaning || '',
          reversed: reversedData,
          story: card.story,
          lessons: card.lessons,
          questions: card.questions,
          examples: card.examples,
          positionMeanings: card.positionMeanings,
          practicalInterpretation: card.practicalInterpretation,
          contexts: card.contexts,
          learningContent: card.learningContent,
          interpretationRules: card.interpretationRules,
          combinationExamples: card.combinationExamples,
          isActive: true,
        },
        create: {
          name: card.name,
          slug: card.slug,
          shortName: card.id?.replace('major.', '').replace('minor.', ''),
          cardType,
          suit,
          element,
          number: card.number,
          position: i,
          rank: card.rank,
          keywords: card.keywords || [],
          coreMeaning: card.coreMeaning,
          description: card.description || card.coreMeaning || '',
          symbolism: card.symbolism || [],
          symbolsDetailed: card.symbolsDetailed,
          uprightMeaning: card.uprightMeaning || card.coreMeaning || '',
          reversed: reversedData,
          story: card.story,
          lessons: card.lessons,
          questions: card.questions,
          examples: card.examples,
          positionMeanings: card.positionMeanings,
          practicalInterpretation: card.practicalInterpretation,
          contexts: card.contexts,
          learningContent: card.learningContent,
          interpretationRules: card.interpretationRules,
          combinationExamples: card.combinationExamples,
          isActive: true,
        },
      });
      
      if ((i + 1) % 10 === 0) {
        console.log(`  📝 Processed ${i + 1}/${tarotData.cards.length} cards...`);
      }
    } catch (error) {
      console.error(`Error creating card ${card.name}:`, error);
    }
  }
  
  console.log('✅ All cards created');

  // Create app settings
  await prisma.appSettings.upsert({
    where: { key: 'appName' },
    update: {},
    create: {
      key: 'appName',
      value: { value: 'Tarot Learning App v2' },
      description: 'Application name',
    },
  });

  // Store spread definitions
  await prisma.appSettings.upsert({
    where: { key: 'spreadDefinitions' },
    update: { value: tarotData.spreadDefinitions },
    create: {
      key: 'spreadDefinitions',
      value: tarotData.spreadDefinitions,
      description: 'Spread definitions for readings',
    },
  });

  // Store interpretation templates
  await prisma.appSettings.upsert({
    where: { key: 'interpretationTemplates' },
    update: { value: tarotData.interpretationEngineHints.templateExamples },
    create: {
      key: 'interpretationTemplates',
      value: tarotData.interpretationEngineHints.templateExamples,
      description: 'Interpretation templates',
    },
  });

  console.log('✅ App settings created');

  console.log('🎉 Seed v2 completed successfully!');
  console.log(`📊 Total cards: ${tarotData.cards.length}`);
  console.log(`📊 Major Arcana: ${tarotData.cards.filter((c: any) => c.arcanaType === 'major').length}`);
  console.log(`📊 Minor Arcana: ${tarotData.cards.filter((c: any) => c.arcanaType === 'minor').length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
