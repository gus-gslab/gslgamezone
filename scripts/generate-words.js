#!/usr/bin/env node

/**
 * 🎯 Script de Geração de Palavras - GSL Game Zone
 * Gera automaticamente palavras expandidas para o jogo de caça-palavras
 */

// Base de palavras reais e corretas
const BASE_WORDS = {
  animals: {
    pt: [
      'GATO',
      'BOI',
      'RATO',
      'PATO',
      'URSO',
      'GALO',
      'CAO',
      'PORCO',
      'CAVALO',
      'VACA',
      'CARNEIRO',
      'COELHO',
      'PEIXE',
      'PASSARO',
      'CABRA',
      'OVELHA',
      'BURRO',
      'MACACO',
      'TIGRE',
      'LEAO',
      'ELEFANTE',
      'GIRAFA',
      'ZEBRA',
      'RAPOSA',
      'LOBINHO',
      'CORUJA',
      'AGUIA',
      'FALCAO',
      'POMBO',
      'ANDORINHA',
      'BORBOLETA',
    ],
    en: [
      'CAT',
      'DOG',
      'BIRD',
      'FISH',
      'BEAR',
      'DUCK',
      'FROG',
      'DEER',
      'FOX',
      'BEE',
      'ANT',
      'RAT',
      'BAT',
      'COW',
      'HORSE',
      'PIG',
      'SHEEP',
      'GOAT',
      'DONKEY',
      'MONKEY',
      'TIGER',
      'LION',
      'ELEPHANT',
      'GIRAFFE',
      'ZEBRA',
      'FOX',
      'WOLF',
      'OWL',
      'EAGLE',
      'HAWK',
      'PIGEON',
      'SWALLOW',
      'BUTTERFLY',
    ],
    es: [
      'GATO',
      'PERRO',
      'PAJARO',
      'PEZ',
      'OSO',
      'PATO',
      'RANA',
      'CIERVO',
      'ZORRO',
      'ABEJA',
      'HORMIGA',
      'RATA',
      'MURCIELAGO',
      'VACA',
      'CABALLO',
      'CERDO',
      'OVEJA',
      'CABRA',
      'BURRO',
      'MONO',
      'TIGRE',
      'LEON',
      'ELEFANTE',
      'JIRAFA',
      'CEBRA',
      'ZORRO',
      'LOBO',
      'BUHO',
      'AGUILA',
      'HALCON',
      'PALOMA',
      'GOLONDRINA',
      'MARIPOSA',
    ],
  },
  colors: {
    pt: [
      'AZUL',
      'ROSA',
      'ROXO',
      'CINZA',
      'OURO',
      'VERDE',
      'CORAL',
      'BEGE',
      'MARROM',
      'PRETO',
      'BRANCO',
      'AMARELO',
      'LARANJA',
      'VERMELHO',
      'VIOLETA',
      'INDIGO',
      'TURQUESA',
      'MAGENTA',
      'CIANO',
      'LILAS',
      'SALMAO',
      'CREME',
      'BORDÔ',
      'CARMIN',
      'ESCARLATE',
      'RUBI',
      'ESMERALDA',
      'JADE',
      'TURMALINA',
      'SAFIRA',
      'DIAMANTE',
    ],
    en: [
      'RED',
      'BLUE',
      'GREEN',
      'PINK',
      'GOLD',
      'GRAY',
      'BLACK',
      'WHITE',
      'BROWN',
      'BEIGE',
      'YELLOW',
      'ORANGE',
      'PURPLE',
      'VIOLET',
      'INDIGO',
      'TURQUOISE',
      'MAGENTA',
      'CYAN',
      'LAVENDER',
      'SALMON',
      'CREAM',
      'BURGUNDY',
      'CARMINE',
      'SCARLET',
      'RUBY',
      'EMERALD',
      'JADE',
      'TOURMALINE',
      'SAPPHIRE',
      'DIAMOND',
    ],
    es: [
      'ROJO',
      'AZUL',
      'VERDE',
      'ROSA',
      'ORO',
      'GRIS',
      'NEGRO',
      'BLANCO',
      'CAFE',
      'BEIGE',
      'AMARILLO',
      'NARANJA',
      'MORADO',
      'VIOLETA',
      'INDIGO',
      'TURQUESA',
      'MAGENTA',
      'CIAN',
      'LAVANDA',
      'SALMON',
      'CREMA',
      'BURGUNDY',
      'CARMESIN',
      'ESCARLATA',
      'RUBI',
      'ESMERALDA',
      'JADE',
      'TURMALINA',
      'ZAFIRO',
      'DIAMANTE',
    ],
  },
  foods: {
    pt: [
      'MACA',
      'BOLO',
      'SOPA',
      'OVO',
      'MEL',
      'SAL',
      'ACUCAR',
      'ARROZ',
      'FEIJAO',
      'PEIXE',
      'CARNE',
      'PAO',
      'QUEIJO',
      'BANANA',
      'LARANJA',
      'UVA',
      'PERA',
      'MORANGO',
      'ABACAXI',
      'MELANCIA',
      'MAMAO',
      'GOIABA',
      'MANGA',
      'ABACATE',
      'LIMÃO',
      'TANGERINA',
      'PESSEGO',
      'AMEIXA',
      'CEREJA',
      'FRAMBOESA',
    ],
    en: [
      'APPLE',
      'BREAD',
      'EGG',
      'CAKE',
      'SOUP',
      'RICE',
      'FISH',
      'MEAT',
      'CORN',
      'BEANS',
      'PASTA',
      'CHEESE',
      'BANANA',
      'ORANGE',
      'GRAPE',
      'PEAR',
      'STRAWBERRY',
      'PINEAPPLE',
      'WATERMELON',
      'PAPAYA',
      'GUAVA',
      'MANGO',
      'AVOCADO',
      'LEMON',
      'TANGERINE',
      'PEACH',
      'PLUM',
      'CHERRY',
      'RASPBERRY',
      'BLUEBERRY',
    ],
    es: [
      'MANZANA',
      'PAN',
      'HUEVO',
      'PASTEL',
      'SOPA',
      'ARROZ',
      'PESCADO',
      'CARNE',
      'MAIZ',
      'QUESO',
      'PLATANO',
      'NARANJA',
      'UVA',
      'PERA',
      'FRESA',
      'PINA',
      'SANDIA',
      'PAPAYA',
      'GUAYABA',
      'MANGO',
      'AGUACATE',
      'LIMON',
      'MANDARINA',
      'MELOCOTON',
      'CIRUELA',
      'CEREZA',
      'FRAMBUESA',
      'ARANDANO',
      'MORA',
      'KIWI',
    ],
  },
  technology: {
    pt: [
      'COMPUTADOR',
      'TELEFONE',
      'INTERNET',
      'EMAIL',
      'SITE',
      'PROGRAMA',
      'ARQUIVO',
      'DADOS',
      'REDE',
      'SISTEMA',
      'CODIGO',
      'SENHA',
      'LOGIN',
      'SMARTPHONE',
      'TABLET',
      'LAPTOP',
      'NOTEBOOK',
      'DESKTOP',
      'SERVIDOR',
      'ROTEADOR',
      'MODEM',
      'CABO',
      'WIFI',
      'BLUETOOTH',
      'USB',
      'HDMI',
      'MONITOR',
      'TECLADO',
      'MOUSE',
      'IMPRESSORA',
    ],
    en: [
      'COMPUTER',
      'PHONE',
      'INTERNET',
      'EMAIL',
      'WEBSITE',
      'PROGRAM',
      'FILE',
      'DATA',
      'NETWORK',
      'SYSTEM',
      'CODE',
      'PASSWORD',
      'LOGIN',
      'SMARTPHONE',
      'TABLET',
      'LAPTOP',
      'NOTEBOOK',
      'DESKTOP',
      'SERVER',
      'ROUTER',
      'MODEM',
      'CABLE',
      'WIFI',
      'BLUETOOTH',
      'USB',
      'HDMI',
      'MONITOR',
      'KEYBOARD',
      'MOUSE',
      'PRINTER',
    ],
    es: [
      'COMPUTADORA',
      'TELEFONO',
      'INTERNET',
      'CORREO',
      'SITIO_WEB',
      'PROGRAMA',
      'ARCHIVO',
      'DATOS',
      'RED',
      'SISTEMA',
      'CODIGO',
      'CONTRASEÑA',
      'INICIO_SESION',
      'SMARTPHONE',
      'TABLET',
      'LAPTOP',
      'NOTEBOOK',
      'DESKTOP',
      'SERVIDOR',
      'ENRUTADOR',
      'MODEM',
      'CABLE',
      'WIFI',
      'BLUETOOTH',
      'USB',
      'HDMI',
      'MONITOR',
      'TECLADO',
      'RATON',
      'IMPRESORA',
    ],
  },
  professions: {
    pt: [
      'MEDICO',
      'PROFESSOR',
      'ENGENHEIRO',
      'ADVOGADO',
      'DENTISTA',
      'VETERINARIO',
      'ARQUITETO',
      'FARMACEUTICO',
      'ENFERMEIRO',
      'PSICOLOGO',
      'PEDAGOGO',
      'FISIOTERAPEUTA',
      'FONOAUDIOLOGO',
      'TERAPEUTA_OCUPACIONAL',
      'NUTRICIONISTA',
      'BIOQUIMICO',
      'BIOLOGO',
      'QUIMICO',
      'FISICO',
      'MATEMATICO',
      'ESTATISTICO',
      'ECONOMISTA',
      'ADMINISTRADOR',
      'CONTADOR',
      'AUDITOR',
      'ANALISTA',
      'PROGRAMADOR',
      'DESENVOLVEDOR',
      'ANALISTA_DE_SISTEMAS',
      'ADMINISTRADOR_DE_REDES',
      'TECNICO_DE_INFORMATICA',
    ],
    en: [
      'DOCTOR',
      'TEACHER',
      'ENGINEER',
      'LAWYER',
      'DENTIST',
      'VETERINARIAN',
      'ARCHITECT',
      'PHARMACIST',
      'NURSE',
      'PSYCHOLOGIST',
      'PEDAGOGUE',
      'PHYSIOTHERAPIST',
      'SPEECH_THERAPIST',
      'OCCUPATIONAL_THERAPIST',
      'NUTRITIONIST',
      'BIOCHEMIST',
      'BIOLOGIST',
      'CHEMIST',
      'PHYSICIST',
      'MATHEMATICIAN',
      'STATISTICIAN',
      'ECONOMIST',
      'ADMINISTRATOR',
      'ACCOUNTANT',
      'AUDITOR',
      'ANALYST',
      'PROGRAMMER',
      'DEVELOPER',
      'SYSTEMS_ANALYST',
      'NETWORK_ADMINISTRATOR',
      'IT_TECHNICIAN',
    ],
    es: [
      'MEDICO',
      'PROFESOR',
      'INGENIERO',
      'ABOGADO',
      'DENTISTA',
      'VETERINARIO',
      'ARQUITECTO',
      'FARMACEUTICO',
      'ENFERMERO',
      'PSICOLOGO',
      'PEDAGOGO',
      'FISIOTERAPEUTA',
      'FONOAUDIOLOGO',
      'TERAPEUTA_OCUPACIONAL',
      'NUTRICIONISTA',
      'BIOQUIMICO',
      'BIOLOGO',
      'QUIMICO',
      'FISICO',
      'MATEMATICO',
      'ESTADISTICO',
      'ECONOMISTA',
      'ADMINISTRADOR',
      'CONTADOR',
      'AUDITOR',
      'ANALISTA',
      'PROGRAMADOR',
      'DESARROLLADOR',
      'ANALISTA_DE_SISTEMAS',
      'ADMINISTRADOR_DE_REDES',
      'TECNICO_DE_INFORMATICA',
    ],
  },
  sports: {
    pt: [
      'FUTEBOL',
      'BASQUETE',
      'TENIS',
      'NATACAO',
      'VOLEI',
      'ATLETISMO',
      'GINASTICA',
      'SURF',
      'SKATE',
      'CICLISMO',
      'HANDEBOL',
      'RUGBY',
      'BADMINTON',
      'SQUASH',
      'ESGRIMA',
      'TIRO',
      'CANOAGEM',
      'REMO',
      'TRIATLO',
      'MARATONA',
      'CORRIDA',
      'SALTO',
      'LANÇAMENTO',
      'ARREMESSO',
      'DARDOS',
      'BOLICHE',
      'SINUCA',
      'BILHAR',
      'PING_PONG',
      'TENIS_MESA',
    ],
    en: [
      'FOOTBALL',
      'BASKETBALL',
      'TENNIS',
      'SWIMMING',
      'VOLLEYBALL',
      'ATHLETICS',
      'GYMNASTICS',
      'SURFING',
      'SKATEBOARDING',
      'CYCLING',
      'HANDBALL',
      'RUGBY',
      'BADMINTON',
      'SQUASH',
      'FENCING',
      'SHOOTING',
      'CANOEING',
      'ROWING',
      'TRIATHLON',
      'MARATHON',
      'RUNNING',
      'JUMPING',
      'THROWING',
      'DARTS',
      'BOWLING',
      'SNOOKER',
      'BILLIARDS',
      'PING_PONG',
      'TABLE_TENNIS',
    ],
    es: [
      'FUTBOL',
      'BALONCESTO',
      'TENIS',
      'NATACION',
      'VOLEIBOL',
      'ATLETISMO',
      'GIMNASIA',
      'SURF',
      'SKATE',
      'CICLISMO',
      'BALONMANO',
      'RUGBY',
      'BADMINTON',
      'SQUASH',
      'ESGRIMA',
      'TIRO',
      'CANOTAJE',
      'REMO',
      'TRIATLON',
      'MARATON',
      'CARRERA',
      'SALTO',
      'LANZAMIENTO',
      'DARDO',
      'BOLICHE',
      'SINUCA',
      'BILLAR',
      'PING_PONG',
      'TENIS_MESA',
    ],
  },
  music: {
    pt: [
      'PIANO',
      'VIOLAO',
      'BATERIA',
      'FLAUTA',
      'SAXOFONE',
      'TROMPETE',
      'CLARINETE',
      'HARPA',
      'ACORDEAO',
      'TECLADO',
      'VIOLINO',
      'VIOLA',
      'VIOLONCELO',
      'CONTRABAIXO',
      'TROMBONE',
      'TUBA',
      'FAGOTE',
      'OBOE',
      'CORNO',
      'TIMPANI',
      'TRIANGULO',
      'XILOFONE',
      'VIBRAFONE',
      'MARIMBA',
      'GLOCKENSPIEL',
      'CELESTA',
      'ORGÃO',
      'SINTETIZADOR',
      'GUITARRA_ELETRICA',
      'BAIXO_ELETRICO',
    ],
    en: [
      'PIANO',
      'GUITAR',
      'DRUMS',
      'FLUTE',
      'SAXOPHONE',
      'TRUMPET',
      'CLARINET',
      'HARP',
      'ACCORDION',
      'KEYBOARD',
      'VIOLIN',
      'VIOLA',
      'CELLO',
      'DOUBLE_BASS',
      'TROMBONE',
      'TUBA',
      'BASSOON',
      'OBOE',
      'FRENCH_HORN',
      'TIMPANI',
      'TRIANGLE',
      'XYLOPHONE',
      'VIBRAPHONE',
      'MARIMBA',
      'GLOCKENSPIEL',
      'CELESTA',
      'ORGAN',
      'SYNTHESIZER',
      'ELECTRIC_GUITAR',
      'ELECTRIC_BASS',
    ],
    es: [
      'PIANO',
      'GUITARRA',
      'BATERIA',
      'FLAUTA',
      'SAXOFON',
      'TROMPETA',
      'CLARINETE',
      'ARPA',
      'ACORDEON',
      'TECLADO',
      'VIOLIN',
      'VIOLA',
      'VIOLONCHELO',
      'CONTRABAJO',
      'TROMBON',
      'TUBA',
      'FAGOT',
      'OBOE',
      'CORNO',
      'TIMPANI',
      'TRIANGULO',
      'XILOFONO',
      'VIBRAFONO',
      'MARIMBA',
      'GLOCKENSPIEL',
      'CELESTA',
      'ORGANO',
      'SINTETIZADOR',
      'GUITARRA_ELECTRICA',
      'BAJO_ELECTRICO',
    ],
  },
  nature: {
    pt: [
      'ARVORE',
      'FLOR',
      'MONTANHA',
      'RIO',
      'OCEANO',
      'FLORESTA',
      'PRAIA',
      'DESERTO',
      'CACHOEIRA',
      'VULCAO',
      'LAGO',
      'LAGOA',
      'CASCATA',
      'SERRA',
      'COLINA',
      'VALLE',
      'CANION',
      'CAVERNA',
      'GRUTA',
      'BURACO',
      'FOSSA',
      'ABISMO',
      'PRECIPICIO',
      'PENHASCO',
      'ROCHA',
      'PEDRA',
      'AREIA',
      'TERRA',
      'BARRO',
      'ARGILA',
    ],
    en: [
      'TREE',
      'FLOWER',
      'MOUNTAIN',
      'RIVER',
      'OCEAN',
      'FOREST',
      'BEACH',
      'DESERT',
      'WATERFALL',
      'VOLCANO',
      'LAKE',
      'LAGOON',
      'CASCADE',
      'RANGE',
      'HILL',
      'VALLEY',
      'CANYON',
      'CAVE',
      'GROTTO',
      'HOLE',
      'PIT',
      'ABYSS',
      'PRECIPICE',
      'CLIFF',
      'ROCK',
      'STONE',
      'SAND',
      'EARTH',
      'CLAY',
      'MUD',
    ],
    es: [
      'ARBOL',
      'FLOR',
      'MONTAÑA',
      'RIO',
      'OCEANO',
      'BOSQUE',
      'PLAYA',
      'DESIERTO',
      'CASCADA',
      'VOLCAN',
      'LAGO',
      'LAGUNA',
      'CASCADA',
      'SIERRA',
      'COLINA',
      'VALLE',
      'CANON',
      'CUEVA',
      'GRUTA',
      'AGUJERO',
      'FOSA',
      'ABISMO',
      'PRECIPICIO',
      'ACANTILADO',
      'ROCA',
      'PIEDRA',
      'ARENA',
      'TIERRA',
      'ARCILLA',
      'BARRO',
    ],
  },
};

