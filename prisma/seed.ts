import { PrismaClient, CardType, Suit, Element } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ===========================================
// TAROT CARDS DATA
// ===========================================

const majorArcanaCards = [
  {
    name: "El Loco",
    shortName: "fool",
    number: 0,
    position: 0,
    keywords: ["nuevos comienzos", "inocencia", "espontaneidad", "aventura", "fe", "libertad"],
    description: "El Loco representa el inicio de un viaje espiritual. Es el viajero eterno, el alma que se aventura hacia lo desconocido con confianza absoluta. Esta carta nos invita a dar el primer paso sin miedo, confiando en que el universo nos guiará.",
    symbolism: [
      "El viajero con su atado: las posesiones materiales son pocas, la libertad es grande",
      "El perro blanco: instinto y lealtad que protege el camino",
      "El abismo: el salto hacia lo desconocido",
      "El sol brillante: optimismo y energía vital",
      "La montaña lejana: metas por alcanzar"
    ],
    uprightMeaning: "Nuevos comienzos, oportunidades frescas, espontaneidad. Es momento de confiar y dar el salto hacia lo desconocido con fe y optimismo. El universo te invita a explorar nuevos caminos.",
    reversedMeaning: "Temeridad, imprudencia, riesgo sin considerar consecuencias. Puede indicar miedo a comenzar algo nuevo o resistencia al cambio necesario.",
    story: "El Loco es el alma que despierta al amanecer, mira el horizonte infinito y sonríe. No tiene mapa, no tiene plan, solo tiene la certeza de que cada paso es perfecto. Es el eterno principiante que todo lo aborda con curiosidad y asombro.",
    lessons: ["Confiar en el proceso", "Abrazar lo desconocido", "Dejar ir el control excesivo", "Vivir el presente"],
    questions: ["¿Qué nuevo camino está emergiendo en mi vida?", "¿Qué me impide dar el primer paso?", "¿Dónde necesito más espontaneidad?"],
    loveMeaning: "Nuevas relaciones, aventuras románticas, relaciones espontáneas. Si hay pareja, indica renovar la relación con frescura.",
    careerMeaning: "Nuevos proyectos, cambios de carrera, emprendimientos. Momento de asumir riesgos calculados.",
    spiritualMeaning: "El inicio del despertar espiritual. El alma se prepara para un viaje transformador.",
    symbols: {
      "viajero": "El buscador espiritual que todos llevamos dentro",
      "perro": "La guía instintiva y la protección divina",
      "abismo": "El umbral entre lo conocido y lo posible",
      "sol": "La presencia divina que ilumina todo camino"
    },
    examples: [
      "Un viaje inesperado que cambia tu perspectiva",
      "Dejar un trabajo seguro para seguir tu pasión",
      "Comenzar una relación sin garantías"
    ]
  },
  {
    name: "El Mago",
    shortName: "magician",
    number: 1,
    position: 1,
    keywords: ["manifestación", "poder", "creación", "habilidad", "concentración", "recursos"],
    description: "El Mago es el arquitecto de la realidad. Conecta el cielo con la tierra, transformando ideas en materia. Representa el poder de la voluntad enfocada y la capacidad de manifestar lo que deseamos.",
    symbolism: [
      "La figura de pie: conexión entre cielo y tierra",
      "La varita mágica: canalización de energía",
      "Los cuatro elementos en la mesa: todas las herramientas disponibles",
      "El infinito sobre la cabeza: poder ilimitado",
      "Las flores rojas y blancas: pasión y pureza unidas"
    ],
    uprightMeaning: "Tienes todos los recursos necesarios para manifestar tus objetivos. Es momento de actuar con intención clara y usar tus habilidades. El universo te respalda.",
    reversedMeaning: "Talento desperdiciado, manipulación, falta de dirección. Puede indicar que no estás usando todo tu potencial o que hay engaño en tu entorno.",
    story: "El Mago apareció en la encrucijada con todos los elementos sobre su mesa. 'Todo lo que necesitas ya lo tienes', susurró al viento. Y con un gesto transformó la posibilidad en realidad.",
    lessons: ["Tienes todo lo necesario", "La intención es poder", "Actúa con propósito", "Conecta el deseo con la acción"],
    questions: ["¿Qué recursos tienes disponibles ahora?", "¿Cuál es tu verdadera intención?", "¿Cómo puedes usar mejor tus habilidades?"],
    loveMeaning: "Atracción magnética, nuevos comienzos románticos, manifestación de la pareja ideal. Capacidad de crear la relación que deseas.",
    careerMeaning: "Éxito en proyectos, uso de habilidades, reconocimiento profesional. Momento de mostrar tu talento al mundo.",
    spiritualMeaning: "El poder de la co-creación con el universo. Tú eres el canal a través del cual se manifiesta lo divino.",
    symbols: {
      "varita": "El poder de dirigir la energía intencionalmente",
      "infinito": "La conexión con la fuente infinita de poder",
      "mesa": "El altar donde se realiza la transformación",
      "elementos": "Todas las herramientas a tu disposición"
    },
    examples: [
      "Conseguir ese trabajo que parecía imposible",
      "Crear un proyecto exitoso desde cero",
      "Manifestar la relación que visualizabas"
    ]
  },
  {
    name: "La Sacerdotisa",
    shortName: "high_priestess",
    number: 2,
    position: 2,
    keywords: ["intuición", "misterio", "sabiduría interior", "conocimiento oculto", "inconsciente", "secretos"],
    description: "La Sacerdotisa guarda los misterios del inconsciente. Es la voz interior que sabe sin explicar. Representa la sabiduría que no viene del intelecto, sino de la conexión profunda con lo divino femenino.",
    symbolism: [
      "Las columnas B y J: dualidad y equilibrio",
      "El velo: lo oculto que puede ser revelado",
      "La luna creciente: intuición y ciclos",
      "El pergamino: conocimiento sagrado",
      "Las granadas: fertilidad y abundancia oculta"
    ],
    uprightMeaning: "Confía en tu intuición. Hay información que aún no es visible pero que tu interior ya conoce. Es momento de silencio, reflexión y escuchar tu voz interior.",
    reversedMeaning: "Ignorar la intuición, secretos revelados antes de tiempo, desconexión del interior. Puede indicar que necesitas hacer más espacio para la quietud.",
    story: "Entre dos columnas de un templo antiguo, ella se sienta en silencio. No habla, pero su presencia lo dice todo. Quien se atreve a mirar hacia dentro descubre que ella ya conocía todas las respuestas.",
    lessons: ["La verdad habita en el silencio", "Confía en lo que sientes", "El conocimiento viene de adentro", "Respeta los misterios"],
    questions: ["¿Qué está intentando decirte tu intuición?", "¿Qué secretos guardas de ti mismo?", "¿Cuándo fue la última vez que escuchaste en silencio?"],
    loveMeaning: "Conexión espiritual profunda, amor misterioso, relación que trasciende lo físico. Puede indicar secretos en la relación.",
    careerMeaning: "Intuición guía decisiones, trabajo con conocimiento oculto, desarrollo de la percepción. Momento de confiar en corazonadas.",
    spiritualMeaning: "El portal hacia el inconsciente colectivo. La diosa interior que sostiene la sabiduría ancestral.",
    symbols: {
      "columnas": "Los opuestos que se equilibran",
      "velo": "El umbral entre lo consciente e inconsciente",
      "luna": "La mente intuitiva y cíclica",
      "pergamino": "La ley espiritual que guía"
    },
    examples: [
      "Una corazonada que resulta ser correcta",
      "Descubrir algo que siempre supiste sin saber cómo",
      "El silencio que revela una verdad importante"
    ]
  },
  {
    name: "La Emperatriz",
    shortName: "empress",
    number: 3,
    position: 3,
    keywords: ["abundancia", "fertilidad", "creatividad", "naturaleza", "nutrición", "belleza"],
    description: "La Emperatriz es la madre cósmica, la fuerza que nutre todo lo que existe. Representa la creatividad en su forma más abundante, la belleza natural y la capacidad de dar vida a proyectos y relaciones.",
    symbolism: [
      "La corona de estrellas: conexión celestial",
      "El cetro: poder sobre la naturaleza",
      "El vestido con granadas: fertilidad y abundancia",
      "El arroyo y la naturaleza: flujo de la vida",
      "El escudo con Venus: amor y belleza"
    ],
    uprightMeaning: "Abundancia, creatividad floreciente, fertilidad en todos los sentidos. Es momento de nutrir proyectos y relaciones. La naturaleza te bendice con su generosidad.",
    reversedMeaning: "Bloqueo creativo, negligencia con uno mismo, dependencia emocional. Puede indicar necesidad de reconectar con tu femineidad o creatividad.",
    story: "En un jardín eterno, la Emperatriz siembra semillas de possibility. Cada flor que crece es una idea hecha realidad, cada fruto es un sueño cumplido. Ella sabe que nutrir es crear.",
    lessons: ["Nutrir es crear", "La abundancia fluye cuando fluimos", "La belleza es necesidad del alma", "Cuida tu cuerpo como un jardín sagrado"],
    questions: ["¿Qué estás nutriendo en tu vida?", "¿Cómo puedes honrar tu creatividad?", "¿Qué necesita ser cuidado ahora?"],
    loveMeaning: "Amor abundante, fertilidad, relaciones que nutren. Puede indicar embarazo o nacimiento de proyectos en pareja.",
    careerMeaning: "Proyectos creativos florecen, abundancia financiera, trabajo que nutre. Éxito en emprendimientos creativos.",
    spiritualMeaning: "La Diosa Madre que habita todo. Conexión con la naturaleza y los ciclos de la vida.",
    symbols: {
      "corona": "Autoridad espiritual y conexión divina",
      "granadas": "Fertilidad infinita y la promesa de abundancia",
      "arroyo": "El flujo natural de las emociones",
      "Venus": "Amor incondicional y belleza"
    },
    examples: [
      "Un proyecto creativo que florece inesperadamente",
      "Encontrar el amor en momento de abundancia",
      "Dar a luz una idea que transforma tu vida"
    ]
  },
  {
    name: "El Emperador",
    shortName: "emperor",
    number: 4,
    position: 4,
    keywords: ["autoridad", "estructura", "padre", "control", "estabilidad", "liderazgo"],
    description: "El Emperador representa el principio masculino de estructura y orden. Es el arquitecto que construye sobre bases sólidas, el líder que guía con autoridad y sabiduría. Trae estabilidad y protección.",
    symbolism: [
      "El trono de piedra: fundamento sólido",
      "El cetro: autoridad y poder",
      "La armadura: protección y disciplina",
      "Las montañas: logros y altura de visión",
      "El carnero: fuerza, determinación, Aries"
    ],
    uprightMeaning: "Estabilidad, autoridad, estructura sólida. Es momento de tomar el control de tu vida con disciplina. Tienes el poder de construir los cimientos de tu éxito.",
    reversedMeaning: "Tiranía, rigidez excesiva, falta de control. Puede indicar problemas con figuras de autoridad o necesidad de flexibilidad.",
    story: "Desde su trono en la cima de la montaña, el Emperador ve todo el reino. Ha construido cada muro, ha establecido cada ley. Sabe que el verdadero poder está en servir y proteger.",
    lessons: ["La estructura libera", "El verdadero poder sirve", "La disciplina es amor en acción", "Construye cimientos sólidos"],
    questions: ["¿Dónde necesitas más estructura?", "¿Cómo ejerces tu autoridad personal?", "¿Qué cimientos estás construyendo?"],
    loveMeaning: "Relación estable, compromiso serio, protección en la pareja. Puede indicar una figura masculina significativa.",
    careerMeaning: "Liderazgo, ascensos, estabilidad profesional. Momento de estructurar proyectos y asumir responsabilidades.",
    spiritualMeaning: "El principio ordenador del universo. La voluntad divina que organiza el caos.",
    symbols: {
      "trono": "La posición de autoridad ganada con trabajo",
      "armadura": "Protección necesaria para el líder",
      "montañas": "La altura de la visión y los logros",
      "carnero": "La energía pionera y la determinación"
    },
    examples: [
      "Establecer una estructura que cambia tu vida",
      "Tomar el liderazgo de una situación difícil",
      "Construir la estabilidad que necesitabas"
    ]
  },
  {
    name: "El Sumo Sacerdote",
    shortName: "hierophant",
    number: 5,
    position: 5,
    keywords: ["tradición", "conformidad", "enseñanza", "espiritualidad", "instituciones", "guía"],
    description: "El Sumo Sacerdote representa la sabiduría de las tradiciones y las instituciones espirituales. Es el puente entre lo divino y lo humano, el maestro que transmite conocimiento sagrado y valores heredados.",
    symbolism: [
      "Las llaves del cielo: acceso al conocimiento sagrado",
      "Los dos discípulos: transmisión de enseñanza",
      "El báculo: autoridad espiritual",
      "Las columnas: tradición y estructura",
      "La tiara: conexión con lo divino"
    ],
    uprightMeaning: "Guía espiritual, tradición, enseñanza sagrada. Es momento de buscar mentores o conectar con sistemas de creencias que te apoyen. La sabiduría ancestral está disponible.",
    reversedMeaning: "Rebelión contra tradiciones, ruptura con lo establecido, búsqueda de espiritualidad personal. Puede indicar que las viejas formas ya no te sirven.",
    story: "En el templo de la memoria, el Sacerdote sostiene las llaves de mil generaciones. Sabe que algunas verdades solo se heredan y que el camino espiritual requiere guía y comunidad.",
    lessons: ["Honra lo que te precede", "Busca maestros auténticos", "La tradición puede guiar o limitar", "El ritual nutre el alma"],
    questions: ["¿Qué tradiciones resuenan contigo?", "¿Quién puede ser tu guía ahora?", "¿Qué creencias necesitas cuestionar?"],
    loveMeaning: "Compromiso formal, matrimonio, relación bendecida. Puede indicar seguir convenciones sociales en el amor.",
    careerMeaning: "Educación, instituciones, trabajo convencional. Mentoría y desarrollo profesional a través de sistemas establecidos.",
    spiritualMeaning: "El canal de la sabiduría ancestral. Conexión con linajes espirituales y enseñanzas eternas.",
    symbols: {
      "llaves": "El acceso a misterios guardados",
      "discípulos": "La cadena de transmisión del conocimiento",
      "báculo": "La autoridad que guía sin forzar",
      "tiara": "La conexión con las esferas superiores"
    },
    examples: [
      "Encontrar un mentor que transforma tu camino",
      "Unirte a una comunidad que te nutre espiritualmente",
      "Descubrir sabiduría en tradiciones ancestrales"
    ]
  },
  {
    name: "Los Enamorados",
    shortName: "lovers",
    number: 6,
    position: 6,
    keywords: ["amor", "unión", "elección", "armonía", "relaciones", "valores"],
    description: "Los Enamorados representan no solo el amor romántico, sino cualquier elección significativa que requiere alinearnos con nuestros valores más profundos. Es la carta de la unión sagrada y las decisiones cruciales.",
    symbolism: [
      "Adán y Eva: la primera elección humana",
      "El ángel: bendición divina de la unión",
      "El árbol del conocimiento: elección y consecuencias",
      "La serpiente: tentación y despertar",
      "Las montañas: el camino que se bifurca"
    ],
    uprightMeaning: "Amor profundo, alineación de valores, elección importante. Es momento de decisiones que reflejen quién eres realmente. Las relaciones florecen cuando hay autenticidad.",
    reversedMeaning: "Desequilibrio en relaciones, elecciones difíciles, desalineación de valores. Puede indicar una elección que no honra tu verdad.",
    story: "Ante el jardín del paraíso, dos almas se encuentran y reconocen. Saben que elegir amarse es elegir el camino del corazón, con todas sus consecuencias y bendiciones.",
    lessons: ["El amor es elección diaria", "Tus elecciones definen quién eres", "La unión verdadera honra la individualidad", "El corazón sabe cuando elige bien"],
    questions: ["¿Qué elección importante enfrentas?", "¿Tus acciones reflejan tus valores?", "¿Qué tipo de amor estás eligiendo?"],
    loveMeaning: "Amor verdadero, alma gemela, relación significativa. Unión bendecida que trae crecimiento mutuo.",
    careerMeaning: "Alianzas profesionales, decisiones de carrera basadas en valores, trabajo que amas.",
    spiritualMeaning: "La unión de opuestos dentro de uno mismo. La integración del animus y anima.",
    symbols: {
      "ángel": "La bendición de elecciones hechas desde el corazón",
      "serpiente": "El conocimiento que viene de elegir",
      "árboles": "Las dos fuerzas: conocimiento y vida",
      "montañas": "Los caminos que se abren con cada elección"
    },
    examples: [
      "Elegir un camino que honra tus valores aunque sea difícil",
      "Encontrar el amor cuando finalmente eres auténtico",
      "Una decisión que transforma toda tu vida"
    ]
  },
  {
    name: "El Carro",
    shortName: "chariot",
    number: 7,
    position: 7,
    keywords: ["victoria", "determinación", "control", "voluntad", "acción", "triunfo"],
    description: "El Carro representa la victoria conquistada con determinación y voluntad. Es el guerrero que domina las fuerzas opuestas y avanza hacia su objetivo con confianza inquebrantable.",
    symbolism: [
      "El carro: vehículo de triunfo",
      "Las esfinges: fuerzas opuestas que deben dominarse",
      "La armadura: protección y disciplina",
      "Las estrellas: guía celestial",
      "La ciudad: el reino conquistado"
    ],
    uprightMeaning: "Victoria, determinación, éxito a través de la voluntad. Es momento de avanzar con confianza y controlar las fuerzas que compiten en tu vida. El triunfo está asegurado.",
    reversedMeaning: "Falta de dirección, derrota temporal, pérdida de control. Puede indicar que necesitas reunir fuerzas antes de avanzar.",
    story: "El guerrero sube a su carro y toma las riendas de dos esfinges que miran en direcciones opuestas. Sabe que el secreto no está en elegir una dirección, sino en dominar ambas fuerzas.",
    lessons: ["El éxito requiere dominio de opuestos", "La voluntad mueve mundos", "Avanza con determinación", "Confía en tu capacidad de triunfar"],
    questions: ["¿Qué fuerzas opuestas necesitas equilibrar?", "¿Hacia dónde diriges tu voluntad?", "¿Qué victoria estás buscando?"],
    loveMeaning: "Triunfo en el amor, conquista exitosa, relación que requiere esfuerzo pero que vale la pena.",
    careerMeaning: "Éxito profesional, logro de metas, reconocimiento público. Avance determinado hacia objetivos.",
    spiritualMeanance: "El dominio de las fuerzas internas. La integración del yin y yang en el camino del guerrero espiritual.",
    symbols: {
      "esfinges": "Las fuerzas contradictorias que debemos gobernar",
      "carro": "El vehículo de nuestro propósito",
      "armadura": "La disciplina que protege",
      "estrellas": "La guía superior en todo viaje"
    },
    examples: [
      "Conseguir una victoria que parecía imposible",
      "Dominar situaciones que se salían de control",
      "Triunfar combinando aspectos opuestos de tu vida"
    ]
  },
  {
    name: "La Justicia",
    shortName: "justice",
    number: 8,
    position: 8,
    keywords: ["justicia", "verdad", "karma", "equidad", "ley", "causa y efecto"],
    description: "La Justicia representa el equilibrio perfecto entre causa y efecto. Es la verdad que no puede ser ocultada, la balanza que pesa cada acción con precisión matemática. Trae rendición de cuentas y claridad.",
    symbolism: [
      "La balanza: equilibrio y medición precisa",
      "La espada: corte de ilusiones y verdad",
      "Los pilares: estructura de la ley",
      "El velo: lo oculto que será revelado",
      "La corona: autoridad divina"
    ],
    uprightMeaning: "Justicia, verdad revelada, consecuencias justas. Es momento de rendición de cuentas. La verdad saldrá a la luz y recibirás lo que mereces.",
    reversedMeaning: "Injusticia, deshonestidad, falta de responsabilidad. Puede indicar que algo no es justo y necesita ser corregido.",
    story: "En el tribunal del universo, la Justicia pesa cada acción con infinita paciencia. No hay defensa posible ante la verdad absoluta, pero tampoco hay castigo sin razón.",
    lessons: ["Cada acción tiene consecuencia", "La verdad siempre emerge", "Sé justo contigo primero", "Acepta lo que mereces"],
    questions: ["¿Qué verdad necesitas enfrentar?", "¿Estás siendo justo contigo y otros?", "¿Qué consecuencias estás cosechando?"],
    loveMeaning: "Relación justa y equilibrada, decisiones legales en amor, claridad en situaciones confusas.",
    careerMeaning: "Contratos justos, reconocimiento merecido, decisiones profesionales que requieren honestidad.",
    spiritualMeaning: "La ley del karma en acción. El universo siempre restaura el equilibrio.",
    symbols: {
      "balanza": "El equilibrio perfecto que el universo mantiene",
      "espada": "La verdad que corta toda ilusión",
      "pilares": "La estructura inmutable de la ley cósmica",
      "corona": "La autoridad que viene de la imparcialidad"
    },
    examples: [
      "Recibir justo reconocimiento por tu trabajo",
      "Que la verdad salga a la luz en una situación",
      "Ver cómo el karma actúa en tu vida"
    ]
  },
  {
    name: "El Ermitaño",
    shortName: "hermit",
    number: 9,
    position: 9,
    keywords: ["introspección", "soledad", "sabiduría", "guía interior", "búsqueda", "retiro"],
    description: "El Ermitaño representa la sabiduría que solo se encuentra en el silencio y la soledad consciente. Es el buscador que ilumina su propio camino y, al hacerlo, se convierte en guía para otros.",
    symbolism: [
      "La linterna: la luz de la sabiduría interior",
      "El cayado: apoyo en el camino espiritual",
      "La túnica gris: neutralidad y humildad",
      "La montaña: altura espiritual alcanzada",
      "La capucha: retiro del mundo exterior"
    ],
    uprightMeaning: "Introspección necesaria, búsqueda de respuestas interiores, guía sabia. Es momento de retirarte para encontrar la verdad que buscas. La soledad es tu maestra ahora.",
    reversedMeaning: "Aislamiento excesivo, rechazo de ayuda, soledad no productiva. Puede indicar que necesitas equilibrio entre retiro y conexión.",
    story: "En la cima de la montaña más alta, el Ermitaño camina solo pero no solitario. Su linterna ilumina el camino para quienes vienen detrás, aunque él nunca los vea.",
    lessons: ["La soledad consciente nutre", "Las respuestas están dentro", "Ser luz para otros requiere oscuridad propia", "La verdadera sabiduría es silenciosa"],
    questions: ["¿Qué verdad buscas en soledad?", "¿Cómo puedes honrar tu necesidad de introspección?", "¿Qué luz puedes ofrecer desde tu experiencia?"],
    loveMeaning: "Necesidad de espacio personal, relación que requiere madurez, amor que nace de la plenitud individual.",
    careerMeaning: "Trabajo independiente, mentoría, desarrollo de experiencia. Momento de profundizar en tu campo.",
    spiritualMeaning: "El camino del místico. La iluminación que viene de la contemplación profunda.",
    symbols: {
      "linterna": "La luz de la conciencia que ilumina el camino",
      "cayado": "El apoyo de la experiencia acumulada",
      "montaña": "La altura de la perspectiva espiritual",
      "capucha": "El retiro necesario del mundano"
    },
    examples: [
      "Un retiro que transforma tu perspectiva",
      "Encontrar respuestas en momentos de soledad",
      "Convertirte en guía a través de tu propia experiencia"
    ]
  },
  {
    name: "La Rueda de la Fortuna",
    shortName: "wheel_of_fortune",
    number: 10,
    position: 10,
    keywords: ["ciclos", "destino", "cambio", "suerte", "oportunidad", "giro"],
    description: "La Rueda de la Fortuna representa los ciclos eternos de la vida. Lo que sube debe bajar, y lo que baja volverá a subir. Nos enseña que el cambio es la única constante y que cada final es un nuevo comienzo.",
    symbolism: [
      "La rueda: ciclo eterno de cambio",
      "Esfinge: el misterio del destino",
      "Anubis: transformación y resurrección",
      "La serpiente: el mal que asciende",
      "Las cuatro bestias: los evangelios y los elementos"
    ],
    uprightMeaning: "Cambios positivos, giro del destino, nuevas oportunidades. La rueda gira a tu favor. Es momento de aprovechar el impulso del universo.",
    reversedMeaning: "Cambios difíciles, mala racha temporal, resistencia al cambio. Recuerda que esto también pasará.",
    story: "La rueda gira sin cesar, y en ella cada ser asciende y desciende según el tiempo que le toca. Quien comprende que el cambio es inevitable navega los ciclos con gracia.",
    lessons: ["Todo cambia, todo pasa", "Acepta los ciclos sin resistencia", "Cuando bajas, recuerda que subirás", "El destino colabora con quien fluye"],
    questions: ["¿Qué ciclo está terminando en tu vida?", "¿Cómo puedes fluir con el cambio actual?", "¿Qué oportunidades trae este giro?"],
    loveMeaning: "Cambios en las relaciones, destino romántico, giros inesperados en el amor. La relación evoluciona.",
    careerMeaning: "Nuevas oportunidades, cambios de rumbo, suerte profesional. Momento de aprovechar giros favorables.",
    spiritualMeaning: "El ciclo de renacimiento. La comprensión de que todo en la vida es impermanente.",
    symbols: {
      "rueda": "El ciclo eterno de nacimiento, muerte y renacimiento",
      "esfinge": "El misterio que guardamos en cada encarnación",
      "Anubis": "La transformación que trae cada ciclo",
      "bestias": "Las fuerzas elementales que presiden el cambio"
    },
    examples: [
      "Un giro inesperado que resulta bendición",
      "Cambios de ciclo que transforman tu vida",
      "El momento preciso donde todo se alinea"
    ]
  },
  {
    name: "La Fuerza",
    shortName: "strength",
    number: 11,
    position: 11,
    keywords: ["fuerza interior", "coraje", "paciencia", "compasión", "dominio", "resiliencia"],
    description: "La Fuerza representa no la fuerza bruta, sino el poder suave de la compasión y la paciencia. Es la capacidad de dominar los instintos inferiores con amor, no con represión.",
    symbolism: [
      "La mujer y el león: dominio de la bestia interior",
      "El lazo infinito: poder eterno del amor",
      "Las manos suaves: compasión, no fuerza",
      "La corona de flores: victoria sobre naturaleza salvaje",
      "El vestido blanco: pureza de intención"
    ],
    uprightMeaning: "Fuerza interior, coraje compasivo, dominio sobre impulsos. Tienes la capacidad de enfrentar cualquier desafío con gracia. Tu verdadero poder está en la suavidad.",
    reversedMeaning: "Debilidad temporal, falta de autocontrol, duda sobre capacidades. Puede indicar que necesitas reconectar con tu poder interior.",
    story: "Con manos suaves, ella acaricia al león feroz. No usa armas ni cadenas, solo la mirada de quien conoce su propia fuerza. El león rinde su furia ante tal serenidad.",
    lessons: ["La verdadera fuerza es suave", "Domina con amor, no con represión", "Tu bestia interior necesita compasión", "El coraje se cultiva"],
    questions: ["¿Qué bestia interior necesitas amar?", "¿Dónde puedes ser más suave contigo?", "¿Qué te hace verdaderamente fuerte?"],
    loveMeaning: "Amor que fortalece, relaciones que requieren paciencia, dominio de pasiones con compasión.",
    careerMeaning: "Resiliencia profesional, liderazgo compasivo, superar desafíos con gracia.",
    spiritualMeaning: "El dominio del ego por el alma. La integración del aspecto animal y divino.",
    symbols: {
      "león": "Los instintos y pasiones que debemos gobernar",
      "mujer": "El principio superior del alma consciente",
      "infinito": "El poder eterno del amor",
      "flores": "La naturaleza domada por la belleza"
    },
    examples: [
      "Superar un miedo con compasión hacia ti mismo",
      "Dominar un impulso destructivo con suavidad",
      "Encontrar fuerza en momentos de debilidad"
    ]
  },
  {
    name: "El Colgado",
    shortName: "hanged_man",
    number: 12,
    position: 12,
    keywords: ["suspensión", "sacrificio", "nueva perspectiva", "espera", "rendición", "iluminación"],
    description: "El Colgado representa el poder de la rendición y la perspectiva que solo se obtiene al ver el mundo al revés. Es el sacrificio voluntario que trae sabiduría y transformación.",
    symbolism: [
      "La figura colgada: suspensión entre mundos",
      "La horca en forma de Tau: sacrificio sagrado",
      "El halo: iluminación obtenida",
      "Las manos detrás: rendición del ego",
      "La pierna cruzada: el número 4, estabilidad"
    ],
    uprightMeaning: "Pausa necesaria, nueva perspectiva, sacrificio que vale la pena. Es momento de rendirte a lo que es y ver desde otro ángulo. La espera trae revelación.",
    reversedMeaning: "Resistencia a rendirse, estancamiento innecesario, sacrificio sin propósito. Puede indicar que necesitas soltar el control.",
    story: "Cuelga boca abajo del árbol del mundo, y en esa posición absurda descubre la verdad. Lo que parecía locura es el camino más corto hacia la sabiduría.",
    lessons: ["A veces hay que rendirse para ganar", "La perspectiva cambia todo", "La pausa es activa", "El sacrificio consciente transforma"],
    questions: ["¿Desde qué nuevo ángulo puedes ver tu situación?", "¿A qué necesitas rendirte?", "¿Qué espera es necesaria ahora?"],
    loveMeaning: "Necesidad de cambiar perspectiva en la relación, sacrificio por el otro, amor que requiere paciencia.",
    careerMeaning: "Pausa estratégica, cambio de enfoque profesional, sacrificio presente por beneficio futuro.",
    spiritualMeaning: "El iniciado que muere para renacer. La iluminación que viene de soltar el ego.",
    symbols: {
      "horca": "El árbol del mundo, eje entre cielo y tierra",
      "halo": "La luz que se gana con la rendición",
      "posición": "Ver el mundo desde la perspectiva del alma",
      "manos": "El ego que se entrega voluntariamente"
    },
    examples: [
      "Un período de espera que trae claridad inesperada",
      "Cambiar de perspectiva y ver una solución",
      "Sacrificar algo pequeño por algo mayor"
    ]
  },
  {
    name: "La Muerte",
    shortName: "death",
    number: 13,
    position: 13,
    keywords: ["transformación", "final", "renacimiento", "cambio profundo", "transición", "liberación"],
    description: "La Muerte representa no el fin físico, sino la transformación profunda. Es el ciclo inevitable de muerte y renacimiento, la liberación de lo viejo para dar paso a lo nuevo.",
    symbolism: [
      "El esqueleto: la muerte que iguala a todos",
      "La hoz: corte de lo viejo",
      "El caballo blanco: pureza de la transformación",
      "El rey caído: ni el poder evita el cambio",
      "El sol al horizonte: renacimiento prometido"
    ],
    uprightMeaning: "Transformación profunda, final necesario, renacimiento. Algo debe morir para que algo nuevo nazca. No temas el cambio, abraza la transformación.",
    reversedMeaning: "Resistencia al cambio, estancamiento, miedo a transformarse. Puede indicar que te aferras a lo que ya no te sirve.",
    story: "La Muerte cabalga sin emociones, segando todo lo que ha cumplido su ciclo. Donde pasa, queda espacio para lo nuevo. Ella sabe que la vida necesita de ella.",
    lessons: ["Sin muerte no hay vida nueva", "Aferrarse es sufrir", "Cada final es un comienzo", "La transformación es inevitable"],
    questions: ["¿Qué necesita morir en tu vida?", "¿A qué te aferras que ya no sirve?", "¿Qué nueva vida está intentando nacer?"],
    loveMeaning: "Fin de una etapa en la relación, transformación profunda del amor, relación que se renueva.",
    careerMeaning: "Cambio de carrera radical, fin de un trabajo, transformación profesional profunda.",
    spiritualMeaning: "La muerte del ego. El renacimiento del ser auténtico.",
    symbols: {
      "esqueleto": "La estructura que permanece cuando todo cambia",
      "hoz": "El corte necesario de los apegos",
      "caballo": "La fuerza que arrastra el cambio inevitable",
      "sol": "La promesa de que siempre amanece"
    },
    examples: [
      "El fin de una etapa que traerá algo mejor",
      "Transformación profunda de identidad",
      "Liberación de algo que creías eterno"
    ]
  },
  {
    name: "La Templanza",
    shortName: "temperance",
    number: 14,
    position: 14,
    keywords: ["equilibrio", "moderación", "paciencia", "sanación", "propósito", "alquimia"],
    description: "La Templanza representa la alquimia del equilibrio perfecto. Es el arte de mezclar opuestos hasta crear armonía, la paciencia que sana y el propósito que guía toda acción.",
    symbolism: [
      "El ángel: guía espiritual",
      "Las dos copas: mezcla de opuestos",
      "El agua fluyendo: equilibrio continuo",
      "El iris: puente entre cielo y tierra",
      "El sol y la corona: iluminación y victoria"
    ],
    uprightMeaning: "Equilibrio, moderación, sanación gradual. Es momento de encontrar el punto medio, de ser paciente contigo y con el proceso. La armonía se está gestando.",
    reversedMeaning: "Desequilibrio, exceso, impaciencia. Puede indicar que necesitas reconectar con la moderación y la calma.",
    story: "El ángel vierte agua entre dos copas sin derramar una gota, en un acto de paciencia infinita. Sabe que la verdadera alquimia requiere tiempo y equilibrio perfecto.",
    lessons: ["El punto medio es el camino", "La paciencia es activa", "La sanación toma tiempo", "Combina opuestos con gracia"],
    questions: ["¿Dónde necesitas más equilibrio?", "¿Qué opuestos puedes armonizar?", "¿Cómo puedes ser más paciente contigo?"],
    loveMeaning: "Relación equilibrada, sanación en pareja, amor que integra diferencias. Armonía después de conflictos.",
    careerMeaning: "Equilibrio trabajo-vida, proyectos que requieren paciencia, carrera que integra diversas áreas.",
    spiritualMeaning: "El alquimista interior que transforma el plomo en oro. La integración de todos los aspectos del ser.",
    symbols: {
      "copas": "La mezcla sagrada de opuestos",
      "ángel": "La guía que conoce el equilibrio perfecto",
      "agua": "El flujo continuo de la vida",
      "iris": "El puente entre lo divino y humano"
    },
    examples: [
      "Encontrar equilibrio en un área caótica",
      "Sanar algo que requería paciencia",
      "Integrar aspectos opuestos de tu vida"
    ]
  },
  {
    name: "El Diablo",
    shortName: "devil",
    number: 15,
    position: 15,
    keywords: ["ataduras", "adicción", "materialismo", "sombra", "tentación", "confrontación"],
    description: "El Diablo representa las cadenas que nosotros mismos creamos. Es la sombra que debemos confrontar, las adicciones y patrones que nos limitan, pero también la oportunidad de liberarnos al reconocerlos.",
    symbolism: [
      "El dios con cuernos: naturaleza instintiva",
      "Las cadenas: ataduras autoimpuestas",
      "Los dos esclavos: la dualidad atrapada",
      "La antorcha invertida: luz usada para controlar",
      "La estrella invertida: materia sobre espíritu"
    ],
    uprightMeaning: "Confrontación con la sombra, ataduras que limitan, patrones que debes reconocer. Es momento de ver tus cadenas y entender que tú tienes la llave.",
    reversedMeaning: "Liberación de ataduras, ruptura de patrones, libertad ganada. Estás listo para soltar lo que te aprisiona.",
    story: "El Diablo ríe desde su trono mientras las cadenas que él no cerró mantienen a los humanos prisioneros. El secreto es que cada uno tiene la llave, pero pocos se atreven a usarla.",
    lessons: ["Tus cadenas son autoimpuestas", "La sombra tiene mensajes", "La liberación comienza con ver", "El materialismo es una prisión"],
    questions: ["¿Qué te tiene atrapado?", "¿Qué sombra necesitas confrontar?", "¿Dónde está tu llave de liberación?"],
    loveMeaning: "Relaciones tóxicas, ataduras emocionales, patrones que repites en el amor. Oportunidad de ver y liberar.",
    careerMeaning: "Trabajo que esclaviza, ambición desmedida, patrones profesionales limitantes. Hora de evaluar motivaciones.",
    spiritualMeaning: "El encuentro con la sombra. La integración de lo rechazado que es necesaria para la totalidad.",
    symbols: {
      "cadenas": "Las prisiones que creamos y mantenemos",
      "diablo": "El lado oscuro que tememos reconocer",
      "esclavos": "Los aspectos de nosotros atrapados",
      "antorcha": "El poder mal usado"
    },
    examples: [
      "Reconocer una adicción y decidir liberarte",
      "Ver un patrón tóxico y cortarlo",
      "Confrontar tu lado oscuro para sanar"
    ]
  },
  {
    name: "La Torre",
    shortName: "tower",
    number: 16,
    position: 16,
    keywords: ["colapso", "revelación", "liberación súbita", "destrucción", "verdad", "cambio drástico"],
    description: "La Torre representa la destrucción necesaria de estructuras falsas. Es el rayo que ilumina y destruye simultáneamente, el colapso que libera de lo que ya no sirve.",
    symbolism: [
      "La torre: estructuras construidas sobre falsedades",
      "El rayo: intervención divina",
      "Las figuras cayendo: el ego derrocado",
      "El fuego: purificación",
      "La corona: caída del poder falso"
    ],
    uprightMeaning: "Colapso necesario, revelación impactante, liberación dramática. Aunque parezca destrucción, es liberación. Lo que cae nunca fue sólido.",
    reversedMeaning: "Evitar el colapso, cambio gradual en lugar de súbito, resistencia a la transformación. El cambio llegará de otra forma.",
    story: "La Torre se construyó con orgullo y cimientos falsos. El rayo que la destruye no es castigo, sino la verdad que libera de la ilusión de seguridad.",
    lessons: ["Lo construido sobre mentiras caerá", "La destrucción puede ser liberación", "Después del colapso, claridad", "El ego siempre cae"],
    questions: ["¿Qué estructura falsa está por caer?", "¿Qué seguridad es ilusoria?", "¿Qué te liberarías si todo cayera?"],
    loveMeaning: "Relación que se revela falsa, cambios dramáticos en pareja, verdad que emerge de golpe.",
    careerMeaning: "Trabajo que colapsa, carrera que se transforma radicalmente, estructuras profesionales que caen.",
    spiritualMeaning: "El ego desmoronado. La verdad desnuda después de la ilusión.",
    symbols: {
      "torre": "El ego y sus construcciones falsas",
      "rayo": "La intervención divina que revela la verdad",
      "cuerpos": "Los aspectos del ego derrocados",
      "fuego": "La purificación que trae claridad"
    },
    examples: [
      "Un evento que derriba tu vida para reconstruirla mejor",
      "La verdad que emerge cuando todo parece perdido",
      "El colapso que resultó ser tu liberación"
    ]
  },
  {
    name: "La Estrella",
    shortName: "star",
    number: 17,
    position: 17,
    keywords: ["esperanza", "inspiración", "fe", "sanación", "renovación", "guía"],
    description: "La Estrella representa la esperanza que surge después de la tormenta. Es la luz que guía en la oscuridad, la sanación que fluye y la renovación del espíritu.",
    symbolism: [
      "La mujer desnuda: vulnerabilidad y autenticidad",
      "El agua fluyendo: sanación continua",
      "La estrella grande: guía principal",
      "Las estrellas pequeñas: múltiples bendiciones",
      "El pájaro: el alma que se eleva"
    ],
    uprightMeaning: "Esperanza, sanación, inspiración renovada. Después de la oscuridad, la luz aparece. Confía en que el universo te guía y sana.",
    reversedMeaning: "Desesperanza temporal, desconexión de la fe, necesidad de reconectar con la esperanza. La luz sigue ahí, aunque no la veas.",
    story: "Después de la Torre, bajo el cielo nocturno, una mujer vierte agua en el estanque y la tierra. Ella sabe que las estrellas siempre están, incluso de día.",
    lessons: ["La esperanza es real", "La sanación fluye cuando te abres", "Las estrellas guían siempre", "Después de la noche, siempre amanece"],
    questions: ["¿Dónde puedes encontrar esperanza?", "¿Qué te está sanando ahora?", "¿Qué estrella te guía?"],
    loveMeaning: "Amor sanador, esperanza romántica renovada, relación que inspira y eleva.",
    careerMeaning: "Inspiración profesional, nuevo propósito, trabajo que alimenta el alma.",
    spiritualMeaning: "La conexión con la guía superior. La fe restaurada después de la prueba.",
    symbols: {
      "estrellas": "La guía constante del universo",
      "agua": "La sanación que fluye eternamente",
      "mujer": "El alma auténtica que se entrega",
      "pájaro": "El espíritu que se eleva"
    },
    examples: [
      "Encontrar esperanza cuando todo parecía perdido",
      "Una sanación inesperada después de una crisis",
      "La inspiración que llega justo cuando la necesitas"
    ]
  },
  {
    name: "La Luna",
    shortName: "moon",
    number: 18,
    position: 18,
    keywords: ["ilusión", "intuición", "miedo", "inconsciente", "sueños", "engaño"],
    description: "La Luna representa el reino de las ilusiones y el inconsciente. Es el camino a través de la niebla donde la intuición es la única guía y los miedos emergen para ser confrontados.",
    symbolism: [
      "La luna llena: el inconsciente iluminado",
      "El sendero: el camino a través de la niebla",
      "El perro y el lobo: instinto domesticado y salvaje",
      "El cangrejo: emociones que emergen",
      "Las torres: límites entre mundos"
    ],
    uprightMeaning: "Navegación por intuición, confrontación de miedos, ilusiones que disipar. No todo es lo que parece. Confía en tu instinto y atraviesa la niebla.",
    reversedMeaning: "Miedos liberados, claridad después de la confusión, ilusiones disipadas. La niebla se levanta.",
    story: "Bajo la luz de la Luna, el camino se vuelve incierto. El perro y el lobo aúllan, el cangrejo emerge del agua. Solo quien escucha su intuición atraviesa la niebla.",
    lessons: ["La realidad no siempre es clara", "Los miedos son maestros", "Confía en lo que sientes", "El inconsciente tiene mensajes"],
    questions: ["¿Qué miedos están emergiendo?", "¿Qué no estás viendo claramente?", "¿Qué te dice tu intuición?"],
    loveMeaning: "Confusión en relaciones, miedos que afectan el amor, intuición que guía en lo romántico.",
    careerMeaning: "Situación confusa en el trabajo, intuición profesional, miedos que superar para avanzar.",
    spiritualMeaning: "El viaje nocturno del alma. El descenso al inconsciente para confrontar la sombra.",
    symbols: {
      "luna": "El inconsciente y sus misterios",
      "perro/lobo": "Lo domesticado y lo salvaje en nosotros",
      "cangrejo": "Las emociones que emergen de las profundidades",
      "torres": "Los límites de lo conocido"
    },
    examples: [
      "Un período de confusión que revela verdades profundas",
      "Confrontar un miedo que estaba oculto",
      "Seguir la intuición cuando nada tiene sentido"
    ]
  },
  {
    name: "El Sol",
    shortName: "sun",
    number: 19,
    position: 19,
    keywords: ["alegría", "éxito", "vitalidad", "claridad", "optimismo", "iluminación"],
    description: "El Sol representa la victoria de la luz sobre la oscuridad. Es la alegría pura, el éxito alcanzado, la claridad total y la celebración de la vida en su máximo esplendor.",
    symbolism: [
      "El sol radiante: fuente de toda vida",
      "El niño: inocencia renovada",
      "El caballo blanco: pureza y libertad",
      "Los girasoles: seguimiento de la luz",
      "El muro: protección sin límites"
    ],
    uprightMeaning: "Éxito, alegría, claridad total. Todo se ilumina y las sombras desaparecen. Es momento de celebrar y disfrutar la luz que has alcanzado.",
    reversedMeaning: "Éxito temporalmente eclipsado, exceso de optimismo, necesidad de buscar la luz interior.",
    story: "El niño cabalga bajo el sol que todo lo ilumina. No hay sombras, no hay secretos, solo la alegría pura de quien ha superado la noche.",
    lessons: ["La luz siempre regresa", "Celebra tus victorias", "La alegría es tu derecho", "La claridad llega"],
    questions: ["¿Qué luz estás alcanzando?", "¿Qué victorias merecen celebración?", "¿Dónde hay claridad en tu vida?"],
    loveMeaning: "Amor radiante, relación exitosa, felicidad en pareja. Momento de luz y celebración romántica.",
    careerMeaning: "Éxito profesional, reconocimiento, claridad en objetivos. Momento de brillar.",
    spiritualMeaning: "La iluminación alcanzada. El despertar de la conciencia a su máxima expresión.",
    symbols: {
      "sol": "La fuente de toda luz y vida",
      "niño": "El yo auténtico renovado",
      "caballo": "La libertad del espíritu",
      "girasoles": "La orientación natural hacia la luz"
    },
    examples: [
      "Un momento de éxito y celebración genuina",
      "La claridad que llega después de períodos oscuros",
      "Sentir la alegría pura de estar vivo"
    ]
  },
  {
    name: "El Juicio",
    shortName: "judgement",
    number: 20,
    position: 20,
    keywords: ["renacimiento", "llamado", "absolución", "despertar", "decisión final", "redención"],
    description: "El Juicio representa el llamado del alma hacia una nueva vida. Es el despertar de la conciencia, la rendición de cuentas final y la oportunidad de renacer completamente.",
    symbolism: [
      "El ángel con trompeta: llamado divino",
      "Los muertos que se levantan: resurrección",
      "La bandera: victoria espiritual",
      "Las montañas: altura alcanzada",
      "El mar: el inconsciente colectivo"
    ],
    uprightMeaning: "Renacimiento, llamado superior, absolución. Es momento de responder al llamado de tu alma. Una transformación profunda te invita a despertar.",
    reversedMeaning: "Resistencia al llamado, duda sobre el camino, necesidad de auto-perdón. Escucha la voz interior.",
    story: "La trompeta suena y los muertos se levantan de sus tumbas. No es juicio condenatorio, sino llamada a la vida nueva. Quien responde, renace.",
    lessons: ["El alma siempre llama", "El perdón libera", "Siempre hay oportunidad de renacer", "Responde al llamado"],
    questions: ["¿Qué llamado estás escuchando?", "¿Qué necesita renacer en ti?", "¿A qué necesitas perdonarte?"],
    loveMeaning: "Renacimiento de una relación, llamado a comprometerse, amor que resucita.",
    careerMeaning: "Llamado vocacional, transformación profesional, momento de decisiones trascendentales.",
    spiritualMeaning: "El despertar final. La resurrección del ser auténtico.",
    symbols: {
      "ángel": "El mensajero del despertar",
      "trompeta": "La llamada que no puede ignorarse",
      "muertos": "Los aspectos que resucitan transformados",
      "bandera": "La victoria del espíritu"
    },
    examples: [
      "Un llamado que cambia el rumbo de tu vida",
      "El momento de perdonarte y renacer",
      "Despertar a una nueva versión de ti mismo"
    ]
  },
  {
    name: "El Mundo",
    shortName: "world",
    number: 21,
    position: 21,
    keywords: ["completitud", "integración", "realización", "ciclo completo", "éxito total", "unión"],
    description: "El Mundo representa la culminación exitosa del viaje. Es la integración de todas las experiencias, la realización del ser completo y la celebración de un ciclo perfectamente cerrado.",
    symbolism: [
      "La figura en la guirnalda: el ser integrado",
      "La guirnalda de laurel: victoria y éxito",
      "Las cuatro figuras: los evangelistas y elementos",
      "La forma del huevo: renacimiento",
      "La cinta en forma de infinito: eternidad"
    ],
    uprightMeaning: "Completitud, éxito total, realización. Has llegado a donde debías llegar. Un ciclo se cierra con maestría y celebración.",
    reversedMeaning: "Falta de cierre, búsqueda de completitud, ciclo que necesita terminar. El final está cerca.",
    story: "En el centro de la guirnalda, la figura danza. Ha integrado todos los opuestos, ha recorrido todos los caminos. El viaje termina donde comenzó, pero ella es otra.",
    lessons: ["Todo ciclo tiene final", "La integración es el logro máximo", "Celebra lo completado", "El fin es el inicio"],
    questions: ["¿Qué ciclo está completándose?", "¿Qué has integrado en tu viaje?", "¿Cómo celebras tus logros?"],
    loveMeaning: "Relación completa y plena, amor maduro, unión que integra todas las experiencias.",
    careerMeaning: "Proyecto culminado, éxito profesional total, reconocimiento completo.",
    spiritualMeaning: "La unión con el Todo. La conciencia que se reconoce como el universo entero.",
    symbols: {
      "guirnalda": "El ciclo sagrado completado",
      "figura": "El ser que ha integrado todos sus aspectos",
      "cuatro figuras": "Los elementos y dimensiones dominados",
      "infinito": "Lo eterno que reconoce en lo finito"
    },
    examples: [
      "Completar un ciclo importante de tu vida",
      "Sentir que has llegado a donde debías",
      "Integrar todas tus experiencias en sabiduría"
    ]
  }
];

