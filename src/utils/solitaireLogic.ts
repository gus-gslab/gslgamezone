import {
  Card,
  SolitaireGameState,
  Foundation,
  TableauColumn,
  WastePile,
  StockPile,
} from '../types/solitaire';
import {
  createDeck,
  shuffleDeck,
  canPlaceOnFoundation,
  canPlaceOnTableau,
  isGameWon,
} from './cardUtils';

// Estado inicial do jogo
export const createInitialGameState = (): SolitaireGameState => {
  const deck = shuffleDeck(createDeck());

  // Criar fundações vazias
  const foundations: Foundation[] = [
    { suit: 'hearts', cards: [] },
    { suit: 'diamonds', cards: [] },
    { suit: 'clubs', cards: [] },
    { suit: 'spades', cards: [] },
  ];

  // Criar tableau com 7 colunas - distribuição padrão do Solitaire
  const tableau: TableauColumn[] = [];
  let cardIndex = 0;

  // Coluna 0: 1 carta (1 visível)
  tableau.push({
    faceUp: [{ ...deck[cardIndex++], isFaceUp: true }],
    faceDown: [],
  });

  // Coluna 1: 2 cartas (1 oculta + 1 visível)
  tableau.push({
    faceUp: [{ ...deck[cardIndex++], isFaceUp: true }],
    faceDown: [{ ...deck[cardIndex++], isFaceUp: false }],
  });

  // Coluna 2: 3 cartas (2 ocultas + 1 visível)
  tableau.push({
    faceUp: [{ ...deck[cardIndex++], isFaceUp: true }],
    faceDown: [
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
    ],
  });

  // Coluna 3: 4 cartas (3 ocultas + 1 visível)
  tableau.push({
    faceUp: [{ ...deck[cardIndex++], isFaceUp: true }],
    faceDown: [
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
    ],
  });

  // Coluna 4: 5 cartas (4 ocultas + 1 visível)
  tableau.push({
    faceUp: [{ ...deck[cardIndex++], isFaceUp: true }],
    faceDown: [
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
    ],
  });

  // Coluna 5: 6 cartas (5 ocultas + 1 visível)
  tableau.push({
    faceUp: [{ ...deck[cardIndex++], isFaceUp: true }],
    faceDown: [
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
    ],
  });

  // Coluna 6: 7 cartas (6 ocultas + 1 visível)
  tableau.push({
    faceUp: [{ ...deck[cardIndex++], isFaceUp: true }],
    faceDown: [
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
      { ...deck[cardIndex++], isFaceUp: false },
    ],
  });

  // Cartas restantes vão para o stock
  const stockCards = deck.slice(cardIndex);

  return {
    foundations,
    tableau,
    wastePile: { cards: [] },
    stockPile: { cards: stockCards, currentIndex: 0 },
    selectedCard: null,
    selectedSource: null,
    selectedIndex: -1,
    moves: 0,
    timeElapsed: 0,
    isWon: false,
    isGameStarted: true,
  };
};

// Mover carta do stock para waste
// Virar uma carta do stock
export const dealOneFromStock = (
  gameState: SolitaireGameState
): SolitaireGameState => {
  const { stockPile, wastePile } = gameState;

  // Se não há mais cartas para virar, resetar o stock
  if (stockPile.currentIndex >= stockPile.cards.length) {
    const newStockCards = wastePile.cards
      .reverse()
      .map(card => ({ ...card, isFaceUp: false }));
    return {
      ...gameState,
      stockPile: { cards: newStockCards, currentIndex: 0 },
      wastePile: { cards: [] },
    };
  }

  // Mover apenas 1 carta do stock para waste
  const card = stockPile.cards[stockPile.currentIndex];
  const newWasteCards = [...wastePile.cards, { ...card, isFaceUp: true }];

  return {
    ...gameState,
    stockPile: {
      ...stockPile,
      currentIndex: stockPile.currentIndex + 1,
    },
    wastePile: { cards: newWasteCards },
    moves: gameState.moves + 1,
  };
};

