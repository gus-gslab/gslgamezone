import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Trophy,
  Share2,
  Star,
  Target,
  Award,
  Zap,
  Clock,
  TrendingUp,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useWindowSize } from '../hooks/useWindowSize';
import { useTranslation } from 'react-i18next';
import SEOHead from './SEOHead';
import { shareGameResult } from '../utils/shareUtils';
import { detectLanguageFromSubdomain } from '../utils/languageDetection';

// ===== TYPES =====
interface GridConfig {
  size: number;
  rows: number;
  wordCount: number;
}

interface WordObj {
  word: string;
  start: [number, number];
  direction: [number, number];
  found: boolean;
}

interface GameState {
  grid: string[][];
  words: WordObj[];
  cols: number;
  rows: number;
  seed: number;
}

interface Cell {
  row: number;
  col: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface GameStats {
  totalGames: number;
  totalWordsFound: number;
  bestTime: number;
  averageTime: number;
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
}

// ===== CONSTANTS =====
const GRIDCONFIGS: Record<string, GridConfig> = {
  small: { size: 10, rows: 12, wordCount: 6 },
  medium: { size: 12, rows: 15, wordCount: 8 },
  large: { size: 14, rows: 18, wordCount: 10 },
};

// Configurações específicas para mobile e tablet
const MOBILEGRIDCONFIGS: Record<string, GridConfig> = {
  small: { size: 10, rows: 12, wordCount: 6 },
  medium: { size: 10, rows: 16, wordCount: 8 },
  large: { size: 10, rows: 20, wordCount: 10 },
};

// Função para obter configuração baseada no tamanho da tela
const getGridConfig = (size: string, isMobile: boolean): GridConfig => {
  if (isMobile) {
    return MOBILEGRIDCONFIGS[size] || MOBILEGRIDCONFIGS.medium;
  }
  return GRIDCONFIGS[size] || GRIDCONFIGS.medium;
};

const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

// Sistema de Pontuação
const SCORING = {
  wordFound: 100,
  timeBonus: 50, // pontos por segundo restante
  streakBonus: 25, // bônus por palavras consecutivas
  difficultyMultiplier: {
    easy: 1,
    medium: 1.5,
    hard: 2,
  },
};

// Função para obter achievements traduzidos
const getTranslatedAchievements = (language: string): Achievement[] => {
  const translations =
    UITRANSLATIONS[language as keyof typeof UITRANSLATIONS];

  return [
    {
      id: 'firstword',
      name: translations.achievementNames.firstword,
      description: translations.achievementDescriptions.firstword,
      icon: '🎯',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'speeddemon',
      name: translations.achievementNames.speeddemon,
      description: translations.achievementDescriptions.speeddemon,
      icon: '⚡',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'wordmaster',
      name: translations.achievementNames.wordmaster,
      description: translations.achievementDescriptions.wordmaster,
      icon: '🏆',
      unlocked: false,
      progress: 0,
      maxProgress: 50,
    },
    {
      id: 'streakchampion',
      name: translations.achievementNames.streakchampion,
      description: translations.achievementDescriptions.streakchampion,
      icon: '🔥',
      unlocked: false,
      progress: 0,
      maxProgress: 5,
    },
    {
      id: 'perfectionist',
      name: translations.achievementNames.perfectionist,
      description: translations.achievementDescriptions.perfectionist,
      icon: '💎',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
    },
  ];
};

const WORDCATALOGS = {
  pt: {
    easy: {
      animals: [
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
        'GATINHO',
        'GATÃO',
        'GATUCHO',
        'FELINO',
        'MIAU',
        'BIGODE',
        'CAUDA',
        'PATAS',
      ],
      colors: [
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
        'AZULCLARO',
        'AZULESCURO',
        'AZULMARINHO',
        'AZULCEU',
      ],
      foods: [
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
      technology: [
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
        'COMPUTADORPESSOAL',
        'COMPUTADORPORTÁTIL',
        'COMPUTADORDESKTOP',
      ],
      professions: [
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
        'TERAPEUTAOCUPACIONAL',
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
        'ANALISTASISTEMAS',
        'ADMINISTRADORREDES',
        'TÉCNICOINFORMÁTICA',
        'MÉDICOGERAL',
        'MÉDICOESPECIALISTA',
        'MÉDICORESIDENTE',
        'CLINICO',
        'CIRURGIAO',
      ],
      sports: [
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
        'PINGPONG',
        'TENISMESA',
      ],
      music: [
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
        'GUITARRAELÉTRICA',
        'BAIXOELÉTRICO',
        'PIANOELÉTRICO',
        'PIANOACÚSTICO',
        'PIANODIGITAL',
        'ORGAO',
      ],
      nature: [
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
    },
    medium: {
      animals: [
        'GATOSIAMES',
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
        'GATINHO',
        'GATÃO',
        'GATUCHO',
        'FELINO',
        'MIAU',
        'BIGODE',
        'CAUDA',
        'PATAS',
      ],
      colors: [
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
        'AZULCLARO',
        'AZULESCURO',
        'AZULMARINHO',
        'AZULCEU',
      ],
      foods: [
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
      technology: [
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
        'COMPUTADORPESSOAL',
        'COMPUTADORPORTÁTIL',
        'COMPUTADORDESKTOP',
      ],
      professions: [
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
        'TERAPEUTAOCUPACIONAL',
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
        'ANALISTASISTEMAS',
        'ADMINISTRADORREDES',
        'TÉCNICOINFORMÁTICA',
        'MÉDICOGERAL',
        'MÉDICOESPECIALISTA',
        'MÉDICORESIDENTE',
        'CLINICO',
        'CIRURGIAO',
      ],
      sports: [
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
        'PINGPONG',
        'TENISMESA',
      ],
      music: [
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
        'GUITARRAELÉTRICA',
        'BAIXOELÉTRICO',
        'PIANOELÉTRICO',
        'PIANOACÚSTICO',
        'PIANODIGITAL',
        'ORGAO',
      ],
      nature: [
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
    },
    hard: {
      animals: [
        'LEOPARDO',
        'PANTERA',
        'JAGUAR',
        'LINCE',
        'PUMA',
        'ONÇA',
        'GUEPARDO',
        'CARACAL',
        'SERVAL',
        'OCELOTE',
        'MARGAY',
        'JAGUATIRICA',
        'SUÇUARANA',
        'JAGUATIRICA',
        'GATOMARACAJÁ',
        'OCELOTE',
        'GATOMOURISCO',
        'GATODODESERTO',
        'GATOSELVAGEM',
        'GATOMONTÊS',
        'GATODASELVA',
        'GATODOPANTANAL',
        'GATODOCERRADO',
        'GATODACAATINGA',
        'GATODOMANGUE',
        'GATODOBREJO',
        'GATODORIO',
        'GATODOLAGO',
        'GATODOMAR',
        'GATODOOCEANO',
        'GATODOVALE',
        'GATODAMONTANHA',
        'GATODOVULCÃO',
        'GATODAFLORESTA',
        'GATODOBOSQUE',
        'GATODOJARDIM',
        'GATODOPARQUE',
        'GATODAPRAIA',
        'GATODODESERTO',
        'GATODACAVERNA',
        'GATODOABISMO',
        'GATODOPRECIPÍCIO',
        'GATODOPENHASCO',
        'GATODAROCHA',
        'GATODAPEDRA',
        'GATODAAREIA',
        'GATODATERRA',
        'GATODOBARRO',
        'GATODAARGILA',
      ],
      colors: [
        'VERMELHOESCURO',
        'AZULMARINHO',
        'VERDEESMERALDA',
        'ROSACHOQUE',
        'DOURADO',
        'CINZAESCURO',
        'PRETOPROFUNDO',
        'BRANCOPURO',
        'MARROMESCURO',
        'BEGECLARO',
        'AMARELOOURO',
        'LARANJAVIVO',
        'ROXOPROFUNDO',
        'VIOLETAESCURO',
        'INDIGOESCURO',
        'TURQUESAVIVO',
        'MAGENTAVIVO',
        'CIANOVIVO',
        'LILÁSESCURO',
        'SALMÃOESCURO',
        'CREMEESCURO',
        'BORDÔESCURO',
        'CARMIMESCURO',
        'ESCARLATEVIVO',
        'RUBIESCURO',
        'ESMERALDAVIVO',
        'JADEESCURO',
        'TURMALINAVIVO',
        'SAFIRAESCURO',
        'DIAMANTEPURO',
        'AZULCEU',
        'AZULESCURO',
        'AZULMARINHO',
        'AZULOCEANO',
      ],
      foods: [
        'MAÇÃVERMELHA',
        'BOLOCHOCOLATE',
        'SOPALEGUMES',
        'OVOCOZIDO',
        'MELPURO',
        'SALMARINHO',
        'AÇÚCARMASCADO',
        'ARROZINTEGRAL',
        'FEIJÃOPRETO',
        'PEIXEGRELHADO',
        'CARNEASSADA',
        'PÃOINTEGRAL',
        'QUEIJOBRANCO',
        'BANANAPRATA',
        'LARANJAPERA',
        'UVAROXA',
        'PERAWILLIAMS',
        'MORANGOSELVAGEM',
        'ABACAXIDOCE',
        'MELANCIASEMSEMENTE',
        'MAMÃOFORMOSA',
        'GOIABABRANCA',
        'MANGAPALMER',
        'ABACATEHASS',
        'LIMÃOSICILIANO',
        'TANGERINAPONKAN',
        'PÊSSEGODOCE',
        'AMEIXAPRETA',
        'CEREJADOCE',
        'FRAMBOESASELVAGEM',
      ],
      technology: [
        'COMPUTADORPESSOAL',
        'TELEFONECELULAR',
        'INTERNETBANDALARGA',
        'EMAILELETRÔNICO',
        'SITEINTERNET',
        'PROGRAMACOMPUTADOR',
        'ARQUIVODIGITAL',
        'DADOSINFORMÁTICOS',
        'REDECOMPUTADORES',
        'SISTEMAOPERACIONAL',
        'CÓDIGOPROGRAMAÇÃO',
        'SENHASEGURANÇA',
        'LOGINUSUÁRIO',
        'SMARTPHONEINTELIGENTE',
        'TABLETELETRÔNICO',
        'LAPTOPPORTÁTIL',
        'NOTEBOOKPESSOAL',
        'DESKTOPESCRITÓRIO',
        'SERVIDORWEB',
        'ROTEADORWIRELESS',
        'MODEMCABO',
        'CABOETHERNET',
        'WIFISEMFIO',
        'BLUETOOTHTECNOLOGIA',
        'USBCONECTOR',
        'HDMIENTRADA',
        'MONITORTELA',
        'TECLADOMECÂNICO',
        'MOUSEÓPTICO',
        'IMPRESSORALASER',
        'COMPUTADORPESSOAL',
        'COMPUTADORPORTÁTIL',
        'COMPUTADORESCRITÓRIO',
      ],
      professions: [
        'MÉDICOCIRURGIÃO',
        'PROFESSORUNIVERSITÁRIO',
        'ENGENHEIROCIVIL',
        'ADVOGADOCRIMINAL',
        'DENTISTAORTOPEDISTA',
        'VETERINÁRIOCLÍNICO',
        'ARQUITETOURBANISTA',
        'FARMACÊUTICOCLÍNICO',
        'ENFERMEIROESPECIALISTA',
        'PSICÓLOGOCLÍNICO',
        'PEDAGOGOEDUCADOR',
        'FISIOTERAPEUTAESPECIALISTA',
        'FONOAUDIÓLOGOTERAPEUTA',
        'TERAPEUTAOCUPACIONAL',
        'NUTRICIONISTACLÍNICO',
        'BIOQUÍMICOANALISTA',
        'BIÓLOGOPESQUISADOR',
        'QUÍMICOANALISTA',
        'FÍSICOTEÓRICO',
        'MATEMÁTICOPESQUISADOR',
        'ESTATÍSTICOANALISTA',
        'ECONOMISTAFINANCEIRO',
        'ADMINISTRADOREMPRESARIAL',
        'CONTADORAUDITOR',
        'AUDITORINTERNO',
        'ANALISTASISTEMAS',
        'PROGRAMADORDESENVOLVEDOR',
        'DESENVOLVEDORSOFTWARE',
        'ANALISTASISTEMAS',
        'ADMINISTRADORREDES',
        'TÉCNICOINFORMÁTICA',
        'MÉDICOGERAL',
        'MÉDICOESPECIALISTA',
        'MÉDICORESIDENTE',
        'CLÍNICOGERAL',
        'CIRURGIÃOGERAL',
      ],
      sports: [
        'FUTEBOLPROFISSIONAL',
        'BASQUETENACIONAL',
        'TÊNISPROFISSIONAL',
        'NATAÇÃOOLÍMPICA',
        'VÔLEIPRAIA',
        'ATLETISMOOLÍMPICO',
        'GINÁSTICAARTÍSTICA',
        'SURFPROFISSIONAL',
        'SKATEVERTICAL',
        'CICLISMOESTRADA',
        'HANDEBOLINDOOR',
        'RUGBYUNION',
        'BADMINTONOLÍMPICO',
        'SQUASHINTERNACIONAL',
        'ESGRIMAOLÍMPICA',
        'TIROESPORTIVO',
        'CANOAGEMVELOCIDADE',
        'REMOOLÍMPICO',
        'TRIATLOIRONMAN',
        'MARATONAOLÍMPICA',
        'CORRIDAESTRADA',
        'SALTOEMALTURA',
        'LANÇAMENTODISCO',
        'ARREMESSOPESO',
        'DARDOOLÍMPICO',
        'BOLICHEPROFISSIONAL',
        'SINUCAINTERNACIONAL',
        'BILHARAMERICANO',
        'PINGPONGOLÍMPICO',
        'TÊNISMESAOLÍMPICO',
      ],
      music: [
        'PIANOACÚSTICO',
        'VIOLÃOCLÁSSICO',
        'BATERIAACÚSTICA',
        'FLAUTATRANSVERSAL',
        'SAXOFONETENOR',
        'TROMPETESOPRANO',
        'CLARINETESOPRANO',
        'HARPACELTA',
        'ACORDEÃODIATÔNICO',
        'TECLADOELETRÔNICO',
        'VIOLINOSTRADIVARIUS',
        'VIOLADAMORE',
        'VIOLONCELOACÚSTICO',
        'CONTRABAIXOACÚSTICO',
        'TROMBONETENOR',
        'TUBASOUSAFONE',
        'FAGOTEBARROCO',
        'OBOÉFRANCÊS',
        'CORNOFRANCÊS',
        'TIMPANIORQUESTRAL',
        'TRIÂNGULOMETÁLICO',
        'XILOFONEORQUESTRAL',
        'VIBRAFONEJAZZ',
        'MARIMBAAFRICANA',
        'GLOCKENSPIELORQUESTRAL',
        'CELESTAORQUESTRAL',
        'ÓRGÃOPIPE',
        'SINTETIZADORANALÓGICO',
        'GUITARRAELÉTRICA',
        'BAIXOELÉTRICO',
        'PIANOELÉTRICO',
        'PIANOACÚSTICO',
        'PIANODIGITAL',
      ],
      nature: [
        'CARVALHO',
        'LÓTUS',
        'MONTANHA',
        'AMAZONAS',
        'ATLÂNTICO',
        'FLORESTA',
        'PRAIA',
        'DESERTO',
        'CACHOEIRA',
        'VULCÃO',
        'TITICACA',
        'LAGOA',
        'CASCATA',
        'MANTIQUEIRA',
        'COLINA',
        'VALE',
        'CÂNION',
        'CAVERNA',
        'GRUTA',
        'BURACO',
        'FOSSA',
        'ABISMO',
        'PRECIPÍCIO',
        'PENHASCO',
        'GRANITO',
        'PEDRA',
        'AREIA',
        'TERRA',
        'BARRO',
        'ARGILA',
      ],
    },
  },
  en: {
    easy: {
      animals: [
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
        'WOLF',
        'OWL',
        'EAGLE',
        'HAWK',
        'PIGEON',
        'SWALLOW',
        'BUTTERFLY',
        'KITTEN',
        'KITTY',
        'FELINE',
        'TOMCAT',
        'MEOW',
        'WHISKERS',
        'TAIL',
        'PAWS',
      ],
      colors: [
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
        'BLUELIGHT',
        'BLUEDARK',
        'BLUENAVY',
        'BLUESKY',
      ],
      foods: [
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
      technology: [
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
        'COMPUTERPERSONAL',
        'COMPUTERLAPTOP',
        'COMPUTERDESKTOP',
      ],
      professions: [
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
        'SPEECHTHERAPIST',
        'OCCUPATIONALTHERAPIST',
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
        'SYSTEMSANALYST',
        'NETWORKADMINISTRATOR',
        'ITTECHNICIAN',
        'DOCTORGENERAL',
        'DOCTORSPECIALIST',
        'DOCTORRESIDENT',
        'PHYSICIAN',
        'SURGEON',
      ],
      sports: [
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
        'PINGPONG',
        'TABLETENNIS',
      ],
      music: [
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
        'DOUBLEBASS',
        'TROMBONE',
        'TUBA',
        'BASSOON',
        'OBOE',
        'FRENCHHORN',
        'TIMPANI',
        'TRIANGLE',
        'XYLOPHONE',
        'VIBRAPHONE',
        'MARIMBA',
        'GLOCKENSPIEL',
        'CELESTA',
        'ORGAN',
        'SYNTHESIZER',
        'ELECTRICGUITAR',
        'ELECTRICBASS',
        'PIANOELECTRIC',
        'PIANOACOUSTIC',
        'PIANODIGITAL',
      ],
      nature: [
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
    },
    medium: {
      animals: [
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
        'WOLF',
        'OWL',
        'EAGLE',
        'HAWK',
        'PIGEON',
        'SWALLOW',
        'BUTTERFLY',
        'KITTEN',
        'KITTY',
        'FELINE',
        'TOMCAT',
        'MEOW',
        'WHISKERS',
        'TAIL',
        'PAWS',
      ],
      colors: [
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
        'BLUELIGHT',
        'BLUEDARK',
        'BLUENAVY',
        'BLUESKY',
      ],
      foods: [
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
      technology: [
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
        'COMPUTERPERSONAL',
        'COMPUTERLAPTOP',
        'COMPUTERDESKTOP',
      ],
      professions: [
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
        'SPEECHTHERAPIST',
        'OCCUPATIONALTHERAPIST',
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
        'SYSTEMSANALYST',
        'NETWORKADMINISTRATOR',
        'ITTECHNICIAN',
        'DOCTORGENERAL',
        'DOCTORSPECIALIST',
        'DOCTORRESIDENT',
        'PHYSICIAN',
        'SURGEON',
      ],
      sports: [
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
        'PINGPONG',
        'TABLETENNIS',
      ],
      music: [
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
        'DOUBLEBASS',
        'TROMBONE',
        'TUBA',
        'BASSOON',
        'OBOE',
        'FRENCHHORN',
        'TIMPANI',
        'TRIANGLE',
        'XYLOPHONE',
        'VIBRAPHONE',
        'MARIMBA',
        'GLOCKENSPIEL',
        'CELESTA',
        'ORGAN',
        'SYNTHESIZER',
        'ELECTRICGUITAR',
        'ELECTRICBASS',
        'PIANOELECTRIC',
        'PIANOACOUSTIC',
        'PIANODIGITAL',
      ],
      nature: [
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
    },
    hard: {
      animals: [
        'LEOPARD',
        'PANTHER',
        'JAGUAR',
        'LYNX',
        'PUMA',
        'CHEETAH',
        'CARACAL',
        'SERVAL',
        'OCELOT',
        'MARGAY',
        'BOBCAT',
        'COUGAR',
        'WILDCAT',
        'DESERTCAT',
        'SAVANNAHCAT',
        'MOUNTAINCAT',
        'FORESTCAT',
        'JUNGLECAT',
        'PANTANALCAT',
        'CERradoCAT',
        'CAATINGACAT',
        'MANGROVECAT',
        'SWAMPCAT',
        'RIVERCAT',
        'LAKECAT',
        'SEACAT',
        'OCEANCAT',
        'VALLEYCAT',
        'MOUNTAINCAT',
        'VOLCANOCAT',
        'FORESTCAT',
        'WOODLANDCAT',
        'GARDENCAT',
        'PARKCAT',
        'BEACHCAT',
        'DESERTCAT',
        'CAVECAT',
        'ABYSSCAT',
        'PRECIPICECAT',
        'CLIFFCAT',
        'ROCKCAT',
        'STONECAT',
        'SANDCAT',
        'EARTHCAT',
        'CLAYCAT',
        'MUDCAT',
      ],
      colors: [
        'DARKRED',
        'NAVYBLUE',
        'EMERALDGREEN',
        'HOTPINK',
        'GOLDEN',
        'DARKGRAY',
        'DEEPBLACK',
        'PUREWHITE',
        'DARKBROWN',
        'LIGHTBEIGE',
        'GOLDENYELLOW',
        'VIVIDORANGE',
        'DEEPPURPLE',
        'DARKVIOLET',
        'DARKINDIGO',
        'VIVIDTURQUOISE',
        'VIVIDMAGENTA',
        'VIVIDCYAN',
        'DARKLAVENDER',
        'DARKSALMON',
        'DARKCREAM',
        'DARKBURGUNDY',
        'DARKCARMINE',
        'VIVIDSCARLET',
        'DARKRUBY',
        'VIVIDEMERALD',
        'DARKJADE',
        'VIVIDTOURMALINE',
        'DARKSAPPHIRE',
        'PUREDIAMOND',
        'SKYBLUE',
        'DARKBLUE',
        'NAVYBLUE',
        'OCEANBLUE',
      ],
      foods: [
        'REDAPPLE',
        'CHOCOLATECAKE',
        'VEGETABLESOUP',
        'BOILEDEGG',
        'PUREHONEY',
        'SEASALT',
        'BROWNSUGAR',
        'BROWNRICE',
        'BLACKBEANS',
        'GRILLEDFISH',
        'ROASTEDMEAT',
        'WHOLEWHEATBREAD',
        'WHITECHEESE',
        'SILVERBANANA',
        'PERAORANGE',
        'PURPLEGRAPE',
        'WILLIAMSPEAR',
        'WILDSTRAWBERRY',
        'SWEETPINEAPPLE',
        'SEEDLESSWATERMELON',
        'FORMOSAPAPAYA',
        'WHITEGUAVA',
        'PALMERMANGO',
        'HASSAVOCADO',
        'SICILIANLEMON',
        'PONKANTANGERINE',
        'SWEETPEACH',
        'BLACKPLUM',
        'SWEETCHERRY',
        'WILDRASPBERRY',
      ],
      technology: [
        'PERSONALCOMPUTER',
        'CELLULARPHONE',
        'BROADBANDINTERNET',
        'ELECTRONICEMAIL',
        'INTERNETWEBSITE',
        'COMPUTERPROGRAM',
        'DIGITALFILE',
        'INFORMATICSDATA',
        'COMPUTERNETWORK',
        'OPERATINGSYSTEM',
        'PROGRAMMINGCODE',
        'SECURITYPASSWORD',
        'USERLOGIN',
        'INTELLIGENTSMARTPHONE',
        'ELECTRONICTABLET',
        'PORTABLELAPTOP',
        'PERSONALNOTEBOOK',
        'OFFICEDESKTOP',
        'WEBSERVER',
        'WIRELESSROUTER',
        'CABLEMODEM',
        'ETHERNETCABLE',
        'WIRELESSWIFI',
        'BLUETOOTHTECHNOLOGY',
        'USBCONNECTOR',
        'HDMIINPUT',
        'SCREENMONITOR',
        'MECHANICALKEYBOARD',
        'OPTICALMOUSE',
        'LASERPRINTER',
        'PERSONALCOMPUTER',
        'PORTABLECOMPUTER',
        'DESKTOPCOMPUTER',
      ],
      professions: [
        'SURGEONDOCTOR',
        'UNIVERSITYTEACHER',
        'CIVILENGINEER',
        'CRIMINALLAWYER',
        'ORTHODONTISTDENTIST',
        'CLINICALVETERINARIAN',
        'URBANARCHITECT',
        'CLINICALPHARMACIST',
        'SPECIALISTNURSE',
        'CLINICALPSYCHOLOGIST',
        'EDUCATIONALPEDAGOGUE',
        'SPECIALISTPHYSIOTHERAPIST',
        'THERAPEUTICSPEECHTHERAPIST',
        'OCCUPATIONALTHERAPIST',
        'CLINICALNUTRITIONIST',
        'ANALYTICALBIOCHEMIST',
        'RESEARCHBIOLOGIST',
        'ANALYTICALCHEMIST',
        'THEORETICALPHYSICIST',
        'RESEARCHMATHEMATICIAN',
        'ANALYTICALSTATISTICIAN',
        'FINANCIALECONOMIST',
        'BUSINESSADMINISTRATOR',
        'AUDITORACCOUNTANT',
        'INTERNALAUDITOR',
        'SYSTEMSANALYST',
        'DEVELOPERPROGRAMMER',
        'SOFTWAREDEVELOPER',
        'SYSTEMSANALYST',
        'NETWORKADMINISTRATOR',
        'INFORMATICSTECHNICIAN',
        'GENERALDOCTOR',
        'SPECIALISTDOCTOR',
        'RESIDENTDOCTOR',
        'GENERALPHYSICIAN',
        'GENERALSURGEON',
      ],
      sports: [
        'PROFESSIONALFOOTBALL',
        'NATIONALBASKETBALL',
        'PROFESSIONALTENNIS',
        'OLYMPICSWIMMING',
        'BEACHVOLLEYBALL',
        'OLYMPICATHLETICS',
        'ARTISTICGYMNASTICS',
        'PROFESSIONALSURFING',
        'VERTICALSKATEBOARDING',
        'ROADCYCLING',
        'INDOORHANDBALL',
        'RUGBYUNION',
        'OLYMPICBADMINTON',
        'INTERNATIONALSQUASH',
        'OLYMPICFENCING',
        'SPORTSHOOTING',
        'SPEEDCANOEING',
        'OLYMPICROWING',
        'IRONMANTRIATHLON',
        'OLYMPICMARATHON',
        'ROADRUNNING',
        'HIGHJUMP',
        'DISCUSTHROW',
        'SHOTPUT',
        'OLYMPICJAVELIN',
        'PROFESSIONALBOWLING',
        'INTERNATIONALSNOOKER',
        'AMERICANBILLIARDS',
        'OLYMPICPINGPONG',
        'OLYMPICTABLETENNIS',
      ],
      music: [
        'ACOUSTICPIANO',
        'CLASSICALGUITAR',
        'ACOUSTICDRUMS',
        'TRANSVERSEFLUTE',
        'TENORSAXOPHONE',
        'SOPRANOTRUMPET',
        'SOPRANOCLARINET',
        'CELTICHARP',
        'DIATONICACCORDION',
        'ELECTRONICKEYBOARD',
        'STRADIVARIUSVIOLIN',
        'VIOLADAMORE',
        'ACOUSTICCELLO',
        'ACOUSTICDOUBLEBASS',
        'TENORTROMBONE',
        'SOUSAPHONETUBA',
        'BAROQUEBASSOON',
        'FRENCHOBOE',
        'FRENCHHORN',
        'ORCHESTRALTIMPANI',
        'METALTRIANGLE',
        'ORCHESTRALXYLOPHONE',
        'JAZZVIBRAPHONE',
        'AFRICANMARIMBA',
        'ORCHESTRALGLOCKENSPIEL',
        'ORCHESTRALCELESTA',
        'PIPEORGAN',
        'ANALOGSYNTHESIZER',
        'ELECTRICGUITAR',
        'ELECTRICBASS',
        'ELECTRICPIANO',
        'ACOUSTICPIANO',
        'DIGITALPIANO',
      ],
      nature: [
        'CENTENNIAL',
        'LOTUS',
        'MOUNTAIN',
        'AMAZON',
        'ATLANTIC',
        'RAINFOREST',
        'TROPICAL',
        'SAHARA',
        'WATERFALL',
        'VOLCANO',
        'TITICACA',
        'LAGOON',
        'CASCADE',
        'MANTIQUEIRA',
        'HILLSIDE',
        'VALLEY',
        'CANYON',
        'CRYSTAL',
        'GROTTO',
        'BLACKHOLE',
        'MARIANA',
        'ABYSS',
        'PRECIPICE',
        'CLIFF',
        'GRANITE',
        'PHILOSOPHERS',
        'SAND',
        'EARTH',
        'CLAY',
        'MARBLE',
      ],
    },
  },
  es: {
    easy: {
      animals: [
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
        'LOBO',
        'BUHO',
        'AGUILA',
        'HALCON',
        'PALOMA',
        'GOLONDRINA',
        'MARIPOSA',
        'GATITO',
        'GATON',
        'FELINO',
        'MININO',
        'MIAU',
        'BIGOTES',
        'COLA',
        'PATAS',
      ],
      colors: [
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
        'AZULCLARO',
        'AZULOSCURO',
        'AZULMARINO',
        'AZULCIELO',
      ],
      foods: [
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
      technology: [
        'COMPUTADORA',
        'TELEFONO',
        'INTERNET',
        'CORREO',
        'SITIOWEB',
        'PROGRAMA',
        'ARCHIVO',
        'DATOS',
        'RED',
        'SISTEMA',
        'CODIGO',
        'CONTRASEÑA',
        'INICIOSESION',
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
        'COMPUTADORAPERSONAL',
        'COMPUTADORAPORTATIL',
        'COMPUTADORAESCRITORIO',
      ],
      professions: [
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
        'TERAPEUTAOCUPACIONAL',
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
        'ANALISTASISTEMAS',
        'ADMINISTRADORREDES',
        'TÉCNICOINFORMÁTICA',
        'MEDICOGENERAL',
        'MÉDICOESPECIALISTA',
        'MÉDICORESIDENTE',
        'CLINICO',
        'CIRUJANO',
      ],
      sports: [
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
        'PINGPONG',
        'TENISMESA',
      ],
      music: [
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
        'GUITARRAELECTRICA',
        'BAJOELECTRICO',
        'PIANOELECTRICO',
        'PIANOACÚSTICO',
        'PIANODIGITAL',
      ],
      nature: [
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
    medium: {
      animals: [
        'GATOSIAMES',
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
        'LOBO',
        'BUHO',
        'AGUILA',
        'HALCON',
        'PALOMA',
        'GOLONDRINA',
        'MARIPOSA',
        'GATITO',
        'GATON',
        'FELINO',
        'MININO',
        'MIAU',
        'BIGOTES',
        'COLA',
        'PATAS',
      ],
      colors: [
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
        'VIOLET',
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
        'AZULCLARO',
        'AZULOSCURO',
        'AZULMARINO',
        'AZULCIELO',
      ],
      foods: [
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
      technology: [
        'COMPUTADORA',
        'TELEFONO',
        'INTERNET',
        'CORREO',
        'SITIOWEB',
        'PROGRAMA',
        'ARCHIVO',
        'DATOS',
        'RED',
        'SISTEMA',
        'CODIGO',
        'CONTRASEÑA',
        'INICIOSESION',
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
        'COMPUTADORAPERSONAL',
        'COMPUTADORAPORTATIL',
        'COMPUTADORAESCRITORIO',
      ],
      professions: [
        'MEDICO',
        'PROFESOR',
        'INGENIERO',
        'ABOGADO',
        'DENTISTA',
        'VETERINARIAN',
        'ARCHITECTO',
        'PHARMACIST',
        'NURSE',
        'PSYCHOLOGIST',
        'PEDAGOGUE',
        'PHYSIOTHERAPIST',
        'SPEECHTHERAPIST',
        'OCCUPATIONALTHERAPIST',
        'NUTRITIONIST',
        'BIOCHEMIST',
        'BIOLOGIST',
        'CHEMIST',
        'PHYSICIST',
        'MATHEMATICIAN',
        'STATISTICIAN',
        'ECONOMISTA',
        'ADMINISTRATOR',
        'ACCOUNTANT',
        'AUDITOR',
        'ANALISTA',
        'PROGRAMADOR',
        'DEVELOPER',
        'SYSTEMSANALYST',
        'NETWORKADMINISTRATOR',
        'ITTECHNICIAN',
        'DOCTORGENERAL',
        'DOCTORSPECIALIST',
        'DOCTORRESIDENT',
        'PHYSICIAN',
        'SURGEON',
      ],
      sports: [
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
        'PINGPONG',
        'TENISMESA',
      ],
      music: [
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
        'GUITARRAELECTRICA',
        'BAJOELECTRICO',
        'PIANOELECTRICO',
        'PIANOACÚSTICO',
        'PIANODIGITAL',
      ],
      nature: [
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
    hard: {
      animals: [
        'LEOPARDO',
        'PANTERA',
        'JAGUAR',
        'LINCE',
        'PUMA',
        'ONZA',
        'GUEPARDO',
        'CARACAL',
        'SERVAL',
        'OCELOTE',
        'MARGAY',
        'JAGUATIRICA',
        'SUCUARANA',
        'GATODELMATO',
        'GATOMARACAYA',
        'OCELOTE',
        'GATOMOURISCO',
        'GATODELDESIERTO',
        'GATOSELVATICO',
        'GATOMONTES',
        'GATODELASELVA',
        'GATODELPANTANAL',
        'GATODELCERRADO',
        'GATODELACAATINGA',
        'GATODELMANGLE',
        'GATODELBREJO',
        'GATODELRIO',
        'GATODELLAGO',
        'GATODELMAR',
        'GATODELOCEANO',
        'GATODELVALLE',
        'GATODELAMONTANA',
        'GATODELVOLCAN',
        'GATODELAFLORESTA',
        'GATODELBOSQUE',
        'GATODELJARDIN',
        'GATODELPARQUE',
        'GATODELAPLAYA',
        'GATODELDESIERTO',
        'GATODELACAVERNA',
        'GATODELABISMO',
        'GATODELPRECIPICIO',
        'GATODELPENHASCO',
        'GATODELAROCA',
        'GATODELAPIEDRA',
        'GATODELAARENA',
        'GATODELATIERRA',
        'GATODELBARRO',
        'GATODELAARCILLA',
      ],
      colors: [
        'ROJOOSCURO',
        'AZULMARINO',
        'VERDEESMERALDA',
        'ROSACHOQUE',
        'DORADO',
        'GRISOSCURO',
        'NEGROPROFUNDO',
        'BLANCOPURO',
        'CAFEOSCURO',
        'BEIGECLARO',
        'AMARILLOORO',
        'NARANJAVIVO',
        'MORADOPROFUNDO',
        'VIOLETAOSCURO',
        'INDIGOOSCURO',
        'TURQUESAVIVO',
        'MAGENTAVIVO',
        'CIANVIVO',
        'LAVANDAOSCURO',
        'SALMONOSCURO',
        'CREMAOSCURO',
        'BURGUNDYOSCURO',
        'CARMINOSCURO',
        'ESCARLATAVIVO',
        'RUBIOSCURO',
        'ESMERALDAVIVO',
        'JADEOSCURO',
        'TURMALINAVIVO',
        'ZAFIROOSCURO',
        'DIAMANTEPURO',
        'AZULCIELO',
        'AZULOSCURO',
        'AZULMARINO',
        'AZULOCEANO',
      ],
      foods: [
        'MANZANAROJA',
        'PANCHOCOLATE',
        'SOPALEGUMBRES',
        'HUEVOCOCIDO',
        'MIELPURO',
        'SALMARINA',
        'AZUCARMASCABADO',
        'ARROZINTEGRAL',
        'FRIJOLNEGRO',
        'PESCADOASADO',
        'CARNEASADA',
        'PANINTEGRAL',
        'QUESOBLANCO',
        'PLATANOPLATA',
        'NARANJAPERA',
        'UVAMORADA',
        'PERAWILLIAMS',
        'FRESASELVATICA',
        'PINADULCE',
        'SANDIASINSEMILLA',
        'PAPAYAFORMOSA',
        'GUAYABABLANCA',
        'MANGOPALMER',
        'AGUACATEHASS',
        'LIMONSICILIANO',
        'MANDARINAPONKAN',
        'MELOCOTONDULCE',
        'CIRUELANEGRA',
        'CEREZADULCE',
        'FRAMBUESASELVATICA',
      ],
      technology: [
        'COMPUTADORAPERSONAL',
        'TELEFONOCELULAR',
        'INTERNETBANDAANCHA',
        'CORREOELECTRONICO',
        'SITIOINTERNET',
        'PROGRAMACOMPUTADORA',
        'ARCHIVODIGITAL',
        'DATOSINFORMATICOS',
        'REDCOMPUTADORAS',
        'SISTEMAOPERATIVO',
        'CODIGOPROGRAMACION',
        'CONTRASEÑASEGURIDAD',
        'INICIOSESIONUSUARIO',
        'SMARTPHONEINTELIGENTE',
        'TABLETELECTRONICO',
        'LAPTOPPORTATIL',
        'NOTEBOOKPERSONAL',
        'DESKTOPESCRITORIO',
        'SERVIDORWEB',
        'ROUTERWIRELESS',
        'MODEMCABLE',
        'CABLEETHERNET',
        'WIFISINCABLE',
        'BLUETOOTHTECNOLOGIA',
        'USBCONECTOR',
        'HDMIENTRADA',
        'MONITORPANTALLA',
        'TECLADOMECANICO',
        'RATONOPTICO',
        'IMPRESORALASER',
        'COMPUTADORAPERSONAL',
        'COMPUTADORAPORTATIL',
        'COMPUTADORAESCRITORIO',
      ],
      professions: [
        'MEDICOCIRUJANO',
        'PROFESORUNIVERSITARIO',
        'INGENIEROCIVIL',
        'ABOGADOCRIMINAL',
        'DENTISTAORTOPEDISTA',
        'VETERINARIOCLINICO',
        'ARQUITECTOURBANISTA',
        'FARMACEUTICOCLINICO',
        'ENFERMEROESPECIALISTA',
        'PSICOLOGOCLINICO',
        'PEDAGOGOEDUCADOR',
        'FISIOTERAPEUTAESPECIALISTA',
        'FONOAUDIOLOGOTERAPEUTA',
        'TERAPEUTAOCUPACIONAL',
        'NUTRICIONISTACLINICO',
        'BIOQUIMICOANALISTA',
        'BIOLOGOINVESTIGADOR',
        'QUIMICOANALISTA',
        'FISICOTEORICO',
        'MATEMATICOINVESTIGADOR',
        'ESTADISTICOANALISTA',
        'ECONOMISTAFINANCIERO',
        'ADMINISTRADOREMPRESARIAL',
        'CONTADORAUDITOR',
        'AUDITORINTERNO',
        'ANALISTASISTEMAS',
        'PROGRAMADORDESARROLLADOR',
        'DESARROLLADORSOFTWARE',
        'ANALISTASISTEMAS',
        'ADMINISTRADORREDES',
        'TECNICOINFORMATICA',
        'MEDICOGENERAL',
        'MÉDICOESPECIALISTA',
        'MÉDICORESIDENTE',
        'CLINICOGENERAL',
        'CIRUJANOGENERAL',
      ],
      sports: [
        'FUTBOLPROFESIONAL',
        'BALONCESTONACIONAL',
        'TENISPROFESIONAL',
        'NATACIONOLIMPICA',
        'VOLEIBOLPLAYA',
        'ATLETISMOOLIMPICO',
        'GIMNASIAARTISTICA',
        'SURFPROFESIONAL',
        'SKATEVERTICAL',
        'CICLISMORUTA',
        'BALONMANOINDOOR',
        'RUGBYUNION',
        'BADMINTONOLIMPICO',
        'SQUASHINTERNACIONAL',
        'ESGRIMAOLIMPICA',
        'TIRODEPORTIVO',
        'CANOTAJEVELOCIDAD',
        'REMOOLIMPICO',
        'TRIATLONIRONMAN',
        'MARATONOLIMPICA',
        'CARRERARUTA',
        'SALTOALTURA',
        'LANZAMIENTODISCO',
        'ARREMESSOPESO',
        'DARDOOLIMPICO',
        'BOLICHEPROFESIONAL',
        'SINUCAINTERNACIONAL',
        'BILLARAMERICANO',
        'PINGPONGOLIMPICO',
        'TENISMESAOLIMPICO',
      ],
      music: [
        'PIANOACÚSTICO',
        'GUITARRACLASICA',
        'BATERIAACUSTICA',
        'FLAUTATRANSVERSAL',
        'SAXOFONTENOR',
        'TROMPETASOPRANO',
        'CLARINETESOPRANO',
        'ARPACELTA',
        'ACORDEONDIATONICO',
        'TECLADOELECTRONICO',
        'VIOLINSTRADIVARIUS',
        'VIOLADAMORE',
        'VIOLONCHELOACUSTICO',
        'CONTRABAJOACUSTICO',
        'TROMBONTENOR',
        'TUBASOUSAFONE',
        'FAGOTBARROCO',
        'OBOEFRANCES',
        'CORNOFRANCES',
        'TIMPANIORQUESTRAL',
        'TRIANGULOMETALICO',
        'XILOFONOORQUESTRAL',
        'VIBRAFONOJAZZ',
        'MARIMBAAFRICANA',
        'GLOCKENSPIELORQUESTRAL',
        'CELESTAORQUESTRAL',
        'ORGANOPIPE',
        'SINTETIZADORANALOGICO',
        'GUITARRAELECTRICA',
        'BAJOELECTRICO',
        'PIANOELECTRICO',
        'PIANOACÚSTICO',
        'PIANODIGITAL',
      ],
      nature: [
        'ROBLE',
        'LOTO',
        'MONTAÑA',
        'AMAZONAS',
        'ATLANTICO',
        'BOSQUE',
        'PLAYA',
        'DESIERTO',
        'CASCADA',
        'VOLCAN',
        'TITICACA',
        'LAGUNA',
        'CATARATA',
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
        'GRANITO',
        'PIEDRA',
        'ARENA',
        'TIERRA',
        'ARCILLA',
        'BARRO',
      ],
    },
  },
};

const UITRANSLATIONS = {
  pt: {
    title: 'Caça-Palavras',
    subtitle: 'Jogo educativo interativo',
    gridSize: 'Tamanho do Grid',
    wordDifficulty: 'Dificuldade das Palavras',
    category: 'Categoria',
    language: 'Idioma',
    newGame: 'Novo Jogo',
    found: 'Encontradas',
    timeElapsed: 'Tempo',
    clickToStart: 'Clique para começar',
    ttsEnabled: 'Falar palavras',
    settings: 'Configurações',
    share: 'Compartilhar',
    congratulations: 'Parabéns!',
    gameCompleted: 'Você completou o puzzle!',
    gridSizes: {
      small: 'Pequeno (10x12)',
      medium: 'Médio (12x15)',
      large: 'Grande (14x18)',
    },
    wordDifficulties: { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' },
    wordDifficultyDescriptions: {
      easy: 'Palavras simples e comuns',
      medium: 'Palavras de complexidade moderada',
      hard: 'Palavras complexas e longas',
    },
    categories: {
      animals: 'Animais',
      colors: 'Cores',
      foods: 'Comidas',
      technology: 'Tecnologia',
      professions: 'Profissões',
      sports: 'Esportes',
      music: 'Música',
      nature: 'Natureza',
    },
    statistics: 'Estatísticas',
    achievements: 'Conquistas',
    totalGames: 'Jogos Totais',
    wordsFound: 'Palavras Encontradas',
    bestTime: 'Melhor Tempo',
    maxStreak: 'Sequência Máxima',
    moreAchievements: 'mais conquistas',
    achievementNames: {
      firstword: 'Primeira Palavra',
      speeddemon: 'Demônio da Velocidade',
      wordmaster: 'Mestre das Palavras',
      streakchampion: 'Campeão da Sequência',
      perfectionist: 'Perfeccionista',
    },
    achievementDescriptions: {
      firstword: 'Encontre sua primeira palavra',
      speeddemon: 'Complete um jogo em menos de 2 minutos',
      wordmaster: 'Encontre 50 palavras no total',
      streakchampion: 'Encontre 5 palavras consecutivas',
      perfectionist: 'Complete 10 jogos sem erros',
    },
    achievementToast: {
      firstword: '🏆 Conquista: Primeira Palavra!',
      speeddemon: '🏆 Conquista: Demônio da Velocidade!',
      wordmaster: '🏆 Conquista: Mestre das Palavras!',
      streakchampion: '🏆 Conquista: Campeão da Sequência!',
      perfectionist: '🏆 Conquista: Perfeccionista!',
    },
    shareText: {
      played: 'Joguei Caça-Palavras no GSL Game Zone!',
      result: 'Resultado',
      wordsFound: 'palavras encontradas',
      time: 'Tempo',
      score: 'Pontuação',
      points: 'pontos',
    },
  },
  en: {
    title: 'Word Search',
    subtitle: 'Interactive educational game',
    gridSize: 'Grid Size',
    wordDifficulty: 'Word Difficulty',
    category: 'Category',
    language: 'Language',
    newGame: 'New Game',
    found: 'Found',
    timeElapsed: 'Time',
    clickToStart: 'Click to start',
    ttsEnabled: 'Speak words',
    settings: 'Settings',
    share: 'Share',
    congratulations: 'Congratulations!',
    gameCompleted: 'You completed the puzzle!',
    gridSizes: {
      small: 'Small (10x12)',
      medium: 'Medium (12x15)',
      large: 'Large (14x18)',
    },
    wordDifficulties: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
    wordDifficultyDescriptions: {
      easy: 'Simple and common words',
      medium: 'Moderate complexity words',
      hard: 'Complex and long words',
    },
    categories: {
      animals: 'Animals',
      colors: 'Colors',
      foods: 'Foods',
      technology: 'Technology',
      professions: 'Professions',
      sports: 'Sports',
      music: 'Music',
      nature: 'Nature',
    },
    statistics: 'Statistics',
    achievements: 'Achievements',
    totalGames: 'Total Games',
    wordsFound: 'Words Found',
    bestTime: 'Best Time',
    maxStreak: 'Max Streak',
    moreAchievements: 'more achievements',
    achievementNames: {
      firstword: 'First Word',
      speeddemon: 'Speed Demon',
      wordmaster: 'Word Master',
      streakchampion: 'Streak Champion',
      perfectionist: 'Perfectionist',
    },
    achievementDescriptions: {
      firstword: 'Find your first word',
      speeddemon: 'Complete a game in less than 2 minutes',
      wordmaster: 'Find 50 words in total',
      streakchampion: 'Find 5 consecutive words',
      perfectionist: 'Complete 10 games without mistakes',
    },
    achievementToast: {
      firstword: '🏆 Achievement: First Word!',
      speeddemon: '🏆 Achievement: Speed Demon!',
      wordmaster: '🏆 Achievement: Word Master!',
      streakchampion: '🏆 Achievement: Streak Champion!',
      perfectionist: '🏆 Achievement: Perfectionist!',
    },
    shareText: {
      played: 'I played Word Search in GSL Game Zone!',
      result: 'Result',
      wordsFound: 'words found',
      time: 'Time',
      score: 'Score',
      points: 'points',
    },
  },
  es: {
    title: 'Sopa de Letras',
    subtitle: 'Juego educativo interactivo',
    gridSize: 'Tamaño de Cuadrícula',
    wordDifficulty: 'Dificultad de Palabras',
    category: 'Categoría',
    language: 'Idioma',
    newGame: 'Nuevo Juego',
    found: 'Encontradas',
    timeElapsed: 'Tiempo',
    clickToStart: 'Haz clic para empezar',
    ttsEnabled: 'Hablar palabras',
    settings: 'Configuración',
    share: 'Compartir',
    congratulations: '¡Felicitaciones!',
    gameCompleted: '¡Completaste el puzzle!',
    gridSizes: {
      small: 'Pequeño (10x12)',
      medium: 'Mediano (12x15)',
      large: 'Grande (14x18)',
    },
    wordDifficulties: { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' },
    wordDifficultyDescriptions: {
      easy: 'Palavras simples y comunes',
      medium: 'Palavras de complejidad moderada',
      hard: 'Palavras complejas y largas',
    },
    categories: {
      animals: 'Animales',
      colors: 'Colores',
      foods: 'Comidas',
      technology: 'Tecnología',
      professions: 'Profesiones',
      sports: 'Deportes',
      music: 'Música',
      nature: 'Naturaleza',
    },
    statistics: 'Estadísticas',
    achievements: 'Logros',
    totalGames: 'Juegos Totales',
    wordsFound: 'Palabras Encontradas',
    bestTime: 'Mejor Tiempo',
    maxStreak: 'Secuencia Máxima',
    moreAchievements: 'más logros',
    achievementNames: {
      firstword: 'Primera Palabra',
      speeddemon: 'Demonio de Velocidad',
      wordmaster: 'Maestro de Palabras',
      streakchampion: 'Campeón de Secuencia',
      perfectionist: 'Perfeccionista',
    },
    achievementDescriptions: {
      firstword: 'Encuentra tu primera palabra',
      speeddemon: 'Completa un juego en menos de 2 minutos',
      wordmaster: 'Encuentra 50 palabras en total',
      streakchampion: 'Encuentra 5 palabras consecutivas',
      perfectionist: 'Completa 10 juegos sin errores',
    },
    achievementToast: {
      firstword: '🏆 Logro: Primera Palabra!',
      speeddemon: '🏆 Logro: Demonio de Velocidad!',
      wordmaster: '🏆 Logro: Maestro de Palabras!',
      streakchampion: '🏆 Logro: Campeón de Secuencia!',
      perfectionist: '🏆 Logro: Perfeccionista!',
    },
    shareText: {
      played: '¡Jugué Sopa de Letras en GSL Game Zone!',
      result: 'Resultado',
      wordsFound: 'palabras encontradas',
      time: 'Tiempo',
      score: 'Puntuación',
      points: 'puntos',
    },
  },
};

// ===== UTILITY FUNCTIONS =====
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins + ':' + (secs < 10 ? '0' : '') + secs;
};

const shuffleArray = <T,>(array: T[], seed: number): T[] => {
  return [...new Set(array)].sort(() => seededRandom(seed++) - 0.5);
};

const canPlaceWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: [number, number],
  cols: number,
  rows: number
): boolean => {
  for (let i = 0; i < word.length; i++) {
    const newRow = row + direction[0] * i;
    const newCol = col + direction[1] * i;
    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols)
      return false;
    if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i])
      return false;
  }
  return true;
};

const placeWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: [number, number]
): void => {
  for (let i = 0; i < word.length; i++) {
    const newRow = row + direction[0] * i;
    const newCol = col + direction[1] * i;
    grid[newRow][newCol] = word[i];
  }
};

const generateGrid = (
  cols: number,
  rows: number,
  words: string[],
  seed: number = Date.now()
): { grid: string[][]; words: WordObj[] } => {
  console.log('generateGrid called with:', {
    cols,
    rows,
    wordsLength: words?.length,
    seed,
  });
  const grid = Array(rows)
    .fill('')
    .map(() => Array(cols).fill(''));
  const placedWords: WordObj[] = [];
  let currentSeed = seed;

  // Embaralhar palavras e garantir que não se repitam
  const shuffledWords = shuffleArray([...new Set(words)], currentSeed++);

  // Usar apenas palavras únicas
  const uniqueWords = shuffledWords.filter(
    (word, index, arr) => arr.indexOf(word) === index
  );

  for (const word of uniqueWords.slice(0, 15)) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 150) {
      const direction = DIRECTIONS[
        Math.floor(seededRandom(currentSeed++) * DIRECTIONS.length)
      ] as [number, number];
      const startRow = Math.floor(seededRandom(currentSeed++) * rows);
      const startCol = Math.floor(seededRandom(currentSeed++) * cols);

      if (canPlaceWord(grid, word, startRow, startCol, direction, cols, rows)) {
        placeWord(grid, word, startRow, startCol, direction);
        placedWords.push({
          word,
          start: [startRow, startCol],
          direction,
          found: false,
        });
        placed = true;
      }
      attempts++;
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(
          65 + Math.floor(seededRandom(currentSeed++) * 26)
        );
      }
    }
  }

  return { grid, words: placedWords };
};

const getLineCells = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): Cell[] => {
  const cells: Cell[] = [];
  const rowStep =
    endRow === startRow ? 0 : (endRow - startRow) / Math.abs(endRow - startRow);
  const colStep =
    endCol === startCol ? 0 : (endCol - startCol) / Math.abs(endCol - startCol);
  const steps = Math.max(
    Math.abs(endRow - startRow),
    Math.abs(endCol - startCol)
  );

  for (let i = 0; i <= steps; i++) {
    cells.push({ row: startRow + rowStep * i, col: startCol + colStep * i });
  }
  return cells;
};

const checkWordMatch = (
  gameState: GameState | null,
  selectedCells: Cell[],
  foundWords: string[]
): WordObj | null => {
  if (!gameState || selectedCells.length < 2) return null;

  const selectedText = selectedCells
    .map(cell => gameState.grid[cell.row][cell.col])
    .join('');
  const reverseText = selectedText.split('').reverse().join('');

  return (
    gameState.words.find(
      wordObj =>
        (wordObj.word === selectedText || wordObj.word === reverseText) &&
        !foundWords.includes(wordObj.word)
    ) || null
  );
};

const getCellClass = (
  row: number,
  col: number,
  selectedCells: Cell[],
  gameState: GameState | null,
  foundWords: string[]
): string => {
  const isSelected = selectedCells.some(
    cell => cell.row === row && cell.col === col
  );
  const isFound = gameState?.words.some(wordObj => {
    if (!foundWords.includes(wordObj.word)) return false;

    for (let i = 0; i < wordObj.word.length; i++) {
      const cellRow = wordObj.start[0] + wordObj.direction[0] * i;
      const cellCol = wordObj.start[1] + wordObj.direction[1] * i;
      if (cellRow === row && cellCol === col) return true;
    }
    return false;
  });

  let classes = 'grid-cell';

  if (isFound) {
    classes += ' grid-cell-found';
  } else if (isSelected) {
    classes += ' grid-cell-selected';
  } else {
    classes += ' grid-cell-default';
  }

  return classes;
};

// ===== CUSTOM HOOKS =====
// TTS DESABILITADO - Função comentada
/*
const useTTS = (language: string, enabled: boolean) => {
  const speak = useCallback((word: string) => {
    if (!enabled || !('speechSynthesis' in window)) return;
    
    // Cancelar qualquer fala anterior
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    
    // Configurações AGGRESSIVAS para melhor qualidade
    utterance.rate = 0.6; // Mais lento para clareza
    utterance.pitch = 1.2; // Tom mais alto para destaque
    utterance.volume = 1.0; // Volume máximo
    
    // Configurar idioma com fallbacks robustos
    const langMap: { [key: string]: string } = {
      'pt': 'pt-BR',
      'en': 'en-US', 
      'es': 'es-ES'
    };
    
    utterance.lang = langMap[language] || 'en-US';
    
    // Função para selecionar a MELHOR voz disponível
    const selectBestVoice = () => {
      const voices = speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      
      let selectedVoice = null;
      
      // Estratégia 1: Voz nativa de alta qualidade
      selectedVoice = voices.find(voice => 
        voice.lang === langMap[language] && 
        voice.localService &&
        (voice.name.includes('Premium') || voice.name.includes('Enhanced') || voice.name.includes('HD'))
      );
      
      // Estratégia 2: Qualquer voz nativa
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang === langMap[language] && voice.localService
        );
      }
      
      // Estratégia 3: Voz do idioma (não necessariamente nativa)
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith(language) || voice.lang.startsWith(langMap[language])
        );
      }
      
      // Estratégia 4: Voz em inglês de alta qualidade (fallback)
      if (!selectedVoice && language !== 'en') {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Premium') || voice.name.includes('Enhanced') || voice.name.includes('HD'))
        );
      }
      
      // Estratégia 5: Qualquer voz em inglês
      if (!selectedVoice && language !== 'en') {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }
      
      // Estratégia 6: Primeira voz disponível
      if (!selectedVoice) {
        selectedVoice = voices[0];
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('TTS: Selected voice -', selectedVoice.name, 'for language:', language);
      } else {
        console.warn('TTS: No voice found for language:', language);
      }
      
      // Falar com configurações otimizadas
      speechSynthesis.speak(utterance);
    };
    
    // Aguardar vozes carregarem ou usar imediatamente
    if (speechSynthesis.getVoices().length > 0) {
      selectBestVoice();
    } else {
      speechSynthesis.onvoiceschanged = () => {
        selectBestVoice();
        speechSynthesis.onvoiceschanged = null;
      };
    }
    
    // Adicionar handlers para debug
    utterance.onstart = () => console.log('TTS: Started speaking -', word);
    utterance.onend = () => console.log('TTS: Finished speaking -', word);
    utterance.onerror = (event) => console.warn('TTS: Error -', event.error);
    
  }, [enabled, language]);
  
  return { speak };
};
*/

const useGameTimer = (gameStarted: boolean, gameCompleted: boolean) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (startTime && gameStarted && !gameCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, gameStarted, gameCompleted]);

  const startTimer = useCallback(() => {
    if (!startTime) setStartTime(Date.now());
  }, [startTime]);

  const resetTimer = useCallback(() => {
    setStartTime(null);
    setElapsedTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    elapsedTime,
    startTime,
    startTimer,
    resetTimer,
    getFormattedTime: () => formatTime(elapsedTime),
  };
};

const useGameState = (
  language: string,
  gridSize: string,
  wordDifficulty: string,
  category: string
) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('wordSearchStats');
    return saved
      ? JSON.parse(saved)
      : {
          totalGames: 0,
          totalWordsFound: 0,
          bestTime: 0,
          averageTime: 0,
          achievements: getTranslatedAchievements(language),
          currentStreak: 0,
          longestStreak: 0,
        };
  });

  // Salvar estatísticas no localStorage
  useEffect(() => {
    localStorage.setItem('wordSearchStats', JSON.stringify(gameStats));
  }, [gameStats]);

  // Atualizar achievements quando o idioma muda
  useEffect(() => {
    setGameStats(prev => ({
      ...prev,
      achievements: getTranslatedAchievements(language),
    }));
  }, [language]);

  const initializeGame = useCallback(() => {
    console.log('Initializing game with:', {
      language,
      gridSize,
      wordDifficulty,
      category,
    });
    try {
      const categoryWords = (WORDCATALOGS as any)[language]?.[
        wordDifficulty
      ]?.[category];
      console.log('Category words found:', categoryWords?.length);
      console.log('WORDCATALOGS structure:', {
        hasLanguage: !!WORDCATALOGS[language as keyof typeof WORDCATALOGS],
        hasDifficulty:
          !!WORDCATALOGS[language as keyof typeof WORDCATALOGS]?.[
            wordDifficulty as keyof typeof WORDCATALOGS.pt
          ],
        hasCategory: !!(WORDCATALOGS as any)[language]?.[wordDifficulty]?.[
          category
        ],
      });

      // Detectar se é mobile ou tablet
      const isMobile = window.innerWidth < 1024; // Inclui tablets (iPad Pro 11" = 834px)
      console.log(
        'Is mobile/tablet:',
        isMobile,
        'Window width:',
        window.innerWidth
      );

      if (!categoryWords?.length) {
        const availableCategories = Object.keys(
          WORDCATALOGS[language as keyof typeof WORDCATALOGS]?.[
            wordDifficulty as keyof typeof WORDCATALOGS.pt
          ] || {}
        );
        if (availableCategories.length > 0) {
          const fallbackCategory = availableCategories[0];
          const fallbackWords = (WORDCATALOGS as any)[language]?.[
            wordDifficulty
          ]?.[fallbackCategory];

          const config = getGridConfig(gridSize, isMobile);
          const seed = Date.now();
          const result = generateGrid(
            config.size,
            config.rows,
            fallbackWords,
            seed
          );

          setGameState({
            grid: result.grid,
            words: result.words.slice(0, config.wordCount),
            cols: config.size,
            rows: config.rows,
            seed,
          });

          setFoundWords([]);
          setGameCompleted(false);
          setScore(0);
          setCurrentStreak(0);
        }
        return;
      }

      const config = getGridConfig(gridSize, isMobile);
      const seed = Date.now();
      console.log('Generating grid with config:', config);
      const result = generateGrid(
        config.size,
        config.rows,
        categoryWords,
        seed
      );
      console.log(
        'Grid generated successfully:',
        result.grid.length,
        'x',
        result.grid[0]?.length
      );

      setGameState({
        grid: result.grid,
        words: result.words.slice(0, config.wordCount),
        cols: config.size,
        rows: config.rows,
        seed,
      });

      setFoundWords([]);
      setGameCompleted(false);
      setScore(0);
      setCurrentStreak(0);
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }, [language, gridSize, wordDifficulty, category]);

  // Inicializar jogo apenas uma vez quando o componente monta
  useEffect(() => {
    console.log('useEffect triggered for initializeGame');
    console.log('Component state:', {
      language,
      gridSize,
      wordDifficulty,
      category,
    });
    console.log('Window dimensions:', {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    initializeGame();
  }, []); // Remover dependências para evitar loop

  useEffect(() => {
    if (
      gameState?.words &&
      foundWords.length === gameState.words.length &&
      gameState.words.length > 0
    ) {
      setGameCompleted(true);
    }
  }, [foundWords, gameState]);

  const addFoundWord = useCallback(
    (word: string) => {
      console.log('addFoundWord called for:', word);
      setFoundWords(prev => {
        if (!prev.includes(word)) {
          console.log('Adding new word:', word);
          // Calcular pontuação
          const baseScore = SCORING.wordFound;
          const difficultyMultiplier =
            SCORING.difficultyMultiplier[
              wordDifficulty as keyof typeof SCORING.difficultyMultiplier
            ];
          const streakBonus = currentStreak * SCORING.streakBonus;
          const wordScore = Math.floor(
            (baseScore + streakBonus) * difficultyMultiplier
          );

          setScore(prevScore => prevScore + wordScore);
          setCurrentStreak(prevStreak => prevStreak + 1);

          // Atualizar estatísticas
          setGameStats(prevStats => ({
            ...prevStats,
            totalWordsFound: prevStats.totalWordsFound + 1,
          }));

          return [...prev, word];
        } else {
          console.log('Word already in foundWords:', word);
        }
        return prev;
      });
    },
    [currentStreak, wordDifficulty]
  );

  const checkAchievements = useCallback(
    (translations: any) => {
      setGameStats((prev: GameStats) => {
        const newStats = { ...prev };
        const achievements = [...prev.achievements];

        // Primeira palavra
        const firstWord = achievements.find(
          (a: Achievement) => a.id === 'firstword'
        );
        if (firstWord && !firstWord.unlocked) {
          firstWord.progress = 1;
          firstWord.unlocked = true;
          toast.success(translations.achievementToast.firstword, {
            duration: 3000,
            icon: '🎯',
          });
        }

        // Mestre das palavras
        const wordMaster = achievements.find(
          (a: Achievement) => a.id === 'wordmaster'
        );
        if (wordMaster) {
          wordMaster.progress = Math.min(
            prev.totalWordsFound + 1,
            wordMaster.maxProgress
          );
          if (
            wordMaster.progress >= wordMaster.maxProgress &&
            !wordMaster.unlocked
          ) {
            wordMaster.unlocked = true;
            toast.success(translations.achievementToast.wordmaster, {
              duration: 3000,
              icon: '🏆',
            });
          }
        }

        // Campeão da sequência
        const streakChampion = achievements.find(
          (a: Achievement) => a.id === 'streakchampion'
        );
        if (streakChampion) {
          streakChampion.progress = Math.max(
            streakChampion.progress,
            currentStreak + 1
          );
          if (
            streakChampion.progress >= streakChampion.maxProgress &&
            !streakChampion.unlocked
          ) {
            streakChampion.unlocked = true;
            toast.success(translations.achievementToast.streakchampion, {
              duration: 3000,
              icon: '🔥',
            });
          }
        }

        newStats.achievements = achievements;
        return newStats;
      });
    },
    [currentStreak]
  );

  const updateGameCompletionStats = useCallback(
    (completionTime: number, finalStreak: number, translations: any) => {
      setGameStats((prev: GameStats) => {
        const newStats = { ...prev };
        newStats.totalGames += 1;

        // Atualizar melhor tempo
        if (
          completionTime > 0 &&
          (newStats.bestTime === 0 || completionTime < newStats.bestTime)
        ) {
          newStats.bestTime = completionTime;
        }

        // Atualizar sequência máxima
        if (finalStreak > newStats.longestStreak) {
          newStats.longestStreak = finalStreak;
        }

        // Verificar conquista de velocidade
        const speedDemon = newStats.achievements.find(
          (a: Achievement) => a.id === 'speeddemon'
        );
        if (speedDemon && !speedDemon.unlocked && completionTime < 120) {
          // menos de 2 minutos
          speedDemon.unlocked = true;
          toast.success(translations.achievementToast.speeddemon, {
            duration: 3000,
            icon: '⚡',
          });
        }

        return newStats;
      });
    },
    []
  );

  return {
    gameState,
    foundWords,
    gameCompleted,
    score,
    currentStreak,
    gameStats,
    initializeGame,
    addFoundWord,
    updateGameCompletionStats,
    checkAchievements,
  };
};

const useTouchHandlers = (
  gameCompleted: boolean,
  onCellStart: (row: number, col: number) => void,
  onCellMove: (row: number, col: number) => void,
  onCellEnd: () => void
) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handleCellStart = useCallback(
    (row: number, col: number, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (gameCompleted) return;
      setIsSelecting(true);
      onCellStart(row, col);
    },
    [gameCompleted, onCellStart]
  );

  const handleCellMove = useCallback(
    (row: number, col: number, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isSelecting || gameCompleted) return;
      onCellMove(row, col);
    },
    [isSelecting, gameCompleted, onCellMove]
  );

  const handleCellEnd = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      if (e) e.preventDefault();
      if (!isSelecting || gameCompleted) return;

      // Proteção adicional contra chamadas duplicadas
      setIsSelecting(false);

      // Chamar onCellEnd com um delay maior para evitar conflitos
      setTimeout(() => {
        onCellEnd();
      }, 50);
    },
    [isSelecting, gameCompleted, onCellEnd]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isSelecting) return;
      e.preventDefault();
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (
        element &&
        (element as HTMLElement).dataset.row &&
        (element as HTMLElement).dataset.col
      ) {
        const row = parseInt((element as HTMLElement).dataset.row!);
        const col = parseInt((element as HTMLElement).dataset.col!);
        handleCellMove(row, col, e);
      }
    },
    [isSelecting, handleCellMove]
  );

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isSelecting) e.preventDefault();
    };

    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('touchend', () => {
      if (isSelecting) setIsSelecting(false);
    });

    return () => {
      document.removeEventListener('touchmove', preventDefault);
      document.removeEventListener('touchend', () => {});
    };
  }, [isSelecting]);

  return { handleCellStart, handleCellMove, handleCellEnd, handleTouchMove };
};

