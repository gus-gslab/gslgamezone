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
const GRID_CONFIGS: Record<string, GridConfig> = {
  small: { size: 10, rows: 12, wordCount: 6 },
  medium: { size: 12, rows: 15, wordCount: 8 },
  large: { size: 14, rows: 18, wordCount: 10 },
};

// Configurações específicas para mobile e tablet
const MOBILE_GRID_CONFIGS: Record<string, GridConfig> = {
  small: { size: 10, rows: 12, wordCount: 6 },
  medium: { size: 10, rows: 16, wordCount: 8 },
  large: { size: 10, rows: 20, wordCount: 10 },
};

// Função para obter configuração baseada no tamanho da tela
const getGridConfig = (size: string, isMobile: boolean): GridConfig => {
  if (isMobile) {
    return MOBILE_GRID_CONFIGS[size] || MOBILE_GRID_CONFIGS.medium;
  }
  return GRID_CONFIGS[size] || GRID_CONFIGS.medium;
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
    UI_TRANSLATIONS[language as keyof typeof UI_TRANSLATIONS];

  return [
    {
      id: 'first_word',
      name: translations.achievementNames.first_word,
      description: translations.achievementDescriptions.first_word,
      icon: '🎯',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'speed_demon',
      name: translations.achievementNames.speed_demon,
      description: translations.achievementDescriptions.speed_demon,
      icon: '⚡',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'word_master',
      name: translations.achievementNames.word_master,
      description: translations.achievementDescriptions.word_master,
      icon: '🏆',
      unlocked: false,
      progress: 0,
      maxProgress: 50,
    },
    {
      id: 'streak_champion',
      name: translations.achievementNames.streak_champion,
      description: translations.achievementDescriptions.streak_champion,
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

const WORD_CATALOGS = {
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
        'AZUL_CLARO',
        'AZUL_ESCURO',
        'AZUL_MARINHO',
        'AZUL_CEU',
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
        'COMPUTADOR_PESSOAL',
        'COMPUTADOR_PORTATIL',
        'COMPUTADOR_DESKTOP',
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
        'MEDICO_GERAL',
        'MEDICO_ESPECIALISTA',
        'MEDICO_RESIDENTE',
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
        'GUITARRA_ELETRICA',
        'BAIXO_ELETRICO',
        'PIANO_ELETRICO',
        'PIANO_ACUSTICO',
        'PIANO_DIGITAL',
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
        'GATO_COMPLEXO',
        'BOI_COMPLEXO',
        'RATO_COMPLEXO',
        'PATO_COMPLEXO',
        'URSO_COMPLEXO',
        'GALO_COMPLEXO',
        'CAO_COMPLEXO',
        'PORCO',
        'CAVALO',
        'VACA_COMPLEXO',
        'CARNEIRO',
        'COELHO',
        'PEIXE',
        'PASSARO',
        'CABRA',
        'OVELHA',
        'BURRO',
        'MACACO',
        'TIGRE',
        'LEAO_COMPLEXO',
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
        'MIAU_COMPLEXO',
        'BIGODE',
        'CAUDA',
        'PATAS',
      ],
      colors: [
        'AZUL_COMPLEXO',
        'ROSA_COMPLEXO',
        'ROXO_COMPLEXO',
        'CINZA',
        'OURO_COMPLEXO',
        'VERDE',
        'CORAL',
        'BEGE_COMPLEXO',
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
        'RUBI_COMPLEXO',
        'ESMERALDA',
        'JADE_COMPLEXO',
        'TURMALINA',
        'SAFIRA',
        'DIAMANTE',
        'AZUL_CLARO',
        'AZUL_ESCURO',
        'AZUL_MARINHO',
        'AZUL_CEU',
      ],
      foods: [
        'MACA_COMPLEXO',
        'BOLO_COMPLEXO',
        'SOPA_COMPLEXO',
        'OVO_COMPLEXO',
        'MEL_COMPLEXO',
        'SAL_COMPLEXO',
        'ACUCAR',
        'ARROZ',
        'FEIJAO',
        'PEIXE',
        'CARNE',
        'PAO_COMPLEXO',
        'QUEIJO',
        'BANANA',
        'LARANJA',
        'UVA_COMPLEXO',
        'PERA_COMPLEXO',
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
        'SITE_COMPLEXO',
        'PROGRAMA',
        'ARQUIVO',
        'DADOS',
        'REDE_COMPLEXO',
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
        'CABO_COMPLEXO',
        'WIFI_COMPLEXO',
        'BLUETOOTH',
        'USB_COMPLEXO',
        'HDMI_COMPLEXO',
        'MONITOR',
        'TECLADO',
        'MOUSE',
        'IMPRESSORA',
        'COMPUTADOR_PESSOAL',
        'COMPUTADOR_PORTATIL',
        'COMPUTADOR_DESKTOP',
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
        'MEDICO_GERAL',
        'MEDICO_ESPECIALISTA',
        'MEDICO_RESIDENTE',
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
        'SURF_COMPLEXO',
        'SKATE',
        'CICLISMO',
        'HANDEBOL',
        'RUGBY',
        'BADMINTON',
        'SQUASH',
        'ESGRIMA',
        'TIRO_COMPLEXO',
        'CANOAGEM',
        'REMO_COMPLEXO',
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
        'TUBA_COMPLEXO',
        'FAGOTE',
        'OBOE_COMPLEXO',
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
        'PIANO_ELETRICO',
        'PIANO_ACUSTICO',
        'PIANO_DIGITAL',
        'ORGAO',
      ],
      nature: [
        'ARVORE',
        'FLOR_COMPLEXO',
        'MONTANHA',
        'RIO_COMPLEXO',
        'OCEANO',
        'FLORESTA',
        'PRAIA',
        'DESERTO',
        'CACHOEIRA',
        'VULCAO',
        'LAGO_COMPLEXO',
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
        'GATO_DO_MATO',
        'GATO_MARACAJÁ',
        'GATO_PALHEIRO',
        'GATO_MOURISCO',
        'GATO_DO_DESERTO',
        'GATO_SELVAGEM',
        'GATO_MONTÊS',
        'GATO_DA_SELVA',
        'GATO_DO_PANTANAL',
        'GATO_DO_CERRADO',
        'GATO_DA_CAATINGA',
        'GATO_DO_MANGUE',
        'GATO_DO_BREJO',
        'GATO_DO_RIO',
        'GATO_DO_LAGO',
        'GATO_DO_MAR',
        'GATO_DO_OCEANO',
        'GATO_DO_VALE',
        'GATO_DA_MONTANHA',
        'GATO_DO_VULCÃO',
        'GATO_DA_FLORESTA',
        'GATO_DO_BOSQUE',
        'GATO_DO_JARDIM',
        'GATO_DO_PARQUE',
        'GATO_DA_PRAIA',
        'GATO_DO_DESERTO',
        'GATO_DA_CAVERNA',
        'GATO_DO_ABISMO',
        'GATO_DO_PRECIPÍCIO',
        'GATO_DO_PENHASCO',
        'GATO_DA_ROCHA',
        'GATO_DA_PEDRA',
        'GATO_DA_AREIA',
        'GATO_DA_TERRA',
        'GATO_DO_BARRO',
        'GATO_DA_ARGILA',
      ],
      colors: [
        'VERMELHO_ESCURO',
        'AZUL_MARINHO',
        'VERDE_ESMERALDA',
        'ROSA_CHOQUE',
        'DOURADO',
        'CINZA_ESCURO',
        'PRETO_PROFUNDO',
        'BRANCO_PURO',
        'MARROM_ESCURO',
        'BEGE_CLARO',
        'AMARELO_OURO',
        'LARANJA_VIVO',
        'ROXO_PROFUNDO',
        'VIOLETA_ESCURO',
        'INDIGO_ESCURO',
        'TURQUESA_VIVO',
        'MAGENTA_VIVO',
        'CIANO_VIVO',
        'LILÁS_ESCURO',
        'SALMÃO_ESCURO',
        'CREME_ESCURO',
        'BORDÔ_ESCURO',
        'CARMIM_ESCURO',
        'ESCARLATE_VIVO',
        'RUBI_ESCURO',
        'ESMERALDA_VIVO',
        'JADE_ESCURO',
        'TURMALINA_VIVO',
        'SAFIRA_ESCURO',
        'DIAMANTE_PURO',
        'AZUL_CEU',
        'AZUL_ESCURO',
        'AZUL_MARINHO',
        'AZUL_OCEANO',
      ],
      foods: [
        'MAÇÃ_VERMELHA',
        'BOLO_CHOCOLATE',
        'SOPA_LEGUMES',
        'OVO_COZIDO',
        'MEL_PURO',
        'SAL_MARINHO',
        'AÇÚCAR_MASCADO',
        'ARROZ_INTEGRAL',
        'FEIJÃO_PRETO',
        'PEIXE_GRELHADO',
        'CARNE_ASSADA',
        'PÃO_INTEGRAL',
        'QUEIJO_BRANCO',
        'BANANA_PRATA',
        'LARANJA_PERA',
        'UVA_ROXA',
        'PERA_WILLIAMS',
        'MORANGO_SELVAGEM',
        'ABACAXI_DOCE',
        'MELANCIA_SEM_SEMENTE',
        'MAMÃO_FORMOSA',
        'GOIABA_BRANCA',
        'MANGA_PALMER',
        'ABACATE_HASS',
        'LIMÃO_SICILIANO',
        'TANGERINA_PONKAN',
        'PÊSSEGO_DOCE',
        'AMEIXA_PRETA',
        'CEREJA_DOCE',
        'FRAMBOESA_SELVAGEM',
      ],
      technology: [
        'COMPUTADOR_PESSOAL',
        'TELEFONE_CELULAR',
        'INTERNET_BANDA_LARGA',
        'EMAIL_ELETRÔNICO',
        'SITE_INTERNET',
        'PROGRAMA_COMPUTADOR',
        'ARQUIVO_DIGITAL',
        'DADOS_INFORMÁTICOS',
        'REDE_COMPUTADORES',
        'SISTEMA_OPERACIONAL',
        'CÓDIGO_PROGRAMAÇÃO',
        'SENHA_SEGURANÇA',
        'LOGIN_USUÁRIO',
        'SMARTPHONE_INTELIGENTE',
        'TABLET_ELETRÔNICO',
        'LAPTOP_PORTÁTIL',
        'NOTEBOOK_PESSOAL',
        'DESKTOP_ESCRITÓRIO',
        'SERVIDOR_WEB',
        'ROTEADOR_WIRELESS',
        'MODEM_CABO',
        'CABO_ETHERNET',
        'WIFI_SEM_FIO',
        'BLUETOOTH_TECNOLOGIA',
        'USB_CONECTOR',
        'HDMI_ENTRADA',
        'MONITOR_TELA',
        'TECLADO_MECÂNICO',
        'MOUSE_ÓPTICO',
        'IMPRESSORA_LASER',
        'COMPUTADOR_PESSOAL',
        'COMPUTADOR_PORTÁTIL',
        'COMPUTADOR_ESCRITÓRIO',
      ],
      professions: [
        'MÉDICO_CIRURGIÃO',
        'PROFESSOR_UNIVERSITÁRIO',
        'ENGENHEIRO_CIVIL',
        'ADVOGADO_CRIMINAL',
        'DENTISTA_ORTOPEDISTA',
        'VETERINÁRIO_CLÍNICO',
        'ARQUITETO_URBANISTA',
        'FARMACÊUTICO_CLÍNICO',
        'ENFERMEIRO_ESPECIALISTA',
        'PSICÓLOGO_CLÍNICO',
        'PEDAGOGO_EDUCADOR',
        'FISIOTERAPEUTA_ESPECIALISTA',
        'FONOAUDIÓLOGO_TERAPEUTA',
        'TERAPEUTA_OCUPACIONAL',
        'NUTRICIONISTA_CLÍNICO',
        'BIOQUÍMICO_ANALISTA',
        'BIÓLOGO_PESQUISADOR',
        'QUÍMICO_ANALISTA',
        'FÍSICO_TEÓRICO',
        'MATEMÁTICO_PESQUISADOR',
        'ESTATÍSTICO_ANALISTA',
        'ECONOMISTA_FINANCEIRO',
        'ADMINISTRADOR_EMPRESARIAL',
        'CONTADOR_AUDITOR',
        'AUDITOR_INTERNO',
        'ANALISTA_SISTEMAS',
        'PROGRAMADOR_DESENVOLVEDOR',
        'DESENVOLVEDOR_SOFTWARE',
        'ANALISTA_SISTEMAS',
        'ADMINISTRADOR_REDES',
        'TÉCNICO_INFORMÁTICA',
        'MÉDICO_GERAL',
        'MÉDICO_ESPECIALISTA',
        'MÉDICO_RESIDENTE',
        'CLÍNICO_GERAL',
        'CIRURGIÃO_GERAL',
      ],
      sports: [
        'FUTEBOL_PROFISSIONAL',
        'BASQUETE_NACIONAL',
        'TÊNIS_PROFISSIONAL',
        'NATAÇÃO_OLÍMPICA',
        'VÔLEI_PRAIA',
        'ATLETISMO_OLÍMPICO',
        'GINÁSTICA_ARTÍSTICA',
        'SURF_PROFISSIONAL',
        'SKATE_VERTICAL',
        'CICLISMO_ESTRADA',
        'HANDEBOL_INDOOR',
        'RUGBY_UNION',
        'BADMINTON_OLÍMPICO',
        'SQUASH_INTERNACIONAL',
        'ESGRIMA_OLÍMPICA',
        'TIRO_ESPORTIVO',
        'CANOAGEM_VELOCIDADE',
        'REMO_OLÍMPICO',
        'TRIATLO_IRONMAN',
        'MARATONA_OLÍMPICA',
        'CORRIDA_ESTRADA',
        'SALTO_EM_ALTURA',
        'LANÇAMENTO_DISCO',
        'ARREMESSO_PESO',
        'DARDO_OLÍMPICO',
        'BOLICHE_PROFISSIONAL',
        'SINUCA_INTERNACIONAL',
        'BILHAR_AMERICANO',
        'PINGPONG_OLÍMPICO',
        'TÊNISMESA_OLÍMPICO',
      ],
      music: [
        'PIANO_ACÚSTICO',
        'VIOLÃO_CLÁSSICO',
        'BATERIA_ACÚSTICA',
        'FLAUTA_TRANSVERSAL',
        'SAXOFONE_TENOR',
        'TROMPETE_SOPRANO',
        'CLARINETE_SOPRANO',
        'HARPA_CELTA',
        'ACORDEÃO_DIATÔNICO',
        'TECLADO_ELETRÔNICO',
        'VIOLINO_STRADIVARIUS',
        'VIOLA_DAMORE',
        'VIOLONCELO_ACÚSTICO',
        'CONTRABAIXO_ACÚSTICO',
        'TROMBONE_TENOR',
        'TUBA_SOUSAFONE',
        'FAGOTE_BARROCO',
        'OBOÉ_FRANCÊS',
        'CORNO_FRANCÊS',
        'TIMPANI_ORQUESTRAL',
        'TRIÂNGULO_METÁLICO',
        'XILOFONE_ORQUESTRAL',
        'VIBRAFONE_JAZZ',
        'MARIMBA_AFRICANA',
        'GLOCKENSPIEL_ORQUESTRAL',
        'CELESTA_ORQUESTRAL',
        'ÓRGÃO_PIPE',
        'SINTETIZADOR_ANALÓGICO',
        'GUITARRA_ELÉTRICA',
        'BAIXO_ELÉTRICO',
        'PIANO_ELÉTRICO',
        'PIANO_ACÚSTICO',
        'PIANO_DIGITAL',
      ],
      nature: [
        'CARVALHO_CENTENÁRIO',
        'FLOR_DE_LÓTUS',
        'MONTANHA_ROCHOSA',
        'RIO_AMAZONAS',
        'OCEANO_ATLÂNTICO',
        'FLORESTA_AMAZÔNICA',
        'PRAIA_TROPICAL',
        'DESERTO_SAARA',
        'CACHOEIRA_IGUAÇU',
        'VULCÃO_ATIVO',
        'LAGO_TITICACA',
        'LAGOA_AZUL',
        'CASCATA_NATURAL',
        'SERRA_DA_MANTIQUEIRA',
        'COLINA_VERDE',
        'VALE_FLORIDO',
        'CÂNION_GRAND_CANYON',
        'CAVERNA_CRISTAL',
        'GRUTA_DE_LOURDES',
        'BURACO_NEGRO',
        'FOSSA_MARIANA',
        'ABISMO_OCEÂNICO',
        'PRECIPÍCIO_VERTICAL',
        'PENHASCO_ROCHOSO',
        'ROCHA_GRANÍTICA',
        'PEDRA_FILOSOFAL',
        'AREIA_DOURADA',
        'TERRA_FÉRTIL',
        'BARRO_VERMELHO',
        'ARGILA_BRANCA',
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
        'BLUE_LIGHT',
        'BLUE_DARK',
        'BLUE_NAVY',
        'BLUE_SKY',
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
        'COMPUTER_PERSONAL',
        'COMPUTER_LAPTOP',
        'COMPUTER_DESKTOP',
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
        'DOCTOR_GENERAL',
        'DOCTOR_SPECIALIST',
        'DOCTOR_RESIDENT',
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
        'PIANO_ELECTRIC',
        'PIANO_ACOUSTIC',
        'PIANO_DIGITAL',
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
        'CAT_COMPLEXO',
        'DOG_COMPLEXO',
        'BIRD_COMPLEXO',
        'FISH_COMPLEXO',
        'BEAR_COMPLEXO',
        'DUCK_COMPLEXO',
        'FROG_COMPLEXO',
        'DEER_COMPLEXO',
        'FOX_COMPLEXO',
        'BEE_COMPLEXO',
        'ANT_COMPLEXO',
        'RAT_COMPLEXO',
        'BAT_COMPLEXO',
        'COW_COMPLEXO',
        'HORSE',
        'PIG_COMPLEXO',
        'SHEEP',
        'GOAT_COMPLEXO',
        'DONKEY',
        'MONKEY',
        'TIGER',
        'LION_COMPLEXO',
        'ELEPHANT',
        'GIRAFFE',
        'ZEBRA',
        'WOLF_COMPLEXO',
        'OWL_COMPLEXO',
        'EAGLE',
        'HAWK_COMPLEXO',
        'PIGEON',
        'SWALLOW',
        'BUTTERFLY',
        'KITTEN',
        'KITTY',
        'FELINE',
        'TOMCAT',
        'MEOW_COMPLEXO',
        'WHISKERS',
        'TAIL_COMPLEXO',
        'PAWS_COMPLEXO',
      ],
      colors: [
        'RED_COMPLEXO',
        'BLUE_COMPLEXO',
        'GREEN',
        'PINK_COMPLEXO',
        'GOLD_COMPLEXO',
        'GRAY_COMPLEXO',
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
        'CYAN_COMPLEXO',
        'LAVENDER',
        'SALMON',
        'CREAM',
        'BURGUNDY',
        'CARMINE',
        'SCARLET',
        'RUBY_COMPLEXO',
        'EMERALD',
        'JADE_COMPLEXO',
        'TOURMALINE',
        'SAPPHIRE',
        'DIAMOND',
        'BLUE_LIGHT',
        'BLUE_DARK',
        'BLUE_NAVY',
        'BLUE_SKY',
      ],
      foods: [
        'APPLE',
        'BREAD',
        'EGG_COMPLEXO',
        'CAKE_COMPLEXO',
        'SOUP_COMPLEXO',
        'RICE_COMPLEXO',
        'FISH_COMPLEXO',
        'MEAT_COMPLEXO',
        'CORN_COMPLEXO',
        'BEANS',
        'PASTA',
        'CHEESE',
        'BANANA',
        'ORANGE',
        'GRAPE',
        'PEAR_COMPLEXO',
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
        'PLUM_COMPLEXO',
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
        'FILE_COMPLEXO',
        'DATA_COMPLEXO',
        'NETWORK',
        'SYSTEM',
        'CODE_COMPLEXO',
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
        'WIFI_COMPLEXO',
        'BLUETOOTH',
        'USB_COMPLEXO',
        'HDMI_COMPLEXO',
        'MONITOR',
        'KEYBOARD',
        'MOUSE',
        'PRINTER',
        'COMPUTER_PERSONAL',
        'COMPUTER_LAPTOP',
        'COMPUTER_DESKTOP',
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
        'DOCTOR_GENERAL',
        'DOCTOR_SPECIALIST',
        'DOCTOR_RESIDENT',
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
        'HARP_COMPLEXO',
        'ACCORDION',
        'KEYBOARD',
        'VIOLIN',
        'VIOLA',
        'CELLO',
        'DOUBLE_BASS',
        'TROMBONE',
        'TUBA_COMPLEXO',
        'BASSOON',
        'OBOE_COMPLEXO',
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
        'PIANO_ELECTRIC',
        'PIANO_ACOUSTIC',
        'PIANO_DIGITAL',
      ],
      nature: [
        'TREE_COMPLEXO',
        'FLOWER',
        'MOUNTAIN',
        'RIVER',
        'OCEAN',
        'FOREST',
        'BEACH',
        'DESERT',
        'WATERFALL',
        'VOLCANO',
        'LAKE_COMPLEXO',
        'LAGOON',
        'CASCADE',
        'RANGE',
        'HILL_COMPLEXO',
        'VALLEY',
        'CANYON',
        'CAVE_COMPLEXO',
        'GROTTO',
        'HOLE_COMPLEXO',
        'PIT_COMPLEXO',
        'ABYSS',
        'PRECIPICE',
        'CLIFF',
        'ROCK_COMPLEXO',
        'STONE',
        'SAND_COMPLEXO',
        'EARTH',
        'CLAY_COMPLEXO',
        'MUD_COMPLEXO',
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
        'DESERT_CAT',
        'SAVANNAH_CAT',
        'MOUNTAIN_CAT',
        'FOREST_CAT',
        'JUNGLE_CAT',
        'PANTANAL_CAT',
        'CERrado_CAT',
        'CAATINGA_CAT',
        'MANGROVE_CAT',
        'SWAMP_CAT',
        'RIVER_CAT',
        'LAKE_CAT',
        'SEA_CAT',
        'OCEAN_CAT',
        'VALLEY_CAT',
        'MOUNTAIN_CAT',
        'VOLCANO_CAT',
        'FOREST_CAT',
        'WOODLAND_CAT',
        'GARDEN_CAT',
        'PARK_CAT',
        'BEACH_CAT',
        'DESERT_CAT',
        'CAVE_CAT',
        'ABYSS_CAT',
        'PRECIPICE_CAT',
        'CLIFF_CAT',
        'ROCK_CAT',
        'STONE_CAT',
        'SAND_CAT',
        'EARTH_CAT',
        'CLAY_CAT',
        'MUD_CAT',
      ],
      colors: [
        'DARK_RED',
        'NAVY_BLUE',
        'EMERALD_GREEN',
        'HOT_PINK',
        'GOLDEN',
        'DARK_GRAY',
        'DEEP_BLACK',
        'PURE_WHITE',
        'DARK_BROWN',
        'LIGHT_BEIGE',
        'GOLDEN_YELLOW',
        'VIVID_ORANGE',
        'DEEP_PURPLE',
        'DARK_VIOLET',
        'DARK_INDIGO',
        'VIVID_TURQUOISE',
        'VIVID_MAGENTA',
        'VIVID_CYAN',
        'DARK_LAVENDER',
        'DARK_SALMON',
        'DARK_CREAM',
        'DARK_BURGUNDY',
        'DARK_CARMINE',
        'VIVID_SCARLET',
        'DARK_RUBY',
        'VIVID_EMERALD',
        'DARK_JADE',
        'VIVID_TOURMALINE',
        'DARK_SAPPHIRE',
        'PURE_DIAMOND',
        'SKY_BLUE',
        'DARK_BLUE',
        'NAVY_BLUE',
        'OCEAN_BLUE',
      ],
      foods: [
        'RED_APPLE',
        'CHOCOLATE_CAKE',
        'VEGETABLE_SOUP',
        'BOILED_EGG',
        'PURE_HONEY',
        'SEA_SALT',
        'BROWN_SUGAR',
        'BROWN_RICE',
        'BLACK_BEANS',
        'GRILLED_FISH',
        'ROASTED_MEAT',
        'WHOLE_WHEAT_BREAD',
        'WHITE_CHEESE',
        'SILVER_BANANA',
        'PERA_ORANGE',
        'PURPLE_GRAPE',
        'WILLIAMS_PEAR',
        'WILD_STRAWBERRY',
        'SWEET_PINEAPPLE',
        'SEEDLESS_WATERMELON',
        'FORMOSA_PAPAYA',
        'WHITE_GUAVA',
        'PALMER_MANGO',
        'HASS_AVOCADO',
        'SICILIAN_LEMON',
        'PONKAN_TANGERINE',
        'SWEET_PEACH',
        'BLACK_PLUM',
        'SWEET_CHERRY',
        'WILD_RASPBERRY',
      ],
      technology: [
        'PERSONAL_COMPUTER',
        'CELLULAR_PHONE',
        'BROADBAND_INTERNET',
        'ELECTRONIC_EMAIL',
        'INTERNET_WEBSITE',
        'COMPUTER_PROGRAM',
        'DIGITAL_FILE',
        'INFORMATICS_DATA',
        'COMPUTER_NETWORK',
        'OPERATING_SYSTEM',
        'PROGRAMMING_CODE',
        'SECURITY_PASSWORD',
        'USER_LOGIN',
        'INTELLIGENT_SMARTPHONE',
        'ELECTRONIC_TABLET',
        'PORTABLE_LAPTOP',
        'PERSONAL_NOTEBOOK',
        'OFFICE_DESKTOP',
        'WEB_SERVER',
        'WIRELESS_ROUTER',
        'CABLE_MODEM',
        'ETHERNET_CABLE',
        'WIRELESS_WIFI',
        'BLUETOOTH_TECHNOLOGY',
        'USB_CONNECTOR',
        'HDMI_INPUT',
        'SCREEN_MONITOR',
        'MECHANICAL_KEYBOARD',
        'OPTICAL_MOUSE',
        'LASER_PRINTER',
        'PERSONAL_COMPUTER',
        'PORTABLE_COMPUTER',
        'DESKTOP_COMPUTER',
      ],
      professions: [
        'SURGEON_DOCTOR',
        'UNIVERSITY_TEACHER',
        'CIVIL_ENGINEER',
        'CRIMINAL_LAWYER',
        'ORTHODONTIST_DENTIST',
        'CLINICAL_VETERINARIAN',
        'URBAN_ARCHITECT',
        'CLINICAL_PHARMACIST',
        'SPECIALIST_NURSE',
        'CLINICAL_PSYCHOLOGIST',
        'EDUCATIONAL_PEDAGOGUE',
        'SPECIALIST_PHYSIOTHERAPIST',
        'THERAPEUTIC_SPEECH_THERAPIST',
        'OCCUPATIONAL_THERAPIST',
        'CLINICAL_NUTRITIONIST',
        'ANALYTICAL_BIOCHEMIST',
        'RESEARCH_BIOLOGIST',
        'ANALYTICAL_CHEMIST',
        'THEORETICAL_PHYSICIST',
        'RESEARCH_MATHEMATICIAN',
        'ANALYTICAL_STATISTICIAN',
        'FINANCIAL_ECONOMIST',
        'BUSINESS_ADMINISTRATOR',
        'AUDITOR_ACCOUNTANT',
        'INTERNAL_AUDITOR',
        'SYSTEMS_ANALYST',
        'DEVELOPER_PROGRAMMER',
        'SOFTWARE_DEVELOPER',
        'SYSTEMS_ANALYST',
        'NETWORK_ADMINISTRATOR',
        'INFORMATICS_TECHNICIAN',
        'GENERAL_DOCTOR',
        'SPECIALIST_DOCTOR',
        'RESIDENT_DOCTOR',
        'GENERAL_PHYSICIAN',
        'GENERAL_SURGEON',
      ],
      sports: [
        'PROFESSIONAL_FOOTBALL',
        'NATIONAL_BASKETBALL',
        'PROFESSIONAL_TENNIS',
        'OLYMPIC_SWIMMING',
        'BEACH_VOLLEYBALL',
        'OLYMPIC_ATHLETICS',
        'ARTISTIC_GYMNASTICS',
        'PROFESSIONAL_SURFING',
        'VERTICAL_SKATEBOARDING',
        'ROAD_CYCLING',
        'INDOOR_HANDBALL',
        'RUGBY_UNION',
        'OLYMPIC_BADMINTON',
        'INTERNATIONAL_SQUASH',
        'OLYMPIC_FENCING',
        'SPORT_SHOOTING',
        'SPEED_CANOEING',
        'OLYMPIC_ROWING',
        'IRONMAN_TRIATHLON',
        'OLYMPIC_MARATHON',
        'ROAD_RUNNING',
        'HIGH_JUMP',
        'DISCUS_THROW',
        'SHOT_PUT',
        'OLYMPIC_JAVELIN',
        'PROFESSIONAL_BOWLING',
        'INTERNATIONAL_SNOOKER',
        'AMERICAN_BILLIARDS',
        'OLYMPIC_PINGPONG',
        'OLYMPIC_TABLETENNIS',
      ],
      music: [
        'ACOUSTIC_PIANO',
        'CLASSICAL_GUITAR',
        'ACOUSTIC_DRUMS',
        'TRANSVERSE_FLUTE',
        'TENOR_SAXOPHONE',
        'SOPRANO_TRUMPET',
        'SOPRANO_CLARINET',
        'CELTIC_HARP',
        'DIATONIC_ACCORDION',
        'ELECTRONIC_KEYBOARD',
        'STRADIVARIUS_VIOLIN',
        'VIOLA_DAMORE',
        'ACOUSTIC_CELLO',
        'ACOUSTIC_DOUBLE_BASS',
        'TENOR_TROMBONE',
        'SOUSAPHONE_TUBA',
        'BAROQUE_BASSOON',
        'FRENCH_OBOE',
        'FRENCH_HORN',
        'ORCHESTRAL_TIMPANI',
        'METAL_TRIANGLE',
        'ORCHESTRAL_XYLOPHONE',
        'JAZZ_VIBRAPHONE',
        'AFRICAN_MARIMBA',
        'ORCHESTRAL_GLOCKENSPIEL',
        'ORCHESTRAL_CELESTA',
        'PIPE_ORGAN',
        'ANALOG_SYNTHESIZER',
        'ELECTRIC_GUITAR',
        'ELECTRIC_BASS',
        'ELECTRIC_PIANO',
        'ACOUSTIC_PIANO',
        'DIGITAL_PIANO',
      ],
      nature: [
        'CENTENNIAL_OAK',
        'LOTUS_FLOWER',
        'ROCKY_MOUNTAIN',
        'AMAZON_RIVER',
        'ATLANTIC_OCEAN',
        'AMAZON_FOREST',
        'TROPICAL_BEACH',
        'SAHARA_DESERT',
        'IGUAZU_WATERFALL',
        'ACTIVE_VOLCANO',
        'TITICACA_LAKE',
        'BLUE_LAGOON',
        'NATURAL_CASCADE',
        'MANTIQUEIRA_RANGE',
        'GREEN_HILL',
        'FLORID_VALLEY',
        'GRAND_CANYON',
        'CRYSTAL_CAVE',
        'LOURDES_GROTTO',
        'BLACK_HOLE',
        'MARIANA_TRENCH',
        'OCEANIC_ABYSS',
        'VERTICAL_PRECIPICE',
        'ROCKY_CLIFF',
        'GRANITE_ROCK',
        'PHILOSOPHERS_STONE',
        'GOLDEN_SAND',
        'FERTILE_EARTH',
        'RED_CLAY',
        'WHITE_CLAY',
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
        'AZUL_CLARO',
        'AZUL_OSCURO',
        'AZUL_MARINO',
        'AZUL_CIELO',
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
        'COMPUTADORA_PERSONAL',
        'COMPUTADORA_PORTATIL',
        'COMPUTADORA_ESCRITORIO',
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
        'MEDICO_GENERAL',
        'MEDICO_ESPECIALISTA',
        'MEDICO_RESIDENTE',
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
        'GUITARRA_ELECTRICA',
        'BAJO_ELECTRICO',
        'PIANO_ELECTRICO',
        'PIANO_ACUSTICO',
        'PIANO_DIGITAL',
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
        'GATO_COMPLEXO',
        'PERRO',
        'PAJARO',
        'PEZ_COMPLEXO',
        'OSO_COMPLEXO',
        'PATO_COMPLEXO',
        'RANA_COMPLEXO',
        'CIERVO',
        'ZORRO',
        'ABEJA',
        'HORMIGA',
        'RATA_COMPLEXO',
        'MURCIELAGO',
        'VACA_COMPLEXO',
        'CABALLO',
        'CERDO',
        'OVEJA',
        'CABRA',
        'BURRO',
        'MONO_COMPLEXO',
        'TIGRE',
        'LEON_COMPLEXO',
        'ELEFANTE',
        'JIRAFA',
        'CEBRA',
        'LOBO_COMPLEXO',
        'BUHO_COMPLEXO',
        'AGUILA',
        'HALCON',
        'PALOMA',
        'GOLONDRINA',
        'MARIPOSA',
        'GATITO',
        'GATON',
        'FELINO',
        'MININO',
        'MIAU_COMPLEXO',
        'BIGOTES',
        'COLA_COMPLEXO',
        'PATAS',
      ],
      colors: [
        'ROJO_COMPLEXO',
        'AZUL_COMPLEXO',
        'VERDE',
        'ROSA_COMPLEXO',
        'ORO_COMPLEXO',
        'GRIS_COMPLEXO',
        'NEGRO',
        'BLANCO',
        'CAFE_COMPLEXO',
        'BEIGE',
        'AMARILLO',
        'NARANJA',
        'MORADO',
        'VIOLET',
        'INDIGO',
        'TURQUESA',
        'MAGENTA',
        'CIAN_COMPLEXO',
        'LAVANDA',
        'SALMON',
        'CREMA',
        'BURGUNDY',
        'CARMESIN',
        'ESCARLATA',
        'RUBI_COMPLEXO',
        'ESMERALDA',
        'JADE_COMPLEXO',
        'TURMALINA',
        'ZAFIRO',
        'DIAMANTE',
        'AZUL_CLARO',
        'AZUL_OSCURO',
        'AZUL_MARINO',
        'AZUL_CIELO',
      ],
      foods: [
        'MANZANA',
        'PAN_COMPLEXO',
        'HUEVO',
        'PASTEL',
        'SOPA_COMPLEXO',
        'ARROZ',
        'PESCADO',
        'CARNE',
        'MAIZ_COMPLEXO',
        'QUESO',
        'PLATANO',
        'NARANJA',
        'UVA_COMPLEXO',
        'PERA_COMPLEXO',
        'FRESA',
        'PINA_COMPLEXO',
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
        'MORA_COMPLEXO',
        'KIWI_COMPLEXO',
      ],
      technology: [
        'COMPUTADORA',
        'TELEFONO',
        'INTERNET',
        'CORREO',
        'SITIO_WEB',
        'PROGRAMA',
        'ARCHIVO',
        'DATOS',
        'RED_COMPLEXO',
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
        'WIFI_COMPLEXO',
        'BLUETOOTH',
        'USB_COMPLEXO',
        'HDMI_COMPLEXO',
        'MONITOR',
        'TECLADO',
        'RATON',
        'IMPRESORA',
        'COMPUTADORA_PERSONAL',
        'COMPUTADORA_PORTATIL',
        'COMPUTADORA_ESCRITORIO',
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
        'SPEECH_THERAPIST',
        'OCCUPATIONAL_THERAPIST',
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
        'SYSTEMS_ANALYST',
        'NETWORK_ADMINISTRATOR',
        'IT_TECHNICIAN',
        'DOCTOR_GENERAL',
        'DOCTOR_SPECIALIST',
        'DOCTOR_RESIDENT',
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
        'SURF_COMPLEXO',
        'SKATE',
        'CICLISMO',
        'BALONMANO',
        'RUGBY',
        'BADMINTON',
        'SQUASH',
        'ESGRIMA',
        'TIRO_COMPLEXO',
        'CANOTAJE',
        'REMO_COMPLEXO',
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
        'ARPA_COMPLEXO',
        'ACORDEON',
        'TECLADO',
        'VIOLIN',
        'VIOLA',
        'VIOLONCHELO',
        'CONTRABAJO',
        'TROMBON',
        'TUBA_COMPLEXO',
        'FAGOT',
        'OBOE_COMPLEXO',
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
        'PIANO_ELECTRICO',
        'PIANO_ACUSTICO',
        'PIANO_DIGITAL',
      ],
      nature: [
        'ARBOL',
        'FLOR_COMPLEXO',
        'MONTAÑA',
        'RIO_COMPLEXO',
        'OCEANO',
        'BOSQUE',
        'PLAYA',
        'DESIERTO',
        'CASCADA',
        'VOLCAN',
        'LAGO_COMPLEXO',
        'LAGUNA',
        'SIERRA',
        'COLINA',
        'VALLE',
        'CANON',
        'CUEVA',
        'GRUTA',
        'AGUJERO',
        'FOSA_COMPLEXO',
        'ABISMO',
        'PRECIPICIO',
        'ACANTILADO',
        'ROCA_COMPLEXO',
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
        'GATO_DEL_MATO',
        'GATO_MARACAYA',
        'GATO_PALHEIRO',
        'GATO_MOURISCO',
        'GATO_DEL_DESIERTO',
        'GATO_SELVATICO',
        'GATO_MONTES',
        'GATO_DE_LA_SELVA',
        'GATO_DEL_PANTANAL',
        'GATO_DEL_CERRADO',
        'GATO_DE_LA_CAATINGA',
        'GATO_DEL_MANGLE',
        'GATO_DEL_BREJO',
        'GATO_DEL_RIO',
        'GATO_DEL_LAGO',
        'GATO_DEL_MAR',
        'GATO_DEL_OCEANO',
        'GATO_DEL_VALLE',
        'GATO_DE_LA_MONTANA',
        'GATO_DEL_VOLCAN',
        'GATO_DE_LA_FLORESTA',
        'GATO_DEL_BOSQUE',
        'GATO_DEL_JARDIN',
        'GATO_DEL_PARQUE',
        'GATO_DE_LA_PLAYA',
        'GATO_DEL_DESIERTO',
        'GATO_DE_LA_CAVERNA',
        'GATO_DEL_ABISMO',
        'GATO_DEL_PRECIPICIO',
        'GATO_DEL_PENHASCO',
        'GATO_DE_LA_ROCA',
        'GATO_DE_LA_PIEDRA',
        'GATO_DE_LA_ARENA',
        'GATO_DE_LA_TIERRA',
        'GATO_DEL_BARRO',
        'GATO_DE_LA_ARCILLA',
      ],
      colors: [
        'ROJO_OSCURO',
        'AZUL_MARINO',
        'VERDE_ESMERALDA',
        'ROSA_CHOQUE',
        'DORADO',
        'GRIS_OSCURO',
        'NEGRO_PROFUNDO',
        'BLANCO_PURO',
        'CAFE_OSCURO',
        'BEIGE_CLARO',
        'AMARILLO_ORO',
        'NARANJA_VIVO',
        'MORADO_PROFUNDO',
        'VIOLETA_OSCURO',
        'INDIGO_OSCURO',
        'TURQUESA_VIVO',
        'MAGENTA_VIVO',
        'CIAN_VIVO',
        'LAVANDA_OSCURO',
        'SALMON_OSCURO',
        'CREMA_OSCURO',
        'BURGUNDY_OSCURO',
        'CARMIN_OSCURO',
        'ESCARLATA_VIVO',
        'RUBI_OSCURO',
        'ESMERALDA_VIVO',
        'JADE_OSCURO',
        'TURMALINA_VIVO',
        'ZAFIRO_OSCURO',
        'DIAMANTE_PURO',
        'AZUL_CIELO',
        'AZUL_OSCURO',
        'AZUL_MARINO',
        'AZUL_OCEANO',
      ],
      foods: [
        'MANZANA_ROJA',
        'PAN_CHOCOLATE',
        'SOPA_LEGUMBRES',
        'HUEVO_COCIDO',
        'MIEL_PURO',
        'SAL_MARINA',
        'AZUCAR_MASCABADO',
        'ARROZ_INTEGRAL',
        'FRIJOL_NEGRO',
        'PESCADO_ASADO',
        'CARNE_ASADA',
        'PAN_INTEGRAL',
        'QUESO_BLANCO',
        'PLATANO_PLATA',
        'NARANJA_PERA',
        'UVA_MORADA',
        'PERA_WILLIAMS',
        'FRESA_SELVATICA',
        'PINA_DULCE',
        'SANDIA_SIN_SEMILLA',
        'PAPAYA_FORMOSA',
        'GUAYABA_BLANCA',
        'MANGO_PALMER',
        'AGUACATE_HASS',
        'LIMON_SICILIANO',
        'MANDARINA_PONKAN',
        'MELOCOTON_DULCE',
        'CIRUELA_NEGRA',
        'CEREZA_DULCE',
        'FRAMBUESA_SELVATICA',
      ],
      technology: [
        'COMPUTADORA_PERSONAL',
        'TELEFONO_CELULAR',
        'INTERNET_BANDA_ANCHA',
        'CORREO_ELECTRONICO',
        'SITIO_INTERNET',
        'PROGRAMA_COMPUTADORA',
        'ARCHIVO_DIGITAL',
        'DATOS_INFORMATICOS',
        'RED_COMPUTADORAS',
        'SISTEMA_OPERATIVO',
        'CODIGO_PROGRAMACION',
        'CONTRASEÑA_SEGURIDAD',
        'INICIO_SESION_USUARIO',
        'SMARTPHONE_INTELIGENTE',
        'TABLET_ELECTRONICO',
        'LAPTOP_PORTATIL',
        'NOTEBOOK_PERSONAL',
        'DESKTOP_ESCRITORIO',
        'SERVIDOR_WEB',
        'ROUTER_WIRELESS',
        'MODEM_CABLE',
        'CABLE_ETHERNET',
        'WIFI_SIN_CABLE',
        'BLUETOOTH_TECNOLOGIA',
        'USB_CONECTOR',
        'HDMI_ENTRADA',
        'MONITOR_PANTALLA',
        'TECLADO_MECANICO',
        'RATON_OPTICO',
        'IMPRESORA_LASER',
        'COMPUTADORA_PERSONAL',
        'COMPUTADORA_PORTATIL',
        'COMPUTADORA_ESCRITORIO',
      ],
      professions: [
        'MEDICO_CIRUJANO',
        'PROFESOR_UNIVERSITARIO',
        'INGENIERO_CIVIL',
        'ABOGADO_CRIMINAL',
        'DENTISTA_ORTOPEDISTA',
        'VETERINARIO_CLINICO',
        'ARQUITECTO_URBANISTA',
        'FARMACEUTICO_CLINICO',
        'ENFERMERO_ESPECIALISTA',
        'PSICOLOGO_CLINICO',
        'PEDAGOGO_EDUCADOR',
        'FISIOTERAPEUTA_ESPECIALISTA',
        'FONOAUDIOLOGO_TERAPEUTA',
        'TERAPEUTA_OCUPACIONAL',
        'NUTRICIONISTA_CLINICO',
        'BIOQUIMICO_ANALISTA',
        'BIOLOGO_INVESTIGADOR',
        'QUIMICO_ANALISTA',
        'FISICO_TEORICO',
        'MATEMATICO_INVESTIGADOR',
        'ESTADISTICO_ANALISTA',
        'ECONOMISTA_FINANCIERO',
        'ADMINISTRADOR_EMPRESARIAL',
        'CONTADOR_AUDITOR',
        'AUDITOR_INTERNO',
        'ANALISTA_SISTEMAS',
        'PROGRAMADOR_DESARROLLADOR',
        'DESARROLLADOR_SOFTWARE',
        'ANALISTA_SISTEMAS',
        'ADMINISTRADOR_REDES',
        'TECNICO_INFORMATICA',
        'MEDICO_GENERAL',
        'MEDICO_ESPECIALISTA',
        'MEDICO_RESIDENTE',
        'CLINICO_GENERAL',
        'CIRUJANO_GENERAL',
      ],
      sports: [
        'FUTBOL_PROFESIONAL',
        'BALONCESTO_NACIONAL',
        'TENIS_PROFESIONAL',
        'NATACION_OLIMPICA',
        'VOLEIBOL_PLAYA',
        'ATLETISMO_OLIMPICO',
        'GIMNASIA_ARTISTICA',
        'SURF_PROFESIONAL',
        'SKATE_VERTICAL',
        'CICLISMO_RUTA',
        'BALONMANO_INDOOR',
        'RUGBY_UNION',
        'BADMINTON_OLIMPICO',
        'SQUASH_INTERNACIONAL',
        'ESGRIMA_OLIMPICA',
        'TIRO_DEPORTIVO',
        'CANOTAJE_VELOCIDAD',
        'REMO_OLIMPICO',
        'TRIATLON_IRONMAN',
        'MARATON_OLIMPICA',
        'CARRERA_RUTA',
        'SALTO_ALTURA',
        'LANZAMIENTO_DISCO',
        'ARREMESSO_PESO',
        'DARDO_OLIMPICO',
        'BOLICHE_PROFESIONAL',
        'SINUCA_INTERNACIONAL',
        'BILLAR_AMERICANO',
        'PINGPONG_OLIMPICO',
        'TENISMESA_OLIMPICO',
      ],
      music: [
        'PIANO_ACUSTICO',
        'GUITARRA_CLASICA',
        'BATERIA_ACUSTICA',
        'FLAUTA_TRANSVERSAL',
        'SAXOFON_TENOR',
        'TROMPETA_SOPRANO',
        'CLARINETE_SOPRANO',
        'ARPA_CELTA',
        'ACORDEON_DIATONICO',
        'TECLADO_ELECTRONICO',
        'VIOLIN_STRADIVARIUS',
        'VIOLA_DAMORE',
        'VIOLONCHELO_ACUSTICO',
        'CONTRABAJO_ACUSTICO',
        'TROMBON_TENOR',
        'TUBA_SOUSAFONE',
        'FAGOT_BARROCO',
        'OBOE_FRANCES',
        'CORNO_FRANCES',
        'TIMPANI_ORQUESTRAL',
        'TRIANGULO_METALICO',
        'XILOFONO_ORQUESTRAL',
        'VIBRAFONO_JAZZ',
        'MARIMBA_AFRICANA',
        'GLOCKENSPIEL_ORQUESTRAL',
        'CELESTA_ORQUESTRAL',
        'ORGANO_PIPE',
        'SINTETIZADOR_ANALOGICO',
        'GUITARRA_ELECTRICA',
        'BAJO_ELECTRICO',
        'PIANO_ELECTRICO',
        'PIANO_ACUSTICO',
        'PIANO_DIGITAL',
      ],
      nature: [
        'ROBLE_CENTENARIO',
        'FLOR_DE_LOTO',
        'MONTAÑA_ROCOSA',
        'RIO_AMAZONAS',
        'OCEANO_ATLANTICO',
        'BOSQUE_AMAZONICO',
        'PLAYA_TROPICAL',
        'DESIERTO_SAHARA',
        'CASCADA_IGUAZU',
        'VOLCAN_ACTIVO',
        'LAGO_TITICACA',
        'LAGUNA_AZUL',
        'CASCADA_NATURAL',
        'SIERRA_MANTIQUEIRA',
        'COLINA_VERDE',
        'VALLE_FLORIDO',
        'CANON_GRAND_CANYON',
        'CUEVA_CRISTAL',
        'GRUTA_DE_LOURDES',
        'AGUJERO_NEGRO',
        'FOSA_MARIANA',
        'ABISMO_OCEANICO',
        'PRECIPICIO_VERTICAL',
        'ACANTILADO_ROCOSO',
        'ROCA_GRANITICA',
        'PIEDRA_FILOSOFAL',
        'ARENA_DORADA',
        'TIERRA_FERTIL',
        'ARCILLA_ROJA',
        'BARRO_BLANCO',
      ],
    },
  },
};