export const dealFromStock = (
  gameState: SolitaireGameState
): SolitaireGameState => {
  const { stockPile, wastePile } = gameState;

  if (
    stockPile.cards.length === 0 ||
    stockPile.currentIndex >= stockPile.cards.length
  ) {
    // Se stock está vazio ou todas as cartas foram viradas, mover todas as cartas do waste de volta
    const newStockCards = wastePile.cards
      .reverse()
      .map(card => ({ ...card, isFaceUp: false }));
    return {
      ...gameState,
      stockPile: { cards: newStockCards, currentIndex: 0 },
      wastePile: { cards: [] },
    };
  }

  // Mover 1-3 cartas do stock para waste
  const cardsToDeal = Math.min(
    3,
    stockPile.cards.length - stockPile.currentIndex
  );
  const newWasteCards = [...wastePile.cards];

  for (let i = 0; i < cardsToDeal; i++) {
    const card = stockPile.cards[stockPile.currentIndex + i];
    newWasteCards.push({ ...card, isFaceUp: true });
  }

  return {
    ...gameState,
    stockPile: {
      ...stockPile,
      currentIndex: stockPile.currentIndex + cardsToDeal,
    },
    wastePile: { cards: newWasteCards },
    moves: gameState.moves + 1,
  };
};

// Mover carta para fundação
export const moveToFoundation = (
  gameState: SolitaireGameState,
  card: Card,
  foundationIndex: number
): SolitaireGameState => {
  const { foundations, tableau, wastePile } = gameState;
  const foundation = foundations[foundationIndex];

  if (!canPlaceOnFoundation(card, foundation)) {
    return gameState;
  }

  // Remover carta da fonte
  let newTableau = [...tableau];
  let newWastePile = { ...wastePile };
  let newFoundations = [...foundations];

  // Verificar se a carta veio do waste
  if (
    wastePile.cards.length > 0 &&
    wastePile.cards[wastePile.cards.length - 1].id === card.id
  ) {
    newWastePile = { cards: wastePile.cards.slice(0, -1) };
  } else {
    // Remover do tableau
    newTableau = tableau.map((column, colIndex) => {
      const cardIndex = column.cards.findIndex(c => c.id === card.id);
      if (cardIndex !== -1) {
        // Remover a carta e todas as cartas acima dela
        const newCards = column.cards.slice(0, cardIndex);
        const newHiddenCount = Math.max(0, column.hiddenCount);

        // Virar a carta que ficou no topo se necessário
        if (newCards.length > 0) {
          const topCard = newCards[newCards.length - 1];
          if (!topCard.isFaceUp) {
            newCards[newCards.length - 1] = {
              ...topCard,
              isFaceUp: true,
            };
          }
        }

        // Se a coluna ficou vazia (sem cartas face-up), garantir que ela seja realmente vazia
        const faceUpCards = newCards.filter(card => card.isFaceUp);
        if (faceUpCards.length === 0 && newCards.length > 0) {
          return {
            cards: [],
            hiddenCount: 0,
          };
        }

        return {
          cards: newCards,
          hiddenCount: newHiddenCount,
        };
      }
      return column;
    });
  }

  // Adicionar carta à fundação
  newFoundations[foundationIndex] = {
    ...foundation,
    cards: [...foundation.cards, card],
  };

  // Se waste pile ficou vazio, resetar o stock para continuar o jogo
  let finalGameState = {
    ...gameState,
    foundations: newFoundations,
    tableau: newTableau,
    wastePile: newWastePile,
    moves: gameState.moves + 1,
    isWon: isGameWon(newFoundations),
  };

  // Só virar carta do stock se a carta veio da waste pile
  if (
    wastePile.cards.length > 0 &&
    wastePile.cards[wastePile.cards.length - 1].id === card.id
  ) {
    if (newWastePile.cards.length === 0) {
      // Se ainda há cartas no stock para virar, virar próxima carta
      if (gameState.stockPile.currentIndex < gameState.stockPile.cards.length) {
        finalGameState = dealOneFromStock(finalGameState);
      }
      // Se não há mais cartas para virar no stock, resetar o stock automaticamente
      else {
        // Usar a função dealFromStock que já tem a lógica de reset
        finalGameState = dealFromStock(finalGameState);
      }
    }
    // Se waste pile não ficou vazio, mas ainda há cartas no stock, virar próxima carta
    else if (
      gameState.stockPile.currentIndex < gameState.stockPile.cards.length
    ) {
      finalGameState = dealOneFromStock(finalGameState);
    }
  }

  return ensureCardsAreFlipped(finalGameState);
};