// Variações inteligentes para expandir palavras
const VARIATIONS = {
  size: ['_PEQUENO', '_GRANDE', '_MEDIO', '_MINI', '_MAXI'],
  intensity: ['_CLARO', '_ESCURO', '_FORTE', '_SUAVE', '_INTENSO'],
  type: ['_NATURAL', '_ARTIFICIAL', '_ELETRICO', '_ACUSTICO', '_DIGITAL'],
  color: ['_AZUL', '_VERMELHO', '_VERDE', '_AMARELO', '_ROXO'],
  material: ['_MADEIRA', '_METAL', '_PLASTICO', '_VIDRO', '_CERAMICA'],
};

// Função para gerar variações de uma palavra
function generateVariations(word, language) {
  const variations = [word];

  // Variações específicas por idioma
  if (language === 'pt') {
    if (word.includes('GATO')) {
      variations.push('GATINHO', 'GATÃO', 'GATUCHO', 'FELINO');
    }
    if (word.includes('AZUL')) {
      variations.push('AZUL_CLARO', 'AZUL_ESCURO', 'AZUL_MARINHO', 'AZUL_CEU');
    }
    if (word.includes('PIANO')) {
      variations.push('PIANO_ELETRICO', 'PIANO_ACUSTICO', 'PIANO_DIGITAL');
    }
    if (word.includes('COMPUTADOR')) {
      variations.push(
        'COMPUTADOR_PESSOAL',
        'COMPUTADOR_PORTATIL',
        'COMPUTADOR_DESKTOP'
      );
    }
    if (word.includes('MEDICO')) {
      variations.push(
        'MEDICO_GERAL',
        'MEDICO_ESPECIALISTA',
        'MEDICO_RESIDENTE'
      );
    }
  } else if (language === 'en') {
    if (word.includes('CAT')) {
      variations.push('KITTEN', 'KITTY', 'FELINE', 'TOMCAT');
    }
    if (word.includes('BLUE')) {
      variations.push('BLUE_LIGHT', 'BLUE_DARK', 'BLUE_NAVY', 'BLUE_SKY');
    }
    if (word.includes('PIANO')) {
      variations.push('PIANO_ELECTRIC', 'PIANO_ACOUSTIC', 'PIANO_DIGITAL');
    }
    if (word.includes('COMPUTER')) {
      variations.push(
        'COMPUTER_PERSONAL',
        'COMPUTER_LAPTOP',
        'COMPUTER_DESKTOP'
      );
    }
    if (word.includes('DOCTOR')) {
      variations.push('DOCTOR_GENERAL', 'DOCTOR_SPECIALIST', 'DOCTOR_RESIDENT');
    }
  } else if (language === 'es') {
    if (word.includes('GATO')) {
      variations.push('GATITO', 'GATON', 'FELINO', 'MININO');
    }
    if (word.includes('AZUL')) {
      variations.push('AZUL_CLARO', 'AZUL_OSCURO', 'AZUL_MARINO', 'AZUL_CIELO');
    }
    if (word.includes('PIANO')) {
      variations.push('PIANO_ELECTRICO', 'PIANO_ACUSTICO', 'PIANO_DIGITAL');
    }
    if (word.includes('COMPUTADORA')) {
      variations.push(
        'COMPUTADORA_PERSONAL',
        'COMPUTADORA_PORTATIL',
        'COMPUTADORA_ESCRITORIO'
      );
    }
    if (word.includes('MEDICO')) {
      variations.push(
        'MEDICO_GENERAL',
        'MEDICO_ESPECIALISTA',
        'MEDICO_RESIDENTE'
      );
    }
  }

  // Variações gerais
  variations.push(word + '_NOVO', word + '_VELHO', word + '_MODERNO');

  return [...new Set(variations)].slice(0, 8); // Limitar a 8 variações por palavra
}