const UI_TRANSLATIONS = {
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
      first_word: 'Primeira Palavra',
      speed_demon: 'Demônio da Velocidade',
      word_master: 'Mestre das Palavras',
      streak_champion: 'Campeão da Sequência',
      perfectionist: 'Perfeccionista',
    },
    achievementDescriptions: {
      first_word: 'Encontre sua primeira palavra',
      speed_demon: 'Complete um jogo em menos de 2 minutos',
      word_master: 'Encontre 50 palavras no total',
      streak_champion: 'Encontre 5 palavras consecutivas',
      perfectionist: 'Complete 10 jogos sem erros',
    },
    achievementToast: {
      first_word: '🏆 Conquista: Primeira Palavra!',
      speed_demon: '🏆 Conquista: Demônio da Velocidade!',
      word_master: '🏆 Conquista: Mestre das Palavras!',
      streak_champion: '🏆 Conquista: Campeão da Sequência!',
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
      first_word: 'First Word',
      speed_demon: 'Speed Demon',
      word_master: 'Word Master',
      streak_champion: 'Streak Champion',
      perfectionist: 'Perfectionist',
    },
    achievementDescriptions: {
      first_word: 'Find your first word',
      speed_demon: 'Complete a game in less than 2 minutes',
      word_master: 'Find 50 words in total',
      streak_champion: 'Find 5 consecutive words',
      perfectionist: 'Complete 10 games without mistakes',
    },
    achievementToast: {
      first_word: '🏆 Achievement: First Word!',
      speed_demon: '🏆 Achievement: Speed Demon!',
      word_master: '🏆 Achievement: Word Master!',
      streak_champion: '🏆 Achievement: Streak Champion!',
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
      first_word: 'Primera Palabra',
      speed_demon: 'Demonio de Velocidad',
      word_master: 'Maestro de Palabras',
      streak_champion: 'Campeón de Secuencia',
      perfectionist: 'Perfeccionista',
    },
    achievementDescriptions: {
      first_word: 'Encuentra tu primera palabra',
      speed_demon: 'Completa un juego en menos de 2 minutos',
      word_master: 'Encuentra 50 palabras en total',
      streak_champion: 'Encuentra 5 palabras consecutivas',
      perfectionist: 'Completa 10 juegos sin errores',
    },
    achievementToast: {
      first_word: '🏆 Logro: Primera Palabra!',
      speed_demon: '🏆 Logro: Demonio de Velocidad!',
      word_master: '🏆 Logro: Maestro de Palabras!',
      streak_champion: '🏆 Logro: Campeón de Secuencia!',
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
      const categoryWords = (WORD_CATALOGS as any)[language]?.[
        wordDifficulty
      ]?.[category];
      console.log('Category words found:', categoryWords?.length);
      console.log('WORD_CATALOGS structure:', {
        hasLanguage: !!WORD_CATALOGS[language as keyof typeof WORD_CATALOGS],
        hasDifficulty:
          !!WORD_CATALOGS[language as keyof typeof WORD_CATALOGS]?.[
            wordDifficulty as keyof typeof WORD_CATALOGS.pt
          ],
        hasCategory: !!(WORD_CATALOGS as any)[language]?.[wordDifficulty]?.[
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
          WORD_CATALOGS[language as keyof typeof WORD_CATALOGS]?.[
            wordDifficulty as keyof typeof WORD_CATALOGS.pt
          ] || {}
        );
        if (availableCategories.length > 0) {
          const fallbackCategory = availableCategories[0];
          const fallbackWords = (WORD_CATALOGS as any)[language]?.[
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
          (a: Achievement) => a.id === 'first_word'
        );
        if (firstWord && !firstWord.unlocked) {
          firstWord.progress = 1;
          firstWord.unlocked = true;
          toast.success(translations.achievementToast.first_word, {
            duration: 3000,
            icon: '🎯',
          });
        }

        // Mestre das palavras
        const wordMaster = achievements.find(
          (a: Achievement) => a.id === 'word_master'
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
            toast.success(translations.achievementToast.word_master, {
              duration: 3000,
              icon: '🏆',
            });
          }
        }

        // Campeão da sequência
        const streakChampion = achievements.find(
          (a: Achievement) => a.id === 'streak_champion'
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
            toast.success(translations.achievementToast.streak_champion, {
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
          (a: Achievement) => a.id === 'speed_demon'
        );
        if (speedDemon && !speedDemon.unlocked && completionTime < 120) {
          // menos de 2 minutos
          speedDemon.unlocked = true;
          toast.success(translations.achievementToast.speed_demon, {
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
    (_row: number, _col: number, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (gameCompleted) return;
      setIsSelecting(true);
      onCellStart(_row, _col);
    },
    [gameCompleted, onCellStart]
  );

  const handleCellMove = useCallback(
    (_row: number, _col: number, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isSelecting || gameCompleted) return;
      onCellMove(_row, _col);
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
  const t = UI_TRANSLATIONS[language as keyof typeof UI_TRANSLATIONS];
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
      window.gtag('event', 'word_found', {
        word: word,
        game_category: category,
        game_difficulty: wordDifficulty,
        event_category: 'Game',
        event_label: word,
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
        window.gtag('event', 'game_start', {
          game_category: category,
          game_difficulty: wordDifficulty,
          game_language: language,
          event_category: 'Game',
          event_label: `${category}_${wordDifficulty}_${language}`,
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
      window.gtag('event', 'settings_change', {
        setting_name: 'new_game',
        old_value: 'previous',
        new_value: 'new',
        event_category: 'Settings',
        event_label: 'new_game',
      });
      console.log('Analytics: Settings change tracked', {
        setting: 'new_game',
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
          share_platform: platform,
          event_category: 'Social',
          event_label: platform,
          game_category: category,
          game_difficulty: wordDifficulty,
          game_language: language,
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
      WORD_CATALOGS[language as keyof typeof WORD_CATALOGS]?.[
        wordDifficulty as keyof typeof WORD_CATALOGS.pt
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
        window.gtag('event', 'game_complete', {
          game_category: category,
          game_difficulty: wordDifficulty,
          game_language: language,
          words_found: foundWords.length,
          completion_time: completionTime,
          event_category: 'Game',
          event_label: `${category}_${wordDifficulty}_${language}`,
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