// ===== MAIN COMPONENT =====
const WordSearchGame: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();

  // Pegar configurações da URL ou detectar baseado no subdomínio
  const [language, setLanguage] = useState(
    searchParams.get('lang') || detectLanguageFromSubdomain()
  );

  // Atualizar i18n quando o idioma mudar
  useEffect(() => {
    if (language && ['pt', 'en', 'es'].includes(language)) {
      console.log('WordSearchGame: Setting language to', language);
      i18n.changeLanguage(language);
    } else {
      // Se não há idioma na URL, usar o detectado pelo navegador
      const detectedLang = navigator.language.split('-')[0];
      if (detectedLang && ['pt', 'en', 'es'].includes(detectedLang)) {
        console.log(
          'WordSearchGame: Fallback to browser language',
          detectedLang
        );
        i18n.changeLanguage(detectedLang);
        setLanguage(detectedLang);
      }
    }
  }, [language, i18n]);
  const [gridSize] = useState(searchParams.get('size') || 'medium');
  const [wordDifficulty] = useState(searchParams.get('difficulty') || 'easy');
  const [category, setCategory] = useState(
    searchParams.get('category') || 'animals'
  );
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { width, height } = useWindowSize();
  const t = UITRANSLATIONS[language as keyof typeof UITRANSLATIONS];
  // const { speak } = useTTS(language, ttsEnabled); // TTS desabilitado

  const {
    gameState,
    foundWords,
    gameCompleted,
    score,
    currentStreak,
    gameStats,
    initializeGame,
    addFoundWord,
    updateGameCompletionStats,
    checkAchievements,
  } = useGameState(language, gridSize, wordDifficulty, category);

  const { startTimer, resetTimer, getFormattedTime, startTime } = useGameTimer(
    gameStarted,
    gameCompleted
  );

  // Estado para controlar palavras sendo processadas
  const [processingWords, setProcessingWords] = useState<Set<string>>(
    new Set()
  );
  const [lastProcessedWord, setLastProcessedWord] = useState<string>('');
  const [lastProcessedTime, setLastProcessedTime] = useState<number>(0);

  const handleWordFound = (word: string) => {
    const now = Date.now();

    // Verificar se a palavra já foi encontrada
    if (foundWords.includes(word)) {
      console.log('Word already found:', word);
      return;
    }

    // Verificar se a mesma palavra foi processada recentemente (debounce mais agressivo)
    if (word === lastProcessedWord && now - lastProcessedTime < 2000) {
      console.log('Word processed too recently:', word);
      return;
    }

    // Verificar se está sendo processada
    if (processingWords.has(word)) {
      console.log('Word being processed:', word);
      return;
    }

    // Marcar palavra como sendo processada
    setProcessingWords(prev => new Set(prev).add(word));
    setLastProcessedWord(word);
    setLastProcessedTime(now);

    // Calcular pontuação para o toast
    const baseScore = SCORING.wordFound;
    const difficultyMultiplier =
      SCORING.difficultyMultiplier[
        wordDifficulty as keyof typeof SCORING.difficultyMultiplier
      ];
    const streakBonus = currentStreak * SCORING.streakBonus;
    const wordScore = Math.floor(
      (baseScore + streakBonus) * difficultyMultiplier
    );

    console.log('Processing word:', word, 'with score:', wordScore);

    // Adicionar palavra encontrada
    addFoundWord(word);

    // Feedback visual removido - sem toast de pontuação

    // Verificar conquistas após um delay maior
    setTimeout(() => {
      checkAchievements(t);
    }, 500);

    // Track word found
    if (window.gtag) {
      window.gtag('event', 'wordfound', {
        word: word,
        gamecategory: category,
        gamedifficulty: wordDifficulty,
        eventcategory: 'Game',
        eventlabel: word,
      });
      console.log('Analytics: Word found tracked', {
        word,
        category,
        wordDifficulty,
      });
    }

    // Remover palavra do processamento após um delay maior
    setTimeout(() => {
      setProcessingWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(word);
        return newSet;
      });
    }, 2000);
  };

  const onCellStart = (row: number, col: number) => {
    if (!gameStarted) {
      startTimer();
      setGameStarted(true);

      // Track game start
      if (window.gtag) {
        window.gtag('event', 'gamestart', {
          gamecategory: category,
          gamedifficulty: wordDifficulty,
          gamelanguage: language,
          eventcategory: 'Game',
          eventlabel: `${category}${wordDifficulty}${language}`,
        });
        console.log('Analytics: Game start tracked', {
          category,
          wordDifficulty,
          language,
        });
      }
    }
    setSelectedCells([{ row, col }]);
  };

  const onCellMove = (row: number, col: number) => {
    const start = selectedCells[0];
    if (!start) return;

    const rowDiff = row - start.row;
    const colDiff = col - start.col;

    if (
      rowDiff === 0 ||
      colDiff === 0 ||
      Math.abs(rowDiff) === Math.abs(colDiff)
    ) {
      const cells = getLineCells(start.row, start.col, row, col);
      setSelectedCells(cells);
    }
  };

  const onCellEnd = () => {
    // Evitar processamento se não há células selecionadas
    if (selectedCells.length === 0) {
      console.log('No cells selected');
      return;
    }

    // Proteção contra chamadas duplicadas
    const currentSelectedCells = [...selectedCells];

    // Limpar seleção imediatamente para evitar chamadas duplicadas
    setSelectedCells([]);

    // Verificar se há uma palavra válida
    const foundWord = checkWordMatch(
      gameState,
      currentSelectedCells,
      foundWords
    );

    if (foundWord && foundWord.word) {
      console.log('Found word in onCellEnd:', foundWord.word);
      // Usar setTimeout com delay maior para evitar conflitos
      setTimeout(() => {
        handleWordFound(foundWord.word);
      }, 100);
    } else {
      console.log('No valid word found in selection');
    }
  };

  const { handleCellStart, handleCellMove, handleCellEnd, handleTouchMove } =
    useTouchHandlers(gameCompleted, onCellStart, onCellMove, onCellEnd);

  const resetGameState = () => {
    resetTimer();
    setGameStarted(false);
  };

  const handleNewGame = () => {
    // Aplicar configurações temporárias
    // As configurações já estão definidas pelos parâmetros da URL
    // Não é necessário alterar aqui

    // Reiniciar o jogo com as novas configurações
    setTimeout(() => {
      initializeGame();
      resetGameState();
      setSelectedCells([]);
      setShowConfetti(false);
    }, 100);

    // Track settings change
    if (window.gtag) {
      window.gtag('event', 'settingschange', {
        settingname: 'newgame',
        oldvalue: 'previous',
        newvalue: 'new',
        eventcategory: 'Settings',
        eventlabel: 'newgame',
      });
      console.log('Analytics: Settings change tracked', {
        setting: 'newgame',
        oldValue: 'previous',
        newValue: 'new',
      });
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleCloseGame = () => {
    navigate('/game-setup');
  };

  const handleShare = () => {
    if (!gameState) return;

    const gameResult = {
      wordsFound: foundWords.length,
      totalWords: gameState.words.length,
      time: getFormattedTime(),
      score: score,
      streak: currentStreak,
      difficulty: wordDifficulty,
      category: category,
      language: language,
    };

    // Função para tracking de analytics
    const trackShare = (platform: string) => {
      if (window.gtag) {
        window.gtag('event', 'share', {
          shareplatform: platform,
          eventcategory: 'Social',
          eventlabel: platform,
          gamecategory: category,
          gamedifficulty: wordDifficulty,
          gamelanguage: language,
        });
        console.log('Analytics: Share tracked', {
          platform,
          category,
          wordDifficulty,
          language,
        });
      }
    };

    // Usar a função de compartilhamento profissional
    shareGameResult(gameResult, trackShare);
  };

  useEffect(() => {
    const availableCategories = Object.keys(
      WORDCATALOGS[language as keyof typeof WORDCATALOGS]?.[
        wordDifficulty as keyof typeof WORDCATALOGS.pt
      ] || {}
    );
    if (
      !availableCategories.includes(category) &&
      availableCategories.length > 0
    ) {
      setCategory(availableCategories[0]);
    }
  }, [language, wordDifficulty, category, setCategory]);

  useEffect(() => {
    if (gameCompleted) {
      const completionTime = startTime
        ? Math.floor((Date.now() - startTime) / 1000)
        : 0;

      // Atualizar estatísticas finais
      updateGameCompletionStats(completionTime, currentStreak, t);

      setShowConfetti(true);
      toast.success(
        `🎉 Parabéns! Você completou o puzzle com ${score} pontos!`
      );
      setTimeout(() => setShowConfetti(false), 5000);

      // Track game completion
      if (startTime && window.gtag) {
        window.gtag('event', 'gamecomplete', {
          gamecategory: category,
          gamedifficulty: wordDifficulty,
          gamelanguage: language,
          wordsfound: foundWords.length,
          completiontime: completionTime,
          eventcategory: 'Game',
          eventlabel: `${category}${wordDifficulty}${language}`,
        });
        console.log('Analytics: Game complete tracked', {
          category,
          wordDifficulty,
          language,
          wordsFound: foundWords.length,
          completionTime,
        });
      }
    }
  }, [
    gameCompleted,
    category,
    wordDifficulty,
    language,
    foundWords.length,
    startTime,
    score,
    currentStreak,
    updateGameCompletionStats,
  ]);

  if (!gameState || !gameState.grid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          className="text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-4xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            🎯
          </motion.div>
          <div className="text-xl font-semibold text-gray-700 mb-2">
            Caça-Palavras
          </div>
          <div className="text-gray-500">Preparando o jogo...</div>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      <SEOHead
        pageTitle="🕹️ Word Search | Educational Games | GSL Game Zone"
        pageDescription="Play the ultimate Word Search game! Find hidden words in the grid with multiple categories, languages and difficulty levels. Educational and fun for all ages."
        pageKeywords="word search game, educational games, puzzle game, vocabulary, brain training, language learning, word puzzle, hidden words"
      />
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} />
      )}

      <motion.div
        className="card mb-6 md:mb-6 mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4 md:mb-4 mb-1">
          {/* Mobile Header - Simplified */}
          <div className="md:hidden flex items-center justify-between w-full mb-1 h-[60px]">
            <motion.button
              onClick={handleBackToHome}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Voltar para Home"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </motion.button>

            <div className="flex items-center gap-2">
              <Target size={16} className="text-blue-600" />
              <h1 className="text-base font-bold text-gray-800">{t.title}</h1>
            </div>

            {gameCompleted && (
              <motion.button
                onClick={handleShare}
                className="p-2 bg-green-500 text-white rounded-lg"
                title={t.share}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Share2 size={18} />
              </motion.button>
            )}
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              onClick={handleBackToHome}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Voltar para Home"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </motion.button>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <Target className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-xs text-gray-500 mt-1">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {gameCompleted && (
              <motion.button
                onClick={handleShare}
                className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
                title={t.share}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <Share2 size={20} />
              </motion.button>
            )}
          </div>
        </div>

        <div className="hidden md:block bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            {/* Progresso e Pontuação */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
                <Trophy size={18} className="text-yellow-500" />
                <span className="font-semibold text-gray-800">
                  {t.found}:{' '}
                  <span className="text-blue-600">{foundWords.length}</span>/
                  <span className="text-gray-600">
                    {gameState.words.length}
                  </span>
                </span>
              </div>

              {/* Pontuação */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-2 rounded-lg shadow-sm border border-yellow-200">
                <Zap size={18} className="text-yellow-600" />
                <span className="font-semibold text-gray-800">
                  <span className="text-yellow-700">{score}</span>{' '}
                  {t.shareText.points}
                </span>
              </div>

              {/* Sequência */}
              {currentStreak > 0 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 px-3 py-2 rounded-lg shadow-sm border border-red-200">
                  <span className="text-lg">🔥</span>
                  <span className="font-semibold text-gray-800">
                    <span className="text-red-700">{currentStreak}</span>{' '}
                    {t.maxStreak.toLowerCase()}
                  </span>
                </div>
              )}

              {/* Timer */}
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
                <Clock size={18} className="text-green-500" />
                <span
                  className={`font-semibold ${
                    gameStarted ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {getFormattedTime()}
                </span>
                {!gameStarted && width < 1024 && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    ({t.clickToStart})
                  </span>
                )}
              </div>
            </div>

            {/* Configuração atual */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">🎮</span>
              <div className="flex flex-wrap gap-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  {t.categories[category as keyof typeof t.categories] ||
                    category}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  {t.gridSizes[gridSize as keyof typeof t.gridSizes]}
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                  {
                    t.wordDifficulties[
                      wordDifficulty as keyof typeof t.wordDifficulties
                    ]
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <motion.div
            className="card game-area"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              className="grid gap-1 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gameState.cols}, 1fr)`,
                maxWidth: `${gameState.cols * 2.5}rem`,
              }}
              onMouseLeave={() => setSelectedCells([])}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleCellEnd}
            >
              {gameState.grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClass(
                      rowIndex,
                      colIndex,
                      selectedCells,
                      gameState,
                      foundWords
                    )}
                    data-row={rowIndex}
                    data-col={colIndex}
                    onMouseDown={e => handleCellStart(rowIndex, colIndex, e)}
                    onMouseEnter={e => handleCellMove(rowIndex, colIndex, e)}
                    onMouseUp={handleCellEnd}
                    onTouchStart={e => handleCellStart(rowIndex, colIndex, e)}
                    style={{ touchAction: 'none', userSelect: 'none' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cell}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Estatísticas e Conquistas - Desktop (abaixo do grid) */}
          <div className="hidden xl:grid xl:grid-cols-2 gap-6 mt-6">
            {/* Estatísticas */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-blue-500" />
                {t.statistics}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">{t.totalGames}:</span>
                  <span className="font-semibold text-blue-700">
                    {gameStats.totalGames}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">{t.wordsFound}:</span>
                  <span className="font-semibold text-green-700">
                    {gameStats.totalWordsFound}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">{t.bestTime}:</span>
                  <span className="font-semibold text-purple-700">
                    {gameStats.bestTime > 0
                      ? formatTime(gameStats.bestTime)
                      : '--:--'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                  <span className="text-sm text-gray-600">{t.maxStreak}:</span>
                  <span className="font-semibold text-orange-700">
                    {gameStats.longestStreak}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Conquistas */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="text-yellow-500" />
                {t.achievements}
              </h3>
              <div className="space-y-2">
                {gameStats.achievements
                  .slice(0, 3)
                  .map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      className={`p-2 rounded-lg text-sm transition-all ${
                        achievement.unlocked
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-xs opacity-75">
                            {achievement.description}
                          </div>
                        </div>
                        {achievement.unlocked && (
                          <span className="text-yellow-600">✓</span>
                        )}
                      </div>
                      {!achievement.unlocked && achievement.maxProgress > 1 && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (achievement.progress /
                                    achievement.maxProgress) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {achievement.progress}/{achievement.maxProgress}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                {gameStats.achievements.filter(a => a.unlocked).length > 3 && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    +{gameStats.achievements.filter(a => a.unlocked).length - 3}{' '}
                    {t.moreAchievements}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="xl:col-span-1 space-y-4">
          {/* Lista de Palavras */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="text-yellow-500" />
              {t.categories[category as keyof typeof t.categories] || category}
            </h3>
            <div className="space-y-2">
              {gameState.words.map((wordObj, index) => (
                <motion.div
                  key={index}
                  className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                    foundWords.includes(wordObj.word)
                      ? 'bg-success-100 text-success-800 line-through'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {wordObj.word}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Estatísticas - Mobile/Tablet (lado direito) */}
          <motion.div
            className="card xl:hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-500" />
              {t.statistics}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">{t.totalGames}:</span>
                <span className="font-semibold text-blue-700">
                  {gameStats.totalGames}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">{t.wordsFound}:</span>
                <span className="font-semibold text-green-700">
                  {gameStats.totalWordsFound}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-600">{t.bestTime}:</span>
                <span className="font-semibold text-purple-700">
                  {gameStats.bestTime > 0
                    ? formatTime(gameStats.bestTime)
                    : '--:--'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                <span className="text-sm text-gray-600">{t.maxStreak}:</span>
                <span className="font-semibold text-orange-700">
                  {gameStats.longestStreak}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Conquistas - Mobile/Tablet (lado direito) */}
          <motion.div
            className="card xl:hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="text-yellow-500" />
              {t.achievements}
            </h3>
            <div className="space-y-2">
              {gameStats.achievements.slice(0, 3).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    achievement.unlocked
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-xs opacity-75">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <span className="text-yellow-600">✓</span>
                    )}
                  </div>
                  {!achievement.unlocked && achievement.maxProgress > 1 && (
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (achievement.progress / achievement.maxProgress) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {gameStats.achievements.filter(a => a.unlocked).length > 3 && (
                <div className="text-center text-sm text-gray-500 mt-2">
                  +{gameStats.achievements.filter(a => a.unlocked).length - 3}{' '}
                  {t.moreAchievements}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {gameCompleted && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Botão Fechar */}
              <button
                onClick={handleCloseGame}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Fechar"
              >
                <X size={20} className="text-gray-600" />
              </button>

              <div className="text-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {t.congratulations}
                </h2>
                <p className="text-gray-600 mb-4">{t.gameCompleted}</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>{t.shareText.score}:</span>
                      <span className="font-bold text-yellow-600">
                        {score} {t.shareText.points}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.wordsFound}:</span>
                      <span>
                        {foundWords.length}/{gameState.words.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.shareText.time}:</span>
                      <span>{getFormattedTime()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.maxStreak}:</span>
                      <span className="text-red-600">{currentStreak}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.wordDifficulty}:</span>
                      <span>
                        {
                          t.wordDifficulties[
                            wordDifficulty as keyof typeof t.wordDifficulties
                          ]
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleNewGame}
                    className="flex-1 btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t.newGame}
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    className="flex-1 bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t.share}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WordSearchGame;
