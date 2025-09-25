import { Card, Foundation, TableauColumn } from '../types/solitaire';

// Criar um baralho completo de 52 cartas
export const createDeck = (): Card[] => {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Card['rank'][] = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];
  const deck: Card[] = [];

  suits.forEach(suit => {
    ranks.forEach((rank, index) => {
      const value = index + 1;
      const color = suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';

      deck.push({
        suit,
        rank,
        value,
        color,
        isFaceUp: false,
        id: `${suit}-${rank}-${Math.random().toString(36).substr(2, 9)}`,
      });
    });
  });

  return deck;
};

// Embaralhar o baralho
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Verificar se uma carta pode ser colocada em uma fundação
export const canPlaceOnFoundation = (
  card: Card,
  foundation: Foundation
): boolean => {
  if (foundation.cards.length === 0) {
    return card.rank === 'A';
  }

  const topCard = foundation.cards[foundation.cards.length - 1];
  return card.suit === foundation.suit && card.value === topCard.value + 1;
};

// Verificar se uma carta pode ser colocada em uma coluna do tableau
export const canPlaceOnTableau = (
  card: Card,
  column: TableauColumn
): boolean => {
  if (column.faceUp.length === 0) {
    return card.rank === 'K';
  }

  const topCard = column.faceUp[column.faceUp.length - 1];
  return card.color !== topCard.color && card.value === topCard.value - 1;
};

// Verificar se um bloco de cartas é válido (cores alternadas, valores decrescentes)
export const isValidBlock = (cards: Card[]): boolean => {
  if (cards.length <= 1) return true;

  for (let i = 0; i < cards.length - 1; i++) {
    const currentCard = cards[i];
    const nextCard = cards[i + 1];

    // Verificar se as cores são alternadas
    if (currentCard.color === nextCard.color) {
      return false;
    }

    // Verificar se os valores são decrescentes (valor atual = valor seguinte + 1)
    if (currentCard.value !== nextCard.value + 1) {
      return false;
    }
  }

  return true;
};

// Verificar se uma sequência de cartas pode ser movida
export const canMoveSequence = (
  cards: Card[],
  targetColumn: TableauColumn
): boolean => {
  if (cards.length === 0) return false;

  const firstCard = cards[0];

  // Se a coluna está vazia, só aceita Rei
  if (targetColumn.faceUp.length === 0) {
    return firstCard.rank === 'K';
  }

  // Se a coluna tem cartas, valida apenas a primeira carta do bloco
  const topCard = targetColumn.faceUp[targetColumn.faceUp.length - 1];
  return firstCard.color !== topCard.color && firstCard.value === topCard.value - 1;
};

// Verificar se uma coluna do tableau está correta
export const validateTableauColumn = (column: TableauColumn): boolean => {
  if (column.faceUp.length <= 1) return true;

  console.log(
    'Validating tableau column:',
    column.faceUp.map(
      c => `${c.rank}${getCardSymbol(c.suit)} (${c.color}, ${c.value})`
    )
  );

  for (let i = 0; i < column.faceUp.length - 1; i++) {
    const currentCard = column.faceUp[i];
    const nextCard = column.faceUp[i + 1];

    // Verificar se as cores são alternadas
    if (currentCard.color === nextCard.color) {
      console.log(
        `❌ Invalid column: Same color ${currentCard.color} for ${currentCard.rank} and ${nextCard.rank}`
      );
      return false;
    }

    // Verificar se os valores são decrescentes
    if (currentCard.value !== nextCard.value + 1) {
      console.log(
        `❌ Invalid column: Value gap ${currentCard.value} -> ${
          nextCard.value
        } (should be ${nextCard.value + 1})`
      );
      return false;
    }
  }

  console.log('✅ Column is valid!');
  return true;
};

// Verificar se o jogo foi vencido
export const isGameWon = (foundations: Foundation[]): boolean => {
  return foundations.every(foundation => foundation.cards.length === 13);
};

// Encontrar movimentos possíveis
export const findPossibleMoves = (
  foundations: Foundation[],
  tableau: TableauColumn[],
  wastePile: { cards: Card[] }
): Array<{ from: string; to: string; card: Card }> => {
  const moves: Array<{ from: string; to: string; card: Card }> = [];

  // Verificar movimentos do waste pile
  if (wastePile.cards.length > 0) {
    const topWasteCard = wastePile.cards[wastePile.cards.length - 1];

    // Para fundações
    foundations.forEach((foundation, index) => {
      if (canPlaceOnFoundation(topWasteCard, foundation)) {
        moves.push({
          from: 'waste',
          to: `foundation-${index}`,
          card: topWasteCard,
        });
      }
    });

    // Para tableau
    tableau.forEach((column, index) => {
      if (canPlaceOnTableau(topWasteCard, column)) {
        moves.push({
          from: 'waste',
          to: `tableau-${index}`,
          card: topWasteCard,
        });
      }
    });
  }

  return moves;
};

// Calcular pontuação
export const calculateScore = (
  moves: number,
  timeElapsed: number,
  difficulty: string
): number => {
  const baseScore = 1000;
  const timeBonus = Math.max(0, 300 - timeElapsed) * 2;
  const movePenalty = moves * 10;
  const difficultyMultiplier =
    difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1;

  return Math.max(
    0,
    Math.floor((baseScore + timeBonus - movePenalty) * difficultyMultiplier)
  );
};

// Obter cor da carta para CSS
export const getCardColor = (card: Card): string => {
  return card.color === 'red' ? 'text-red-600' : 'text-black';
};

// Obter símbolo da carta
export const getCardSymbol = (card: Card): string => {
  const symbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };
  return symbols[card.suit];
};

// Verificar se uma carta está visível
export const isCardVisible = (card: Card): boolean => {
  return card.isFaceUp;
};

// Obter texto da carta para acessibilidade
export const getCardAccessibilityText = (card: Card): string => {
  const suitNames = {
    hearts: 'hearts',
    diamonds: 'diamonds',
    clubs: 'clubs',
    spades: 'spades',
  };

  return `${card.rank} of ${suitNames[card.suit]}`;
};