const minorArcanaSuits = [
  { suit: Suit.CUPS, element: Element.WATER, themes: "emociones, relaciones, intuición, creatividad emocional" },
  { suit: Suit.SWORDS, element: Element.AIR, themes: "pensamiento, conflicto, verdad, comunicación" },
  { suit: Suit.WANDS, element: Element.FIRE, themes: "acción, pasión, creatividad, energía" },
  { suit: Suit.PENTACLES, element: Element.EARTH, themes: "materia, dinero, cuerpo, naturaleza" }
];

const minorArcanaNumbers = [
  { number: 1, name: "As", keywords: ["nuevo comienzo", "potencial", "oportunidad", "semilla"] },
  { number: 2, name: "Dos", keywords: ["elección", "dilema", "equilibrio", "asociación"] },
  { number: 3, name: "Tres", keywords: ["creación", "colaboración", "expansión", "manifestación inicial"] },
  { number: 4, name: "Cuatro", keywords: ["estabilidad", "fundamento", "descanso", "estructura"] },
  { number: 5, name: "Cinco", keywords: ["cambio", "conflicto", "crisis", "transformación"] },
  { number: 6, name: "Seis", keywords: ["armonía", "comunicación", "balance", "transición"] },
  { number: 7, name: "Siete", keywords: ["evaluación", "elección espiritual", "reflexión", "visión"] },
  { number: 8, name: "Ocho", keywords: ["poder", "movimiento", "cambio rápido", "justicia"] },
  { number: 9, name: "Nueve", keywords: ["casi completo", "sabiduría", "culminación", "recompensa"] },
  { number: 10, name: "Diez", keywords: ["finalización", "pleno", "ciclo completo", "transformación final"] }
];

