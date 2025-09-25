// Tipos para o jogo de Solitaire
export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank:
    | 'A'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | 'J'
    | 'Q'
    | 'K';
  value: number;
  color: 'red' | 'black';
  isFaceUp: boolean;
  id: string;
}

export interface Foundation {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  cards: Card[];
}

export interface TableauColumn {
  faceUp: Card[];
  faceDown: Card[];
  hiddenCount: number;
}

export interface WastePile {
  cards: Card[];
}

export interface StockPile {
  cards: Card[];
  currentIndex: number;
}

export interface SolitaireGameState {
  foundations: Foundation[];
  tableau: TableauColumn[];
  wastePile: WastePile;
  stockPile: StockPile;
  selectedCard: Card | null;
  selectedSource: 'foundation' | 'tableau' | 'waste' | null;
  selectedIndex: number;
  selectedSequence: Card[];
  moves: number;
  timeElapsed: number;
  isWon: boolean;
  isGameStarted: boolean;
}

export interface SolitaireStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number;
  totalMoves: number;
  averageMoves: number;
  winRate: number;
}

export interface SolitaireSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  autoComplete: boolean;
  hints: boolean;
  animations: boolean;
  sound: boolean;
}

export type SolitaireDifficulty = 'easy' | 'medium' | 'hard';

export interface DragData {
  card: Card;
  source: 'foundation' | 'tableau' | 'waste';
  sourceIndex: number;
  cardIndex: number;
}

export interface SolitaireSEO {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  hreflang: string;
}
