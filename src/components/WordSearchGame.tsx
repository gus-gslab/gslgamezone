import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, Settings, Trophy, Share2, Star, Target, Award, Zap, Clock, TrendingUp, ArrowLeft, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useWindowSize } from '../hooks/useWindowSize';
import { useTranslation } from 'react-i18next';

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
  large: { size: 14, rows: 18, wordCount: 10 }
};

const DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];

// Sistema de Pontuação
const SCORING = {
  wordFound: 100,
  timeBonus: 50, // pontos por segundo restante
  streakBonus: 25, // bônus por palavras consecutivas
  difficultyMultiplier: {
    easy: 1,
    medium: 1.5,
    hard: 2
  }
};

// Conquistas
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_word',
    name: 'Primeira Palavra',
    description: 'Encontre sua primeira palavra',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'speed_demon',
    name: 'Demônio da Velocidade',
    description: 'Complete um jogo em menos de 2 minutos',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'word_master',
    name: 'Mestre das Palavras',
    description: 'Encontre 50 palavras no total',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'streak_champion',
    name: 'Campeão da Sequência',
    description: 'Encontre 5 palavras consecutivas',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Complete 10 jogos sem erros',
    icon: '💎',
    unlocked: false,
    progress: 0,
    maxProgress: 10
  }
];