const courtCards = [
  { number: 11, name: "Sota", role: "mensajero, estudiante, nuevo enfoque", keywords: ["mensaje", "novedad", "curiosidad", "aprendizaje"] },
  { number: 12, name: "Caballo", role: "guerrero, buscador, acción", keywords: ["acción", "movimiento", "persecución", "caballería"] },
  { number: 13, name: "Reina", role: "emocional, intuitivo, nutridor", keywords: ["intuición", "cuidado", "poder interior", "madurez"] },
  { number: 14, name: "Rey", role: "maduro, dominante, control", keywords: ["autoridad", "dominio", "madurez", "control"] }
];

const suitDescriptions: Record<Suit, { name: string; realm: string; symbols: string[] }> = {
  [Suit.CUPS]: {
    name: "Copas",
    realm: "el mundo emocional, el amor, las relaciones, la intuición y la creatividad del corazón",
    symbols: ["agua", "corazón", "sentimientos", "relaciones", "sueños", "intuición"]
  },
  [Suit.SWORDS]: {
    name: "Espadas",
    realm: "el mundo mental, el pensamiento, la comunicación, el conflicto y la verdad",
    symbols: ["mente", "palabra", "conflicto", "verdad", "decisión", "claridad"]
  },
  [Suit.WANDS]: {
    name: "Bastos",
    realm: "el mundo de la acción, la pasión, la creatividad, la energía y la voluntad",
    symbols: ["fuego", "pasión", "energía", "acción", "creatividad", "inspiración"]
  },
  [Suit.PENTACLES]: {
    name: "Oros",
    realm: "el mundo material, el dinero, el cuerpo, la naturaleza y la abundancia física",
    symbols: ["tierra", "dinero", "cuerpo", "naturaleza", "abundancia", "seguridad"]
  },
  [Suit.MAJOR]: {
    name: "Mayores",
    realm: "",
    symbols: []
  }
};