// Mover carta para tableau
export const moveToTableau = (
  gameState: SolitaireGameState,
  card: Card,
  tableauIndex: number
): SolitaireGameState => {
  const { tableau, wastePile } = gameState;
  const targetColumn = tableau[tableauIndex];

  if (!canPlaceOnTableau(card, targetColumn)) {
    return gameState;
  }

  // Remover carta da fonte
  let newTableau = [...tableau];
  let newWastePile = { ...wastePile };

  // Verificar se a carta veio do waste
  if (
    wastePile.cards.length > 0 &&
    wastePile.cards[wastePile.cards.length - 1].id === card.id
  ) {
    newWastePile = { cards: wastePile.cards.slice(0, -1) };
  } else {
    // Remover do tableau
    newTableau = tableau.map((column, colIndex) => {
      const cardIndex = column.cards.findIndex(c => c.id === card.id);
      if (cardIndex !== -1) {
        // Remover a carta e todas as cartas acima dela
        const newCards = column.cards.slice(0, cardIndex);
        const newHiddenCount = Math.max(0, column.hiddenCount);

        // Virar a carta que ficou no topo se necessário
        if (newCards.length > 0) {
          const topCard = newCards[newCards.length - 1];
          if (!topCard.isFaceUp) {
            newCards[newCards.length - 1] = {
              ...topCard,
              isFaceUp: true,
            };
          }
        }

        // Se a coluna ficou vazia (sem cartas face-up), garantir que ela seja realmente vazia
        const faceUpCards = newCards.filter(card => card.isFaceUp);
        if (faceUpCards.length === 0 && newCards.length > 0) {
          return {
            cards: [],
            hiddenCount: 0,
          };
        }

        return {
          cards: newCards,
          hiddenCount: newHiddenCount,
        };
      }
      return column;
    });
  }

  // Adicionar carta à coluna do tableau
  newTableau[tableauIndex] = {
    ...targetColumn,
    cards: [...targetColumn.cards, card],
  };

  // Se waste pile ficou vazio, resetar o stock para continuar o jogo
  let finalGameState = {
    ...gameState,
    tableau: newTableau,
    wastePile: newWastePile,
    moves: gameState.moves + 1,
  };

  // Só virar carta do stock se a carta veio da waste pile
  if (
    wastePile.cards.length > 0 &&
    wastePile.cards[wastePile.cards.length - 1].id === card.id
  ) {
    if (newWastePile.cards.length === 0) {
      // Se ainda há cartas no stock para virar, virar próxima carta
      if (gameState.stockPile.currentIndex < gameState.stockPile.cards.length) {
        finalGameState = dealOneFromStock(finalGameState);
      }
      // Se não há mais cartas para virar no stock, resetar o stock automaticamente
      else {
        // Usar a função dealFromStock que já tem a lógica de reset
        finalGameState = dealFromStock(finalGameState);
      }
    }
    // Se waste pile não ficou vazio, mas ainda há cartas no stock, virar próxima carta
    else if (
      gameState.stockPile.currentIndex < gameState.stockPile.cards.length
    ) {
      finalGameState = dealOneFromStock(finalGameState);
    }
  }

  return ensureCardsAreFlipped(finalGameState);
};

// Mover sequência de cartas
export const moveSequence = (
  gameState: SolitaireGameState,
  cards: Card[],
  fromColumnIndex: number,
  toColumnIndex: number
): SolitaireGameState => {
  const { tableau } = gameState;
  const fromColumn = tableau[fromColumnIndex];
  const toColumn = tableau[toColumnIndex];

  if (!canPlaceOnTableau(cards[0], toColumn)) {
    return gameState;
  }

  // Remover cartas da coluna origem
  const remainingCards = fromColumn.cards.slice(
    0,
    fromColumn.cards.length - cards.length
  );
  const newFromColumn = {
    ...fromColumn,
    cards: remainingCards,
    hiddenCount: Math.max(0, fromColumn.hiddenCount),
  };

  // Virar a carta que ficou no topo se necessário
  if (remainingCards.length > 0) {
    const topCard = remainingCards[remainingCards.length - 1];
    if (!topCard.isFaceUp) {
      remainingCards[remainingCards.length - 1] = {
        ...topCard,
        isFaceUp: true,
      };
    }
  }

  // Atualizar a coluna com as cartas modificadas
  const finalFromColumn = {
    ...fromColumn,
    cards: remainingCards,
    hiddenCount: Math.max(0, fromColumn.hiddenCount),
  };

  // Se a coluna ficou vazia (sem cartas face-up), garantir que ela seja realmente vazia
  const faceUpCards = remainingCards.filter(card => card.isFaceUp);
  if (faceUpCards.length === 0 && remainingCards.length > 0) {
    finalFromColumn.cards = [];
    finalFromColumn.hiddenCount = 0;
  }

  // Adicionar cartas à coluna destino
  const newToColumn = {
    ...toColumn,
    cards: [...toColumn.cards, ...cards],
  };

  const newTableau = [...tableau];
  newTableau[fromColumnIndex] = finalFromColumn;
  newTableau[toColumnIndex] = newToColumn;

  return ensureCardsAreFlipped({
    ...gameState,
    tableau: newTableau,
    moves: gameState.moves + 1,
  });
};