// Função para expandir categoria para 30+ palavras
function expandCategory(baseWords, language) {
  const expanded = [];

  // Adicionar palavras base
  expanded.push(...baseWords);

  // Adicionar palavras relacionadas e variações
  if (language === 'pt') {
    if (baseWords.includes('GATO')) {
      expanded.push(
        'GATINHO',
        'GATÃO',
        'GATUCHO',
        'FELINO',
        'MIAU',
        'BIGODE',
        'CAUDA',
        'PATAS'
      );
    }
    if (baseWords.includes('AZUL')) {
      expanded.push(
        'AZUL_CLARO',
        'AZUL_ESCURO',
        'AZUL_MARINHO',
        'AZUL_CEU',
        'CIANO',
        'TURQUESA',
        'INDIGO',
        'SAFIRA'
      );
    }
    if (baseWords.includes('PIANO')) {
      expanded.push(
        'PIANO_ELETRICO',
        'PIANO_ACUSTICO',
        'PIANO_DIGITAL',
        'TECLADO',
        'ORGAO'
      );
    }
    if (baseWords.includes('COMPUTADOR')) {
      expanded.push(
        'COMPUTADOR_PESSOAL',
        'COMPUTADOR_PORTATIL',
        'COMPUTADOR_DESKTOP',
        'LAPTOP',
        'NOTEBOOK'
      );
    }
    if (baseWords.includes('MEDICO')) {
      expanded.push(
        'MEDICO_GERAL',
        'MEDICO_ESPECIALISTA',
        'MEDICO_RESIDENTE',
        'CLINICO',
        'CIRURGIAO'
      );
    }
  } else if (language === 'en') {
    if (baseWords.includes('CAT')) {
      expanded.push(
        'KITTEN',
        'KITTY',
        'FELINE',
        'TOMCAT',
        'MEOW',
        'WHISKERS',
        'TAIL',
        'PAWS'
      );
    }
    if (baseWords.includes('BLUE')) {
      expanded.push(
        'BLUE_LIGHT',
        'BLUE_DARK',
        'BLUE_NAVY',
        'BLUE_SKY',
        'CYAN',
        'TURQUOISE',
        'INDIGO',
        'SAPPHIRE'
      );
    }
    if (baseWords.includes('PIANO')) {
      expanded.push(
        'PIANO_ELECTRIC',
        'PIANO_ACOUSTIC',
        'PIANO_DIGITAL',
        'KEYBOARD',
        'ORGAN'
      );
    }
    if (baseWords.includes('COMPUTER')) {
      expanded.push(
        'COMPUTER_PERSONAL',
        'COMPUTER_LAPTOP',
        'COMPUTER_DESKTOP',
        'LAPTOP',
        'NOTEBOOK'
      );
    }
    if (baseWords.includes('DOCTOR')) {
      expanded.push(
        'DOCTOR_GENERAL',
        'DOCTOR_SPECIALIST',
        'DOCTOR_RESIDENT',
        'PHYSICIAN',
        'SURGEON'
      );
    }
  } else if (language === 'es') {
    if (baseWords.includes('GATO')) {
      expanded.push(
        'GATITO',
        'GATON',
        'FELINO',
        'MININO',
        'MIAU',
        'BIGOTES',
        'COLA',
        'PATAS'
      );
    }
    if (baseWords.includes('AZUL')) {
      expanded.push(
        'AZUL_CLARO',
        'AZUL_OSCURO',
        'AZUL_MARINO',
        'AZUL_CIELO',
        'CIAN',
        'TURQUESA',
        'INDIGO',
        'ZAFIRO'
      );
    }
    if (baseWords.includes('PIANO')) {
      expanded.push(
        'PIANO_ELECTRICO',
        'PIANO_ACUSTICO',
        'PIANO_DIGITAL',
        'TECLADO',
        'ORGANO'
      );
    }
    if (baseWords.includes('COMPUTADORA')) {
      expanded.push(
        'COMPUTADORA_PERSONAL',
        'COMPUTADORA_PORTATIL',
        'COMPUTADORA_ESCRITORIO',
        'LAPTOP',
        'NOTEBOOK'
      );
    }
    if (baseWords.includes('MEDICO')) {
      expanded.push(
        'MEDICO_GENERAL',
        'MEDICO_ESPECIALISTA',
        'MEDICO_RESIDENTE',
        'CLINICO',
        'CIRUJANO'
      );
    }
  }

  // Remover duplicatas e limitar a 50 palavras
  const result = [...new Set(expanded)].slice(0, 50);

  return result;
}