function generateMinorArcanaCards() {
  const cards: any[] = [];
  let position = 22; // Start after Major Arcana

  for (const suitData of minorArcanaSuits) {
    const suitInfo = suitDescriptions[suitData.suit];
    
    // Numbered cards (1-10)
    for (const numData of minorArcanaNumbers) {
      const cardId = `${numData.number}${suitData.suit.charAt(0).toLowerCase()}`;
      const cardName = `${numData.name} de ${suitInfo.name}`;
      
      cards.push({
        name: cardName,
        shortName: cardId,
        cardType: CardType.MINOR_ARCANA,
        suit: suitData.suit,
        element: suitData.element,
        number: numData.number,
        position: position++,
        keywords: [...numData.keywords, ...suitInfo.symbols.slice(0, 2)],
        description: `El ${numData.name} de ${suitInfo.name} representa ${suitInfo.realm}. Esta carta habla de ${numData.keywords.join(', ')} en el contexto de ${suitData.themes}.`,
        symbolism: suitInfo.symbols.map(s => `El símbolo de ${s}`),
        uprightMeaning: `En posición upright, el ${cardName} indica ${numData.keywords.join(', ')} en el área de ${suitData.themes}. Es momento de atender estos aspectos.`,
        reversedMeaning: `En posición desafiante, el ${cardName} sugiere bloqueos o desafíos con ${numData.keywords[0]} en relación a ${suitData.themes}.`,
        story: `El ${numData.name} de ${suitInfo.name} aparece en el camino para enseñarnos sobre ${numData.keywords[0]}. Cada símbolo en la carta nos habla de ${suitInfo.realm}.`,
        lessons: numData.keywords.map(k => `Explorar ${k} en tu vida`),
        questions: [
          `¿Cómo se manifiesta ${numData.keywords[0]} en tu vida?`,
          `¿Qué necesitas entender sobre ${suitData.themes}?`,
          `¿Qué mensaje tiene el ${cardName} para ti?`
        ],
        loveMeaning: `En el amor, el ${cardName} habla de ${numData.keywords[0]} en las relaciones y los sentimientos.`,
        careerMeaning: `En el trabajo, el ${cardName} indica ${numData.keywords[0]} en tu desarrollo profesional.`,
        spiritualMeaning: `Espiritualmente, el ${cardName} invita a reflexionar sobre ${numData.keywords[0]} y ${suitData.themes}.`,
        symbols: suitInfo.symbols.reduce((acc, s) => ({ ...acc, [s]: `Representa ${s} en tu camino` }), {}),
        examples: [`Vivir ${numData.keywords[0]} en el contexto de ${suitData.themes}`]
      });
    }

    // Court cards
    for (const courtData of courtCards) {
      const cardId = `${courtData.number}${suitData.suit.charAt(0).toLowerCase()}`;
      const cardName = `${courtData.name} de ${suitInfo.name}`;
      
      cards.push({
        name: cardName,
        shortName: cardId,
        cardType: CardType.MINOR_ARCANA,
        suit: suitData.suit,
        element: suitData.element,
        number: courtData.number,
        position: position++,
        keywords: [...courtData.keywords, ...suitInfo.symbols.slice(0, 2)],
        description: `La ${courtData.name} de ${suitInfo.name} representa ${courtData.role} en ${suitInfo.realm}. Esta carta puede representar una persona o una energía en tu vida.`,
        symbolism: suitInfo.symbols.map(s => `El símbolo de ${s}`),
        uprightMeaning: `La ${cardName} indica ${courtData.role}. En el contexto de ${suitData.themes}, esta figura trae ${courtData.keywords.join(', ')}.`,
        reversedMeaning: `En posición desafiante, la ${cardName} sugiere aspectos sombra de ${courtData.role} o bloques en ${suitData.themes}.`,
        story: `La ${courtData.name} de ${suitInfo.name} entra en la lectura como ${courtData.role}. Trae consigo la energía de ${suitInfo.realm}.`,
        lessons: courtData.keywords.map(k => `Integrar ${k} en tu ser`),
        questions: [
          `¿Quién representa la ${courtData.name} de ${suitInfo.name} en tu vida?`,
          `¿Cómo puedes encarnar esta energía?`,
          `¿Qué mensaje tiene esta figura para ti?`
        ],
        loveMeaning: `En el amor, la ${cardName} puede representar a alguien o la energía de ${courtData.role} en la relación.`,
        careerMeaning: `En el trabajo, la ${cardName} indica ${courtData.role} en tu entorno profesional.`,
        spiritualMeaning: `Espiritualmente, la ${cardName} invita a explorar ${courtData.role} dentro de ti.`,
        symbols: suitInfo.symbols.reduce((acc, s) => ({ ...acc, [s]: `Representa ${s} y su poder` }), {}),
        examples: [`Encontrar la energía de ${courtData.name} en tu vida`]
      });
    }
  }

  return cards;
}