// Auto-completar jogo
export const autoComplete = (
  gameState: SolitaireGameState
): SolitaireGameState => {
  let newState = { ...gameState };
  let moved = true;

  while (moved) {
    moved = false;

    // Tentar mover cartas do waste para fundações
    if (newState.wastePile.cards.length > 0) {
      const topWasteCard =
        newState.wastePile.cards[newState.wastePile.cards.length - 1];

      for (let i = 0; i < newState.foundations.length; i++) {
        if (canPlaceOnFoundation(topWasteCard, newState.foundations[i])) {
          newState = moveToFoundation(newState, topWasteCard, i);
          moved = true;
          break;
        }
      }
    }

    // Tentar mover cartas do tableau para fundações
    for (let colIndex = 0; colIndex < newState.tableau.length; colIndex++) {
      const column = newState.tableau[colIndex];
      if (column.cards.length > 0) {
        const topCard = column.cards[column.cards.length - 1];

        for (let i = 0; i < newState.foundations.length; i++) {
          if (canPlaceOnFoundation(topCard, newState.foundations[i])) {
            newState = moveToFoundation(newState, topCard, i);
            moved = true;
            break;
          }
        }
      }
    }
  }

  return newState;
};

// Função para garantir que cartas viram automaticamente
export const ensureCardsAreFlipped = (
  gameState: SolitaireGameState
): SolitaireGameState => {
  const { tableau } = gameState;

  const newTableau = tableau.map(column => {
    if (column.cards.length > 0) {
      const topCard = column.cards[column.cards.length - 1];
      if (!topCard.isFaceUp) {
        // Se é a última carta da coluna, remover ela
        if (column.cards.length === 1) {
          alert(
            `Auto-removendo última carta da coluna: ${topCard.rank} de ${topCard.suit}`
          );
          return {
            ...column,
            cards: [],
          };
        } else {
          // Virar a carta
          const updatedCards = [...column.cards];
          updatedCards[updatedCards.length - 1] = {
            ...topCard,
            isFaceUp: true,
          };
          return {
            ...column,
            cards: updatedCards,
          };
        }
      }
    }
    return column;
  });

  // Verificar se todas as colunas têm pelo menos uma carta virada
  const finalTableau = newTableau.map(column => {
    if (column.cards.length > 0) {
      const topCard = column.cards[column.cards.length - 1];
      if (!topCard.isFaceUp) {
        const updatedCards = [...column.cards];
        updatedCards[updatedCards.length - 1] = {
          ...topCard,
          isFaceUp: true,
        };
        return {
          ...column,
          cards: updatedCards,
        };
      }
    }
    return column;
  });

  return {
    ...gameState,
    tableau: finalTableau,
  };
};

// Verificar se há movimentos possíveis
export const hasPossibleMoves = (gameState: SolitaireGameState): boolean => {
  const { foundations, tableau, wastePile } = gameState;

  // Verificar movimentos do waste
  if (wastePile.cards.length > 0) {
    const topWasteCard = wastePile.cards[wastePile.cards.length - 1];

    // Para fundações
    for (const foundation of foundations) {
      if (canPlaceOnFoundation(topWasteCard, foundation)) {
        return true;
      }
    }

    // Para tableau
    for (const column of tableau) {
      if (canPlaceOnTableau(topWasteCard, column)) {
        return true;
      }
    }
  }

  // Verificar movimentos do tableau
  for (const column of tableau) {
    if (column.cards.length > 0) {
      const topCard = column.cards[column.cards.length - 1];

      // Para fundações
      for (const foundation of foundations) {
        if (canPlaceOnFoundation(topCard, foundation)) {
          return true;
        }
      }

      // Para outras colunas
      for (const otherColumn of tableau) {
        if (otherColumn !== column && canPlaceOnTableau(topCard, otherColumn)) {
          return true;
        }
      }
    }
  }

  return false;
};