// Função principal para gerar todas as categorias
function generateAllCategories() {
  const result = {};

  ['pt', 'en', 'es'].forEach(language => {
    result[language] = {
      easy: {},
      medium: {},
      hard: {},
    };

    Object.keys(BASE_WORDS).forEach(category => {
      const baseWords = BASE_WORDS[category][language];

      // Easy: palavras simples
      result[language].easy[category] = expandCategory(baseWords, language);

      // Medium: palavras mais complexas
      result[language].medium[category] = expandCategory(
        baseWords,
        language
      ).map(word => (word.length > 4 ? word : word + '_COMPLEXO'));

      // Hard: palavras muito complexas
      result[language].hard[category] = expandCategory(baseWords, language).map(
        word => (word.length > 6 ? word : word + '_MUITO_COMPLEXO')
      );
    });
  });

  return result;
}

// Função para formatar como JavaScript
function formatAsJavaScript(categories) {
  let output = 'const WORD_CATALOGS = {\n';

  Object.keys(categories).forEach(language => {
    output += `  ${language}: {\n`;

    ['easy', 'medium', 'hard'].forEach(difficulty => {
      output += `    ${difficulty}: {\n`;

      Object.keys(categories[language][difficulty]).forEach(category => {
        const words = categories[language][difficulty][category];
        output += `      ${category}: [\n`;
        words.forEach(word => {
          output += `        '${word}',\n`;
        });
        output += `      ],\n`;
      });

      output += `    },\n`;
    });

    output += `  },\n`;
  });

  output += '};\n';
  return output;
}

// Executar o script
console.log('🎯 Gerando palavras expandidas...\n');

const expandedCategories = generateAllCategories();
const jsOutput = formatAsJavaScript(expandedCategories);

// Salvar em arquivo
import fs from 'fs';
fs.writeFileSync('expanded-words.js', jsOutput);

console.log('✅ Palavras geradas com sucesso!');
console.log('📁 Arquivo salvo como: expanded-words.js');
console.log('\n📊 Estatísticas:');
console.log('- Idiomas: 3 (pt, en, es)');
console.log('- Dificuldades: 3 (easy, medium, hard)');
console.log('- Categorias: 8 por idioma');
console.log('- Palavras: ~30 por categoria');
console.log('- Total: ~2.160 palavras');

// Mostrar exemplo
console.log('\n📝 Exemplo de saída:');
console.log(jsOutput.substring(0, 500) + '...');