async function main() {
  console.log('🌱 Starting seed...');

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

  // Create Major Arcana cards
  console.log('🃏 Creating Major Arcana cards...');
  for (const card of majorArcanaCards) {
    await prisma.tarotCard.upsert({
      where: { shortName: card.shortName },
      update: {
        name: card.name,
        cardType: CardType.MAJOR_ARCANA,
        suit: Suit.MAJOR,
        element: Element.SPIRIT,
        number: card.number,
        position: card.position,
        keywords: card.keywords,
        description: card.description,
        symbolism: card.symbolism,
        uprightMeaning: card.uprightMeaning,
        reversedMeaning: card.reversedMeaning,
        story: card.story,
        lessons: card.lessons,
        questions: card.questions,
        loveMeaning: card.loveMeaning,
        careerMeaning: card.careerMeaning,
        spiritualMeaning: card.spiritualMeaning,
        symbols: card.symbols,
        examples: card.examples,
        isActive: true,
      },
      create: {
        name: card.name,
        shortName: card.shortName,
        cardType: CardType.MAJOR_ARCANA,
        suit: Suit.MAJOR,
        element: Element.SPIRIT,
        number: card.number,
        position: card.position,
        keywords: card.keywords,
        description: card.description,
        symbolism: card.symbolism,
        uprightMeaning: card.uprightMeaning,
        reversedMeaning: card.reversedMeaning,
        story: card.story,
        lessons: card.lessons,
        questions: card.questions,
        loveMeaning: card.loveMeaning,
        careerMeaning: card.careerMeaning,
        spiritualMeaning: card.spiritualMeaning,
        symbols: card.symbols,
        examples: card.examples,
        isActive: true,
      },
    });
  }
  console.log('✅ Major Arcana cards created');

  // Create Minor Arcana cards
  console.log('🃏 Creating Minor Arcana cards...');
  const minorCards = generateMinorArcanaCards();
  for (const card of minorCards) {
    await prisma.tarotCard.upsert({
      where: { shortName: card.shortName },
      update: {
        name: card.name,
        cardType: card.cardType,
        suit: card.suit,
        element: card.element,
        number: card.number,
        position: card.position,
        keywords: card.keywords,
        description: card.description,
        symbolism: card.symbolism,
        uprightMeaning: card.uprightMeaning,
        reversedMeaning: card.reversedMeaning,
        story: card.story,
        lessons: card.lessons,
        questions: card.questions,
        loveMeaning: card.loveMeaning,
        careerMeaning: card.careerMeaning,
        spiritualMeaning: card.spiritualMeaning,
        symbols: card.symbols,
        examples: card.examples,
        isActive: true,
      },
      create: {
        name: card.name,
        shortName: card.shortName,
        cardType: card.cardType,
        suit: card.suit,
        element: card.element,
        number: card.number,
        position: card.position,
        keywords: card.keywords,
        description: card.description,
        symbolism: card.symbolism,
        uprightMeaning: card.uprightMeaning,
        reversedMeaning: card.reversedMeaning,
        story: card.story,
        lessons: card.lessons,
        questions: card.questions,
        loveMeaning: card.loveMeaning,
        careerMeaning: card.careerMeaning,
        spiritualMeaning: card.spiritualMeaning,
        symbols: card.symbols,
        examples: card.examples,
        isActive: true,
      },
    });
  }
  console.log('✅ Minor Arcana cards created');

  // Create app settings
  await prisma.appSettings.upsert({
    where: { key: 'appName' },
    update: {},
    create: {
      key: 'appName',
      value: { value: 'Tarot Learning App' },
      description: 'Application name',
    },
  });

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