const WORD_CATALOGS = {
  pt: {
    easy: {
      animals: ['GATO', 'BOI', 'RATO', 'PATO', 'URSO', 'GALO', 'CAO', 'GATO', 'PORCO', 'CAVALO', 'VACA', 'CARNEIRO', 'COELHO', 'PEIXE', 'PASSARO'],
      colors: ['AZUL', 'ROSA', 'ROXO', 'CINZA', 'OURO', 'VERDE', 'CORAL', 'BEGE', 'MARROM', 'PRETO', 'BRANCO', 'AMARELO', 'LARANJA'],
      foods: ['MACA', 'BOLO', 'SOPA', 'OVO', 'MEL', 'SAL', 'ACUCAR', 'ARROZ', 'FEIJAO', 'PEIXE', 'CARNE', 'PAO', 'QUEIJO', 'BANANA', 'LARANJA'],
      technology: ['COMPUTADOR', 'TELEFONE', 'INTERNET', 'EMAIL', 'SITE', 'PROGRAMA', 'ARQUIVO', 'DADOS', 'REDE', 'SISTEMA', 'CODIGO', 'SENHA', 'LOGIN'],
      professions: ['MEDICO', 'PROFESSOR', 'ENGENHEIRO', 'ADVOGADO', 'DENTISTA', 'VETERINARIO', 'ARQUITETO', 'FARMACEUTICO', 'ENFERMEIRO', 'PSICOLOGO'],
      sports: ['FUTEBOL', 'BASQUETE', 'TENIS', 'NATACAO', 'VOLEI', 'ATLETISMO', 'GINASTICA', 'SURF', 'SKATE', 'CICLISMO'],
      music: ['PIANO', 'VIOLAO', 'BATERIA', 'FLAUTA', 'SAXOFONE', 'TROMPETE', 'CLARINETE', 'HARPA', 'ACORDEAO', 'TECLADO'],
      nature: ['ARVORE', 'FLOR', 'MONTANHA', 'RIO', 'OCEANO', 'FLORESTA', 'PRAIA', 'DESERTO', 'CACHOEIRA', 'VULCAO']
    },
    medium: {
      animals: ['CACHORRO', 'PASSARO', 'CAVALO', 'BORBOLETA', 'ELEFANTE', 'GIRAFA', 'CROCODILO', 'PINGUIM', 'LEAO', 'TIGRE', 'MACACO', 'ZEBRA'],
      foods: ['HAMBURGUER', 'MACARRAO', 'CHOCOLATE', 'MORANGO', 'ABACAXI', 'MELANCIA', 'BANANA', 'SANDUICHE', 'PIZZA', 'LASANHA'],
      technology: ['SMARTPHONE', 'ALGORITMO', 'PROGRAMACAO', 'BLUETOOTH', 'NANOTECNOLOGIA', 'CRIPTOGRAFIA', 'BLOCKCHAIN', 'DATABASE', 'SOFTWARE', 'HARDWARE'],
      professions: ['CARDIOLOGISTA', 'NEUROLOGISTA', 'PEDIATRA', 'ORTOPEDISTA', 'DERMATOLOGISTA', 'OFTALMOLOGISTA', 'PSIQUIATRA', 'RADIOLOGISTA'],
      sports: ['HANDEBOL', 'RUGBY', 'BADMINTON', 'SQUASH', 'ESGRIMA', 'TIRO', 'CANOAGEM', 'REMADOR', 'TRIATLO', 'MARATONA'],
      music: ['ORQUESTRA', 'CORAL', 'JAZZ', 'ROCK', 'SAMBA', 'BOSSA', 'MPB', 'FORRO', 'AXE', 'FUNK'],
      nature: ['BIODIVERSIDADE', 'ECOSSISTEMA', 'SUSTENTABILIDADE', 'CONSERVACAO', 'PRESERVACAO', 'RECICLAGEM', 'ENERGIA', 'RENOVAVEL']
    },
    hard: {
      animals: ['RINOCERONTE', 'HIPOPOTAMO', 'ORNITORRINCO', 'SALAMANDRA', 'MORCEGO', 'TUBARAO', 'POLVO', 'LIBELULA', 'ESCORPIAO', 'TARANTULA'],
      technology: ['INTELIGENCIA ARTIFICIAL', 'MACHINE LEARNING', 'DEEP LEARNING', 'NEURAL NETWORK', 'QUANTUM COMPUTING', 'BIOTECHNOLOGY', 'ROBOTICS', 'CYBERSECURITY'],
      professions: ['NEUROCIRURGIAO', 'CARDIOVASCULAR', 'ONCOLOGISTA', 'HEMATOLOGISTA', 'ENDOCRINOLOGISTA', 'GASTROENTEROLOGISTA', 'NEFROLOGISTA', 'REUMATOLOGISTA'],
      sports: ['PARAOLIMPICO', 'PENTATLO', 'DECATLO', 'HEPTATLO', 'TRIATLO', 'ULTRAMARATONA', 'ALPINISMO', 'ESPELEOLOGIA'],
      music: ['SINFONIA', 'CONCERTO', 'OPERA', 'BALLET', 'MUSICAL', 'ORATORIO', 'CANTATA', 'SONATA', 'FUGUE', 'RAPSODIA'],
      nature: ['BIODIVERSIDADE', 'ECOSSISTEMA', 'SUSTENTABILIDADE', 'CONSERVACAO', 'PRESERVACAO', 'RECICLAGEM', 'ENERGIA', 'RENOVAVEL']
    }
  },
  en: {
    easy: {
      animals: ['CAT', 'DOG', 'BIRD', 'FISH', 'BEAR', 'DUCK', 'FROG', 'DEER', 'FOX', 'BEE', 'ANT', 'RAT', 'BAT'],
      colors: ['RED', 'BLUE', 'GREEN', 'PINK', 'GOLD', 'GRAY', 'BLACK', 'WHITE', 'BROWN', 'BEIGE', 'YELLOW', 'ORANGE'],
      foods: ['APPLE', 'BREAD', 'EGG', 'CAKE', 'SOUP', 'RICE', 'FISH', 'MEAT', 'CORN', 'BEANS', 'PASTA', 'CHEESE', 'BANANA', 'ORANGE'],
      technology: ['COMPUTER', 'PHONE', 'INTERNET', 'EMAIL', 'WEBSITE', 'PROGRAM', 'FILE', 'DATA', 'NETWORK', 'SYSTEM', 'CODE'],
      professions: ['DOCTOR', 'TEACHER', 'ENGINEER', 'LAWYER', 'DENTIST', 'VETERINARIAN', 'ARCHITECT', 'PHARMACIST', 'NURSE', 'PSYCHOLOGIST'],
      sports: ['FOOTBALL', 'BASKETBALL', 'TENNIS', 'SWIMMING', 'VOLLEYBALL', 'ATHLETICS', 'GYMNASTICS', 'SURFING', 'SKATEBOARDING', 'CYCLING'],
      music: ['PIANO', 'GUITAR', 'DRUMS', 'FLUTE', 'SAXOPHONE', 'TRUMPET', 'CLARINET', 'HARP', 'ACCORDION', 'KEYBOARD'],
      nature: ['TREE', 'FLOWER', 'MOUNTAIN', 'RIVER', 'OCEAN', 'FOREST', 'BEACH', 'DESERT', 'WATERFALL', 'VOLCANO']
    },
    medium: {
      animals: ['ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'BUTTERFLY', 'CROCODILE', 'KANGAROO', 'CHEETAH', 'PANDA', 'KOALA'],
      foods: ['HAMBURGER', 'SPAGHETTI', 'CHOCOLATE', 'STRAWBERRY', 'PINEAPPLE', 'WATERMELON', 'SANDWICH', 'LASAGNA', 'BURRITO'],
      technology: ['SMARTPHONE', 'ALGORITHM', 'PROGRAMMING', 'BLUETOOTH', 'NANOTECHNOLOGY', 'CRYPTOGRAPHY', 'BLOCKCHAIN', 'DATABASE'],
      professions: ['CARDIOLOGIST', 'NEUROLOGIST', 'PEDIATRICIAN', 'ORTHOPEDIST', 'DERMATOLOGIST', 'OPHTHALMOLOGIST', 'PSYCHIATRIST', 'RADIOLOGIST'],
      sports: ['HANDBALL', 'RUGBY', 'BADMINTON', 'SQUASH', 'FENCING', 'SHOOTING', 'CANOEING', 'ROWING', 'TRIATHLON', 'MARATHON'],
      music: ['ORCHESTRA', 'CHOIR', 'JAZZ', 'ROCK', 'BLUES', 'COUNTRY', 'REGGAE', 'HIPHOP', 'ELECTRONIC', 'CLASSICAL'],
      nature: ['BIODIVERSITY', 'ECOSYSTEM', 'SUSTAINABILITY', 'CONSERVATION', 'PRESERVATION', 'RECYCLING', 'RENEWABLE', 'ENERGY']
    },
    hard: {
      animals: ['RHINOCEROS', 'HIPPOPOTAMUS', 'PLATYPUS', 'SALAMANDER', 'CHAMELEON', 'OCTOPUS', 'DRAGONFLY', 'SCORPION'],
      technology: ['ARTIFICIAL INTELLIGENCE', 'MACHINE LEARNING', 'DEEP LEARNING', 'NEURAL NETWORK', 'QUANTUM COMPUTING', 'BIOTECHNOLOGY'],
      professions: ['NEUROSURGEON', 'CARDIOVASCULAR', 'ONCOLOGIST', 'HEMATOLOGIST', 'ENDOCRINOLOGIST', 'GASTROENTEROLOGIST', 'NEPHROLOGIST', 'RHEUMATOLOGIST'],
      sports: ['PARALYMPIC', 'PENTATHLON', 'DECATHLON', 'HEPTATHLON', 'TRIATLON', 'ULTRAMARATHON', 'MOUNTAINEERING', 'SPELEOLOGY'],
      music: ['SYMPHONY', 'CONCERTO', 'OPERA', 'BALLET', 'MUSICAL', 'ORATORIO', 'CANTATA', 'SONATA', 'FUGUE', 'RHAPSODY'],
      nature: ['BIODIVERSITY', 'ECOSYSTEM', 'SUSTAINABILITY', 'CONSERVATION', 'PRESERVATION', 'RECYCLING', 'RENEWABLE', 'ENERGY']
    }
  },
  es: {
    easy: {
      animals: ['GATO', 'PERRO', 'PAJARO', 'PEZ', 'OSO', 'PATO', 'RANA', 'CIERVO', 'ZORRO', 'ABEJA', 'HORMIGA', 'RATA'],
      colors: ['ROJO', 'AZUL', 'VERDE', 'ROSA', 'ORO', 'GRIS', 'NEGRO', 'BLANCO', 'CAFE', 'BEIGE', 'AMARILLO'],
      foods: ['MANZANA', 'PAN', 'HUEVO', 'PASTEL', 'SOPA', 'ARROZ', 'PESCADO', 'CARNE', 'MAIZ', 'QUESO', 'PLATANO', 'NARANJA'],
      technology: ['COMPUTADORA', 'TELEFONO', 'INTERNET', 'CORREO', 'SITIO WEB', 'PROGRAMA', 'ARCHIVO', 'DATOS', 'RED', 'SISTEMA'],
      professions: ['MEDICO', 'PROFESOR', 'INGENIERO', 'ABOGADO', 'DENTISTA', 'VETERINARIO', 'ARQUITECTO', 'FARMACEUTICO', 'ENFERMERO', 'PSICOLOGO'],
      sports: ['FUTBOL', 'BALONCESTO', 'TENIS', 'NATACION', 'VOLEIBOL', 'ATLETISMO', 'GIMNASIA', 'SURF', 'SKATE', 'CICLISMO'],
      music: ['PIANO', 'GUITARRA', 'BATERIA', 'FLAUTA', 'SAXOFON', 'TROMPETA', 'CLARINETE', 'ARPA', 'ACORDEON', 'TECLADO'],
      nature: ['ARBOL', 'FLOR', 'MONTAÑA', 'RIO', 'OCEANO', 'BOSQUE', 'PLAYA', 'DESIERTO', 'CASCADA', 'VOLCAN']
    },
    medium: {
      animals: ['ELEFANTE', 'JIRAFA', 'PINGUINO', 'DELFIN', 'MARIPOSA', 'COCODRILO', 'CANGURO', 'GUEPARDO', 'PANDA'],
      foods: ['HAMBURGUESA', 'ESPAGUETI', 'CHOCOLATE', 'FRESA', 'PINA', 'SANDIA', 'BOCADILLO', 'LASANA'],
      technology: ['ALGORITMO', 'PROGRAMACION', 'BLUETOOTH', 'NANOTECNOLOGIA', 'CRIPTOGRAFIA', 'BLOCKCHAIN'],
      professions: ['CARDIOLOGO', 'NEUROLOGO', 'PEDIATRA', 'ORTOPEDISTA', 'DERMATOLOGO', 'OFTALMOLOGO', 'PSIQUIATRA', 'RADIOLOGO'],
      sports: ['BALONMANO', 'RUGBY', 'BADMINTON', 'SQUASH', 'ESGRIMA', 'TIRO', 'CANOTAJE', 'REMO', 'TRIATLON', 'MARATON'],
      music: ['ORQUESTA', 'CORO', 'JAZZ', 'ROCK', 'SAMBA', 'BOSSA', 'FLAMENCO', 'TANGO', 'CUMBIA', 'REGGAETON'],
      nature: ['BIODIVERSIDAD', 'ECOSISTEMA', 'SOSTENIBILIDAD', 'CONSERVACION', 'PRESERVACION', 'RECICLAJE', 'ENERGIA', 'RENOVABLE']
    },
    hard: {
      animals: ['RINOCERONTE', 'HIPOPOTAMO', 'ORNITORRINCO', 'SALAMANDRA', 'CAMALEON', 'PULPO', 'LIBELULA'],
      technology: ['INTELIGENCIA ARTIFICIAL', 'APRENDIZAJE AUTOMATICO', 'APRENDIZAJE PROFUNDO', 'RED NEURONAL'],
      professions: ['NEUROCIRUJANO', 'CARDIOVASCULAR', 'ONCOLOGO', 'HEMATOLOGO', 'ENDOCRINOLOGO', 'GASTROENTEROLOGO', 'NEFROLOGO', 'REUMATOLOGO'],
      sports: ['PARALIMPICO', 'PENTATLON', 'DECATLON', 'HEPTATLON', 'TRIATLON', 'ULTRAMARATON', 'ALPINISMO', 'ESPELEOLOGIA'],
      music: ['SINFONIA', 'CONCIERTO', 'OPERA', 'BALLET', 'MUSICAL', 'ORATORIO', 'CANTATA', 'SONATA', 'FUGA', 'RAPSODIA'],
      nature: ['BIODIVERSIDAD', 'ECOSISTEMA', 'SOSTENIBILIDAD', 'CONSERVACION', 'PRESERVACION', 'RECICLAJE', 'ENERGIA', 'RENOVABLE']
    }
  }
};

const UI_TRANSLATIONS = {
  pt: {
    title: 'Caça-Palavras',
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
    gridSizes: { small: 'Pequeno (10x12)', medium: 'Médio (12x15)', large: 'Grande (14x18)' },
    wordDifficulties: { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' },
    wordDifficultyDescriptions: { easy: 'Palavras simples e comuns', medium: 'Palavras de complexidade moderada', hard: 'Palavras complexas e longas' },
    categories: { animals: 'Animais', colors: 'Cores', foods: 'Comidas', technology: 'Tecnologia', professions: 'Profissões', sports: 'Esportes', music: 'Música', nature: 'Natureza' }
  },
  en: {
    title: 'Word Search',
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
    gridSizes: { small: 'Small (10x12)', medium: 'Medium (12x15)', large: 'Large (14x18)' },
    wordDifficulties: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
    wordDifficultyDescriptions: { easy: 'Simple and common words', medium: 'Moderate complexity words', hard: 'Complex and long words' },
    categories: { animals: 'Animals', colors: 'Colors', foods: 'Foods', technology: 'Technology', professions: 'Professions', sports: 'Sports', music: 'Music', nature: 'Nature' }
  },
  es: {
    title: 'Sopa de Letras',
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
    gridSizes: { small: 'Pequeño (10x12)', medium: 'Mediano (12x15)', large: 'Grande (14x18)' },
    wordDifficulties: { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' },
    wordDifficultyDescriptions: { easy: 'Palavras simples y comunes', medium: 'Palavras de complejidad moderada', hard: 'Palavras complejas y largas' },
    categories: { animals: 'Animales', colors: 'Colores', foods: 'Comidas', technology: 'Tecnología', professions: 'Profesiones', sports: 'Deportes', music: 'Música', nature: 'Naturaleza' }
  }
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

const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: [number, number], cols: number, rows: number): boolean => {
  for (let i = 0; i < word.length; i++) {
    const newRow = row + direction[0] * i;
    const newCol = col + direction[1] * i;
    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) return false;
    if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) return false;
  }
  return true;
};

const placeWord = (grid: string[][], word: string, row: number, col: number, direction: [number, number]): void => {
  for (let i = 0; i < word.length; i++) {
    const newRow = row + direction[0] * i;
    const newCol = col + direction[1] * i;
    grid[newRow][newCol] = word[i];
  }
};

const generateGrid = (cols: number, rows: number, words: string[], seed: number = Date.now()): { grid: string[][], words: WordObj[] } => {
  const grid = Array(rows).fill('').map(() => Array(cols).fill(''));
  const placedWords: WordObj[] = [];
  let currentSeed = seed;

  // Embaralhar palavras e garantir que não se repitam
  const shuffledWords = shuffleArray([...new Set(words)], currentSeed++);
  
  // Usar apenas palavras únicas
  const uniqueWords = shuffledWords.filter((word, index, arr) => arr.indexOf(word) === index);

  for (const word of uniqueWords.slice(0, 15)) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 150) {
      const direction = DIRECTIONS[Math.floor(seededRandom(currentSeed++) * DIRECTIONS.length)] as [number, number];
      const startRow = Math.floor(seededRandom(currentSeed++) * rows);
      const startCol = Math.floor(seededRandom(currentSeed++) * cols);

      if (canPlaceWord(grid, word, startRow, startCol, direction, cols, rows)) {
        placeWord(grid, word, startRow, startCol, direction);
        placedWords.push({ word, start: [startRow, startCol], direction, found: false });
        placed = true;
      }
      attempts++;
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(seededRandom(currentSeed++) * 26));
      }
    }
  }

  return { grid, words: placedWords };
};

const getLineCells = (startRow: number, startCol: number, endRow: number, endCol: number): Cell[] => {
  const cells: Cell[] = [];
  const rowStep = endRow === startRow ? 0 : (endRow - startRow) / Math.abs(endRow - startRow);
  const colStep = endCol === startCol ? 0 : (endCol - startCol) / Math.abs(endCol - startCol);
  const steps = Math.max(Math.abs(endRow - startRow), Math.abs(endCol - startCol));
  
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: startRow + rowStep * i, col: startCol + colStep * i });
  }
  return cells;
};

const checkWordMatch = (gameState: GameState | null, selectedCells: Cell[], foundWords: string[]): WordObj | null => {
  if (!gameState || selectedCells.length < 2) return null;
  
  const selectedText = selectedCells.map(cell => gameState.grid[cell.row][cell.col]).join('');
  const reverseText = selectedText.split('').reverse().join('');
  
  return gameState.words.find(wordObj => 
    (wordObj.word === selectedText || wordObj.word === reverseText) && 
    !foundWords.includes(wordObj.word)
  ) || null;
};

const getCellClass = (row: number, col: number, selectedCells: Cell[], gameState: GameState | null, foundWords: string[]): string => {
  const isSelected = selectedCells.some(cell => cell.row === row && cell.col === col);
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
const useTTS = (language: string, enabled: boolean) => {
  const speak = useCallback((word: string) => {
    if (!enabled || !('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    const voices = speechSynthesis.getVoices();
    const langVoice = voices.find(voice => voice.lang.startsWith(language));
    if (langVoice) utterance.voice = langVoice;
    
    speechSynthesis.speak(utterance);
  }, [enabled, language]);
  
  return { speak };
};

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

  return { elapsedTime, startTime, startTimer, resetTimer, getFormattedTime: () => formatTime(elapsedTime) };
};

const useGameState = (language: string, gridSize: string, wordDifficulty: string, category: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('wordSearchStats');
    return saved ? JSON.parse(saved) : {
      totalGames: 0,
      totalWordsFound: 0,
      bestTime: 0,
      averageTime: 0,
      achievements: ACHIEVEMENTS,
      currentStreak: 0,
      longestStreak: 0
    };
  });

  // Salvar estatísticas no localStorage
  useEffect(() => {
    localStorage.setItem('wordSearchStats', JSON.stringify(gameStats));
  }, [gameStats]);

  const initializeGame = useCallback(() => {
    try {
      const categoryWords = (WORD_CATALOGS as any)[language]?.[wordDifficulty]?.[category];
      
      if (!categoryWords?.length) {
        const availableCategories = Object.keys(WORD_CATALOGS[language as keyof typeof WORD_CATALOGS]?.[wordDifficulty as keyof typeof WORD_CATALOGS.pt] || {});
        if (availableCategories.length > 0) {
          const fallbackCategory = availableCategories[0];
          const fallbackWords = (WORD_CATALOGS as any)[language]?.[wordDifficulty]?.[fallbackCategory];
          
          const config = GRID_CONFIGS[gridSize];
          const seed = Date.now();
          const result = generateGrid(config.size, config.rows, fallbackWords, seed);
          
          setGameState({
            grid: result.grid,
            words: result.words.slice(0, config.wordCount),
            cols: config.size,
            rows: config.rows,
            seed
          });
          
          setFoundWords([]);
          setGameCompleted(false);
          setScore(0);
          setCurrentStreak(0);
        }
        return;
      }
      
      const config = GRID_CONFIGS[gridSize];
      const seed = Date.now();
      const result = generateGrid(config.size, config.rows, categoryWords, seed);
      
      setGameState({
        grid: result.grid,
        words: result.words.slice(0, config.wordCount),
        cols: config.size,
        rows: config.rows,
        seed
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
    initializeGame();
  }, []); // Remover dependências para evitar loop

  useEffect(() => {
    if (gameState?.words && foundWords.length === gameState.words.length && gameState.words.length > 0) {
      setGameCompleted(true);
    }
  }, [foundWords, gameState]);

  const addFoundWord = useCallback((word: string) => {
    setFoundWords(prev => {
      if (!prev.includes(word)) {
        // Calcular pontuação
        const baseScore = SCORING.wordFound;
        const difficultyMultiplier = SCORING.difficultyMultiplier[wordDifficulty as keyof typeof SCORING.difficultyMultiplier];
        const streakBonus = currentStreak * SCORING.streakBonus;
        const wordScore = Math.floor((baseScore + streakBonus) * difficultyMultiplier);
        
        setScore(prevScore => prevScore + wordScore);
        setCurrentStreak(prevStreak => prevStreak + 1);
        
        // Atualizar estatísticas
        setGameStats(prevStats => ({
          ...prevStats,
          totalWordsFound: prevStats.totalWordsFound + 1
        }));
        
        // Verificar conquistas
        checkAchievements();
        
        // Feedback visual
        toast.success(`+${wordScore} pontos! 🔥`, {
          icon: '🎯',
          duration: 2000,
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: 'bold'
          }
        });
        
        return [...prev, word];
      }
      return prev;
    });
  }, [currentStreak, wordDifficulty]);

  const checkAchievements = useCallback(() => {
    setGameStats((prev: GameStats) => {
      const newStats = { ...prev };
      const achievements = [...prev.achievements];
      
      // Primeira palavra
      const firstWord = achievements.find((a: Achievement) => a.id === 'first_word');
      if (firstWord && !firstWord.unlocked) {
        firstWord.progress = 1;
        firstWord.unlocked = true;
        toast.success('🏆 Conquista: Primeira Palavra!', {
          duration: 3000,
          icon: '🎯'
        });
      }
      
      // Mestre das palavras
      const wordMaster = achievements.find((a: Achievement) => a.id === 'word_master');
      if (wordMaster) {
        wordMaster.progress = Math.min(prev.totalWordsFound + 1, wordMaster.maxProgress);
        if (wordMaster.progress >= wordMaster.maxProgress && !wordMaster.unlocked) {
          wordMaster.unlocked = true;
          toast.success('🏆 Conquista: Mestre das Palavras!', {
            duration: 3000,
            icon: '🏆'
          });
        }
      }
      
      // Campeão da sequência
      const streakChampion = achievements.find((a: Achievement) => a.id === 'streak_champion');
      if (streakChampion) {
        streakChampion.progress = Math.max(streakChampion.progress, currentStreak + 1);
        if (streakChampion.progress >= streakChampion.maxProgress && !streakChampion.unlocked) {
          streakChampion.unlocked = true;
          toast.success('🏆 Conquista: Campeão da Sequência!', {
            duration: 3000,
            icon: '🔥'
          });
        }
      }
      
      newStats.achievements = achievements;
      return newStats;
    });
  }, [currentStreak]);

  const updateGameCompletionStats = useCallback((completionTime: number, finalStreak: number) => {
    setGameStats((prev: GameStats) => {
      const newStats = { ...prev };
      newStats.totalGames += 1;
      
      // Atualizar melhor tempo
      if (completionTime > 0 && (newStats.bestTime === 0 || completionTime < newStats.bestTime)) {
        newStats.bestTime = completionTime;
      }
      
      // Atualizar sequência máxima
      if (finalStreak > newStats.longestStreak) {
        newStats.longestStreak = finalStreak;
      }
      
      // Verificar conquista de velocidade
      const speedDemon = newStats.achievements.find((a: Achievement) => a.id === 'speed_demon');
      if (speedDemon && !speedDemon.unlocked && completionTime < 120) { // menos de 2 minutos
        speedDemon.unlocked = true;
        toast.success('🏆 Conquista: Demônio da Velocidade!', {
          duration: 3000,
          icon: '⚡'
        });
      }
      
      return newStats;
    });
  }, []);

  return { 
    gameState, 
    foundWords, 
    gameCompleted, 
    score,
    currentStreak,
    gameStats,
    initializeGame, 
    addFoundWord,
    updateGameCompletionStats
  };
};

const useTouchHandlers = (gameCompleted: boolean, onCellStart: (row: number, col: number) => void, onCellMove: (row: number, col: number) => void, onCellEnd: () => void) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handleCellStart = useCallback((row: number, col: number, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (gameCompleted) return;
    setIsSelecting(true);
    onCellStart(row, col);
  }, [gameCompleted, onCellStart]);

  const handleCellMove = useCallback((row: number, col: number, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isSelecting || gameCompleted) return;
    onCellMove(row, col);
  }, [isSelecting, gameCompleted, onCellMove]);

  const handleCellEnd = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    if (!isSelecting || gameCompleted) return;
    onCellEnd();
    setIsSelecting(false);
  }, [isSelecting, gameCompleted, onCellEnd]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSelecting) return;
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && (element as HTMLElement).dataset.row && (element as HTMLElement).dataset.col) {
      const row = parseInt((element as HTMLElement).dataset.row!);
      const col = parseInt((element as HTMLElement).dataset.col!);
      handleCellMove(row, col, e);
    }
  }, [isSelecting, handleCellMove]);

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
  
  // Pegar configurações da URL ou usar padrões
  const [language, setLanguage] = useState(searchParams.get('lang') || 'pt');
  
  // Atualizar i18n quando o idioma mudar
  useEffect(() => {
    if (language && ['pt', 'en', 'es'].includes(language)) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);
  const [gridSize, setGridSize] = useState(searchParams.get('size') || 'medium');
  const [wordDifficulty, setWordDifficulty] = useState(searchParams.get('difficulty') || 'easy');
  const [category, setCategory] = useState(searchParams.get('category') || 'animals');
  
  // Estados temporários para configurações
  const [tempLanguage, setTempLanguage] = useState('pt');
  const [tempGridSize, setTempGridSize] = useState('small');
  const [tempWordDifficulty, setTempWordDifficulty] = useState('easy');
  const [tempCategory, setTempCategory] = useState('animals');
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { width, height } = useWindowSize();
  const t = UI_TRANSLATIONS[language as keyof typeof UI_TRANSLATIONS];
  const { speak } = useTTS(language, ttsEnabled);
  const { startTimer, resetTimer, getFormattedTime, startTime } = useGameTimer(gameStarted, false);
  const { 
    gameState, 
    foundWords, 
    gameCompleted, 
    score,
    currentStreak,
    gameStats,
    initializeGame, 
    addFoundWord,
    updateGameCompletionStats
  } = useGameState(language, gridSize, wordDifficulty, category);

  const handleWordFound = (word: string) => {
    addFoundWord(word);
    speak(word);
    
    // Track word found
    if (window.gameAnalytics) {
      window.gameAnalytics.trackWordFound(word, category, wordDifficulty);
    }
  };

  const onCellStart = (row: number, col: number) => {
    if (!gameStarted) {
      startTimer();
      setGameStarted(true);
      
      // Track game start
      if (window.gameAnalytics) {
        window.gameAnalytics.trackGameStart(category, wordDifficulty, language);
      }
    }
    setSelectedCells([{ row, col }]);
  };

  const onCellMove = (row: number, col: number) => {
    const start = selectedCells[0];
    if (!start) return;
    
    const rowDiff = row - start.row;
    const colDiff = col - start.col;
    
    if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
      const cells = getLineCells(start.row, start.col, row, col);
      setSelectedCells(cells);
    }
  };

  const onCellEnd = () => {
    const foundWord = checkWordMatch(gameState, selectedCells, foundWords);
    if (foundWord) handleWordFound(foundWord.word);
    setSelectedCells([]);
  };

  const { handleCellStart, handleCellMove, handleCellEnd, handleTouchMove } = useTouchHandlers(
    gameCompleted, onCellStart, onCellMove, onCellEnd
  );

  const resetGameState = () => {
    resetTimer();
    setGameStarted(false);
  };

  const handleNewGame = () => {
    // Aplicar configurações temporárias
    setLanguage(tempLanguage);
    setGridSize(tempGridSize);
    setWordDifficulty(tempWordDifficulty);
    setCategory(tempCategory);
    
    // Reiniciar o jogo com as novas configurações
    setTimeout(() => {
      initializeGame();
      resetGameState();
      setSelectedCells([]);
      setShowConfetti(false);
    }, 100);
    
    // Track settings change
    if (window.gameAnalytics) {
      window.gameAnalytics.trackSettingsChange('new_game', 'previous', 'new');
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
    
    const gameUrl = 'https://gslgamezone.com/game-setup';
    const shareText = `🎮 Joguei Caça-Palavras no GSL Game Zone!\n\n🏆 Resultado: ${foundWords.length}/${gameState.words.length} palavras encontradas\n⏱️ Tempo: ${getFormattedTime()}\n🎯 Pontuação: ${score} pontos\n\n🎮 Jogue agora: ${gameUrl}`;
    
    if (navigator.share) {
      navigator.share({ 
        title: 'Caça-Palavras - GSL Game Zone', 
        text: shareText,
        url: gameUrl
      });
      // Track share
      if (window.gameAnalytics) {
        window.gameAnalytics.trackShare('native');
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      showShareModal();
    }
  };

  const showShareModal = () => {
    if (!gameState) return;
    
    const gameUrl = 'https://gslgamezone.com/game-setup';
    const shareText = `🎮 Joguei Caça-Palavras no GSL Game Zone!\n\n🏆 Resultado: ${foundWords.length}/${gameState.words.length} palavras encontradas\n⏱️ Tempo: ${getFormattedTime()}\n🎯 Pontuação: ${score} pontos\n\n🎮 Jogue agora: ${gameUrl}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`;
    const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;
    
    const shareModal = document.createElement('div');
    shareModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    shareModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div class="text-center mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Compartilhar Resultado</h3>
          <p class="text-sm text-gray-600">Escolha como compartilhar seu resultado!</p>
        </div>
        <div class="space-y-3">
          <a href="${whatsappUrl}" target="_blank" class="flex items-center justify-center gap-3 w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <span class="text-xl">📱</span>
            WhatsApp
          </a>
          <a href="${twitterUrl}" target="_blank" class="flex items-center justify-center gap-3 w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <span class="text-xl">🐦</span>
            Twitter
          </a>
          <a href="${facebookUrl}" target="_blank" class="flex items-center justify-center gap-3 w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <span class="text-xl">📘</span>
            Facebook
          </a>
          <a href="${smsUrl}" class="flex items-center justify-center gap-3 w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            <span class="text-xl">💬</span>
            SMS
          </a>
          <button onclick="navigator.clipboard.writeText('${shareText.replace(/'/g, "\\'")}'); this.parentElement.parentElement.parentElement.remove(); alert('Texto copiado!');" class="flex items-center justify-center gap-3 w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            <span class="text-xl">📋</span>
            Copiar Link
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" class="flex items-center justify-center gap-3 w-full p-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            <span class="text-xl">❌</span>
            Cancelar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(shareModal);
    
    // Track share
    if (window.gameAnalytics) {
      window.gameAnalytics.trackShare('modal');
    }
  };

  // Atualizar configurações temporárias quando as configurações mudam
  useEffect(() => {
    setTempLanguage(language);
    setTempGridSize(gridSize);
    setTempWordDifficulty(wordDifficulty);
    setTempCategory(category);
  }, [language, gridSize, wordDifficulty, category]);



  useEffect(() => {
    const availableCategories = Object.keys(WORD_CATALOGS[language as keyof typeof WORD_CATALOGS]?.[wordDifficulty as keyof typeof WORD_CATALOGS.pt] || {});
    if (!availableCategories.includes(category) && availableCategories.length > 0) {
      setCategory(availableCategories[0]);
    }
  }, [language, wordDifficulty, category]);

  useEffect(() => {
    if (gameCompleted) {
      const completionTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      
      // Atualizar estatísticas finais
      updateGameCompletionStats(completionTime, currentStreak);
      
      setShowConfetti(true);
      toast.success(`🎉 Parabéns! Você completou o puzzle com ${score} pontos!`);
      setTimeout(() => setShowConfetti(false), 5000);
      
      // Track game completion
      if (window.gameAnalytics && startTime) {
        window.gameAnalytics.trackGameComplete(
          category, 
          wordDifficulty, 
          language, 
          foundWords.length, 
          completionTime
        );
      }
    }
  }, [gameCompleted, category, wordDifficulty, language, foundWords.length, startTime, score, currentStreak, updateGameCompletionStats]);

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
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🎯
          </motion.div>
          <div className="text-xl font-semibold text-gray-700 mb-2">Caça-Palavras</div>
          <div className="text-gray-500">Preparando o jogo...</div>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  const availableCategories = Object.keys(WORD_CATALOGS[language as keyof typeof WORD_CATALOGS]?.[wordDifficulty as keyof typeof WORD_CATALOGS.pt] || {});

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <motion.div 
        className="card mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleBackToHome}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Voltar para Home"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </motion.button>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Target className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Jogo educativo interativo</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-3 rounded-xl transition-all duration-200 shadow-sm ${
                ttsEnabled 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={t.ttsEnabled}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {ttsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </motion.button>
            
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl transition-all duration-200 shadow-sm ${
                showSettings 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={t.settings}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={20} />
            </motion.button>
            
            {gameCompleted && (
              <motion.button
                onClick={handleShare}
                className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
                title={t.share}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Share2 size={20} />
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div 
              className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Settings className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">{t.settings}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Idioma */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2 h-6">
                    <span className="text-lg">🌍</span>
                    Idioma
                  </label>
                  <select
                    value={tempLanguage}
                    onChange={(e) => {
                      const oldValue = tempLanguage;
                      setTempLanguage(e.target.value);
                      // Track settings change
                      if (window.gameAnalytics) {
                        window.gameAnalytics.trackSettingsChange('language', oldValue, e.target.value);
                      }
                    }}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                  >
                    <option value="pt">🇧🇷 Português</option>
                    <option value="en">🇺🇸 English</option>
                    <option value="es">🇪🇸 Español</option>
                  </select>
                </div>

                {/* Tamanho do Grid */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2 h-6">
                    <span className="text-lg">📏</span>
                    Grid
                  </label>
                  <select
                    value={tempGridSize}
                    onChange={(e) => setTempGridSize(e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                  >
                    <option value="small">🔹 {t.gridSizes.small}</option>
                    <option value="medium">🔸 {t.gridSizes.medium}</option>
                    <option value="large">🔶 {t.gridSizes.large}</option>
                  </select>
                </div>

                {/* Dificuldade */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2 h-6">
                    <span className="text-lg">🎯</span>
                    Dificuldade
                  </label>
                  <select
                    value={tempWordDifficulty}
                    onChange={(e) => setTempWordDifficulty(e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                  >
                    <option value="easy">🟢 {t.wordDifficulties.easy}</option>
                    <option value="medium">🟡 {t.wordDifficulties.medium}</option>
                    <option value="hard">🔴 {t.wordDifficulties.hard}</option>
                  </select>
                </div>

                {/* Categoria */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2 h-6">
                    <span className="text-lg">📚</span>
                    Categoria
                  </label>
                  <select
                    value={tempCategory}
                    onChange={(e) => setTempCategory(e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                  >
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'animals' ? '🐾 ' : 
                         cat === 'colors' ? '🎨 ' : 
                         cat === 'foods' ? '🍽️ ' : 
                         cat === 'technology' ? '💻 ' : 
                         cat === 'professions' ? '👨‍⚕️ ' : 
                         cat === 'sports' ? '⚽ ' : 
                         cat === 'music' ? '🎵 ' : 
                         cat === 'nature' ? '🌿 ' : '📝 '}
                        {t.categories[cat as keyof typeof t.categories] || cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botão Novo Jogo */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  onClick={handleNewGame}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw size={18} />
                  <span>{t.newGame}</span>
                  <span className="text-sm opacity-90">🎮</span>
                </motion.button>
              </div>

              {/* Preview das configurações */}
              <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-sm text-gray-600 text-center">
                  <span className="font-medium">📋 Configuração atual:</span>
                  <div className="mt-1 flex flex-wrap justify-center gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {t.categories[tempCategory as keyof typeof t.categories] || tempCategory}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      {t.gridSizes[tempGridSize as keyof typeof t.gridSizes]}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {t.wordDifficulties[tempWordDifficulty as keyof typeof t.wordDifficulties]}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            {/* Progresso e Pontuação */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
                <Trophy size={18} className="text-yellow-500" />
                <span className="font-semibold text-gray-800">
                  {t.found}: <span className="text-blue-600">{foundWords.length}</span>/<span className="text-gray-600">{gameState.words.length}</span>
                </span>
              </div>
              
              {/* Pontuação */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-2 rounded-lg shadow-sm border border-yellow-200">
                <Zap size={18} className="text-yellow-600" />
                <span className="font-semibold text-gray-800">
                  <span className="text-yellow-700">{score}</span> pts
                </span>
              </div>
              
              {/* Sequência */}
              {currentStreak > 0 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 px-3 py-2 rounded-lg shadow-sm border border-red-200">
                  <span className="text-lg">🔥</span>
                  <span className="font-semibold text-gray-800">
                    <span className="text-red-700">{currentStreak}</span> seq
                  </span>
                </div>
              )}
              
              {/* Timer */}
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
                <Clock size={18} className="text-green-500" />
                <span className={`font-semibold ${gameStarted ? 'text-green-600' : 'text-gray-500'}`}>
                  {getFormattedTime()}
                </span>
                {!gameStarted && (
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
                  {t.categories[category as keyof typeof t.categories] || category}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  {t.gridSizes[gridSize as keyof typeof t.gridSizes]}
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                  {t.wordDifficulties[wordDifficulty as keyof typeof t.wordDifficulties]}
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
                maxWidth: `${gameState.cols * 2.5}rem`
              }}
              onMouseLeave={() => setSelectedCells([])}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleCellEnd}
            >
              {gameState.grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClass(rowIndex, colIndex, selectedCells, gameState, foundWords)}
                    data-row={rowIndex}
                    data-col={colIndex}
                    onMouseDown={(e) => handleCellStart(rowIndex, colIndex, e)}
                    onMouseEnter={(e) => handleCellMove(rowIndex, colIndex, e)}
                    onMouseUp={handleCellEnd}
                    onTouchStart={(e) => handleCellStart(rowIndex, colIndex, e)}
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
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
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

          {/* Estatísticas */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-500" />
              Estatísticas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">Jogos Totais:</span>
                <span className="font-semibold text-blue-700">{gameStats.totalGames}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Palavras Encontradas:</span>
                <span className="font-semibold text-green-700">{gameStats.totalWordsFound}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-600">Melhor Tempo:</span>
                <span className="font-semibold text-purple-700">
                  {gameStats.bestTime > 0 ? formatTime(gameStats.bestTime) : '--:--'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                <span className="text-sm text-gray-600">Sequência Máxima:</span>
                <span className="font-semibold text-orange-700">{gameStats.longestStreak}</span>
              </div>
            </div>
          </motion.div>

          {/* Conquistas */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="text-yellow-500" />
              Conquistas
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
                      <div className="text-xs opacity-75">{achievement.description}</div>
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
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
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
                  +{gameStats.achievements.filter(a => a.unlocked).length - 3} mais conquistas
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
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.congratulations}</h2>
                <p className="text-gray-600 mb-4">{t.gameCompleted}</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Pontuação Final:</span>
                      <span className="font-bold text-yellow-600">{score} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Palavras Encontradas:</span>
                      <span>{foundWords.length}/{gameState.words.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo:</span>
                      <span>{getFormattedTime()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sequência Máxima:</span>
                      <span className="text-red-600">{currentStreak}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dificuldade:</span>
                      <span>{t.wordDifficulties[wordDifficulty as keyof typeof t.wordDifficulties]}</span>
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
