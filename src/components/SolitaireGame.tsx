import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import SEOHead from './SEOHead';
import { validateTableauColumn } from '../utils/cardUtils';

// Tipos e Interfaces
interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: string;
  value: number;
  isFaceUp: boolean;
  id: string;
}

interface Foundation {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  cards: Card[];
}

interface TableauColumn {
  faceDown: Card[];
  faceUp: Card[];
}

interface GameState {
  foundations: Foundation[];
  tableau: TableauColumn[];
  stock: Card[];
  waste: Card[];
  selectedCard: Card | null;
  selectedSource: 'waste' | 'tableau' | 'foundation' | null;
  selectedIndex: number;
  moves: number;
  time: number;
  recycles: number;
  isWon: boolean;
  config: {
    drawCount: 1 | 3;
    maxRecycles: number;
    autoFlip: boolean;
    autoMoveToFoundation: boolean;
    safeFoundationOnly: boolean;
  };
}

const SolitaireGame: React.FC = () => {
  const navigate = useNavigate();

  // Estado para validação dinâmica
  const [validDropTargets, setValidDropTargets] = useState<{
    tableau: number[];
    foundations: number[];
  }>({ tableau: [], foundations: [] });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'medium'
  );

  const [gameState, setGameState] = useState<GameState>({
    foundations: [
      { suit: 'hearts', cards: [] },
      { suit: 'diamonds', cards: [] },
      { suit: 'clubs', cards: [] },
      { suit: 'spades', cards: [] },
    ],
    tableau: Array(7)
      .fill(null)
      .map(() => ({ faceDown: [], faceUp: [] })),
    stock: [],
    waste: [],
    selectedCard: null,
    selectedSource: null,
    selectedIndex: -1,
    moves: 0,
    time: 0,
    recycles: Infinity,
    isWon: false,
    config: {
      drawCount: 1,
      maxRecycles: Infinity,
      autoFlip: true,
      autoMoveToFoundation: false,
      safeFoundationOnly: true,
    },
  });

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isWon && !gameState.isWon) {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isWon, gameState.isWon]);

  // Verificar vitória
  useEffect(() => {
    const totalFoundationCards = gameState.foundations.reduce(
      (total, foundation) => total + foundation.cards.length,
      0
    );

    console.log('🎯 Verificando vitória:', {
      totalFoundationCards,
      isWon,
      foundations: gameState.foundations.map(f => ({
        suit: f.suit,
        cards: f.cards.length,
      })),
    });

    // Verificar se todas as 52 cartas estão nas fundações
    const allCardsInFoundations = totalFoundationCards === 52;

    if (allCardsInFoundations && !isWon) {
      console.log('🎉 VITÓRIA DETECTADA! Todas as fundações completas!');
      setIsWon(true);
      setShowConfetti(true);

      // Mover todas as cartas restantes para as fundações automaticamente
      const allRemainingCards: Card[] = [];

      // Coletar cartas do tableau
      gameState.tableau.forEach(column => {
        allRemainingCards.push(...column.faceUp, ...column.faceDown);
      });

      // Coletar cartas do waste
      allRemainingCards.push(...gameState.waste);

      // Coletar cartas do stock
      allRemainingCards.push(...gameState.stock);

      // Mover todas as cartas para as fundações
      const newFoundations = [...gameState.foundations];
      allRemainingCards.forEach(card => {
        const foundationIndex = newFoundations.findIndex(
          f => f.suit === card.suit
        );
        if (foundationIndex !== -1) {
          newFoundations[foundationIndex].cards.push({
            ...card,
            isFaceUp: true,
          });
        }
      });

      setGameState(prev => ({
        ...prev,
        foundations: newFoundations,
        tableau: Array(7)
          .fill(null)
          .map(() => ({ faceUp: [], faceDown: [] })),
        waste: [],
        stock: [],
        isWon: true,
        // NÃO incrementar moves para movimentos automáticos de vitória
      }));

      // Parar confetes após 8 segundos
      setTimeout(() => setShowConfetti(false), 8000);
    }
  }, [
    gameState.foundations,
    gameState.tableau,
    gameState.waste,
    gameState.stock,
    isWon,
  ]);

  // Criar baralho
  const createDeck = (): Card[] => {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = [
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
        deck.push({
          suit,
          rank,
          value: index + 1,
          isFaceUp: false,
          id: `${suit}-${rank}-${Math.random().toString(36).substr(2, 9)}`,
        });
      });
    });

    return deck;
  };

  // Embaralhar
  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Verificar se pode colocar carta no tableau
  const canPlaceOnTableau = (
    card: Card,
    targetColumn: TableauColumn
  ): boolean => {
    // Se a coluna está vazia (sem cartas face-up e face-down)
    if (
      targetColumn.faceUp.length === 0 &&
      targetColumn.faceDown.length === 0
    ) {
      // Para slots vazios, só aceita Rei
      return card.rank === 'K';
    }

    // Se a coluna tem cartas face-up
    if (targetColumn.faceUp.length > 0) {
      const topCard = targetColumn.faceUp[targetColumn.faceUp.length - 1];
      const isAlternatingColor =
        (card.suit === 'hearts' || card.suit === 'diamonds') !==
        (topCard.suit === 'hearts' || topCard.suit === 'diamonds');
      const isOneLower = card.value === topCard.value - 1;

      return isAlternatingColor && isOneLower;
    }

    // Se só tem cartas face-down, não pode colocar
    return false;
  };

  // Verificar se pode colocar carta na fundação
  const canPlaceOnFoundation = (
    card: Card,
    foundation: Foundation
  ): boolean => {
    if (foundation.cards.length === 0) {
      return card.rank === 'A' && card.suit === foundation.suit;
    }

    const topCard = foundation.cards[foundation.cards.length - 1];
    return card.suit === foundation.suit && card.value === topCard.value + 1;
  };

  // Iniciar novo jogo
  const newGame = () => {
    const deck = shuffleDeck(createDeck());
    const foundations = [
      { suit: 'hearts', cards: [] },
      { suit: 'diamonds', cards: [] },
      { suit: 'clubs', cards: [] },
      { suit: 'spades', cards: [] },
    ];
    const tableau = Array(7)
      .fill(null)
      .map(() => ({ faceDown: [], faceUp: [] }));
    let cardIndex = 0;

    // Distribuir cartas no tableau
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = { ...deck[cardIndex++], isFaceUp: row === col };
        if (row === col) {
          tableau[col].faceUp.push(card);
        } else {
          tableau[col].faceDown.push(card);
        }
      }
    }

    setGameState({
      foundations,
      tableau,
      stock: deck.slice(cardIndex),
      waste: [],
      selectedCard: null,
      selectedSource: null,
      selectedIndex: -1,
      moves: 0,
      time: 0,
      recycles: gameState.config.maxRecycles,
      isWon: false,
      config: gameState.config,
    });

    // Aplicar efeitos da dificuldade
    setTimeout(() => applyDifficultyEffects(), 100);
  };

  // Comprar cartas do stock
  const drawFromStock = () => {
    if (gameState.stock.length === 0) {
      if (gameState.waste.length > 0 && gameState.recycles > 0) {
        // Reciclar waste para stock
        setGameState(prev => ({
          ...prev,
          stock: prev.waste
            .map(card => ({ ...card, isFaceUp: false }))
            .reverse(),
          waste: [],
          recycles: prev.recycles - 1,
        }));
      }
      return;
    }

    const cardsToDraw = Math.min(
      gameState.config.drawCount,
      gameState.stock.length
    );
    const drawnCards = gameState.stock
      .slice(0, cardsToDraw)
      .map(card => ({ ...card, isFaceUp: true }));

    setGameState(prev => ({
      ...prev,
      stock: prev.stock.slice(cardsToDraw),
      waste: [...prev.waste, ...drawnCards],
      moves: prev.moves + 1,
    }));
  };

  // Selecionar carta
  const selectCard = (
    card: Card,
    source: 'waste' | 'tableau' | 'foundation',
    index: number
  ) => {
    if (card.isFaceUp) {
      let selectedSequence: Card[] = [];

      // Se for do tableau, selecionar TODAS as cartas abaixo
      if (source === 'tableau') {
        const column = gameState.tableau[index];
        const cardIndex = column.faceUp.findIndex(c => c.id === card.id);
        if (cardIndex !== -1) {
          // Pegar TODAS as cartas a partir da carta selecionada até o final
          selectedSequence = column.faceUp.slice(cardIndex);
        }
      } else {
        selectedSequence = [card];
      }

      setGameState(prev => ({
        ...prev,
        selectedCard: prev.selectedCard?.id === card.id ? null : card,
        selectedSource: prev.selectedCard?.id === card.id ? null : source,
        selectedIndex: prev.selectedCard?.id === card.id ? -1 : index,
        selectedSequence:
          prev.selectedCard?.id === card.id ? [] : selectedSequence,
      }));
    }
  };

  // Validar destinos possíveis para uma carta
  const validateDropTargets = (card: Card, source: string, index: number) => {
    const validTableau: number[] = [];
    const validFoundations: number[] = [];

    // Validar tableau - permitir todas as colunas por enquanto
    gameState.tableau.forEach((column, columnIndex) => {
      validTableau.push(columnIndex);
    });

    // Validar foundations
    gameState.foundations.forEach((foundation, foundationIndex) => {
      if (canPlaceOnFoundation(card, foundation)) {
        validFoundations.push(foundationIndex);
      }
    });

    setValidDropTargets({
      tableau: validTableau,
      foundations: validFoundations,
    });
  };

  // Drag and Drop handlers
  const handleDragStart = (
    e: React.DragEvent,
    card: Card,
    source: 'waste' | 'tableau' | 'foundation',
    index: number
  ) => {
    // Determinar sequência - TODAS as cartas abaixo
    let selectedSequence: Card[] = [];
    if (source === 'tableau') {
      const column = gameState.tableau[index];
      const cardIndex = column.faceUp.findIndex(c => c.id === card.id);

      if (cardIndex !== -1) {
        // Pegar TODAS as cartas a partir da carta selecionada
        selectedSequence = column.faceUp.slice(cardIndex);
      }
    } else {
      selectedSequence = [card];
    }

    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ card, source, index, selectedSequence })
    );
    setGameState(prev => ({
      ...prev,
      selectedCard: card,
      selectedSource: source,
      selectedIndex: index,
      selectedSequence: selectedSequence,
    }));

    // Validar destinos possíveis
    validateDropTargets(card, source, index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    // Limpar highlights quando o drag termina
    setValidDropTargets({ tableau: [], foundations: [] });
  };

  const handleDrop = (e: React.DragEvent, targetColumnIndex: number) => {
    e.preventDefault();
    console.log('🎯 DROP EVENT TRIGGERED on column:', targetColumnIndex);

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      console.log('📦 Drop data received:', data);
      const { card, source, index, selectedSequence } = data;

      if (source === 'tableau' && index === targetColumnIndex) {
        console.log('❌ Same column, ignoring');
        return;
      }

      console.log('✅ Setting state and calling moveToTableau...');
      setGameState(prev => ({
        ...prev,
        selectedCard: card,
        selectedSource: source,
        selectedIndex: index,
        selectedSequence: selectedSequence || [card],
      }));

      moveToTableau(targetColumnIndex);
    } catch (error) {
      console.error('❌ Error in handleDrop:', error);
    }
  };

  const handleDropFoundation = (
    e: React.DragEvent,
    foundationIndex: number
  ) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { card, source, index } = data;

    setGameState(prev => ({
      ...prev,
      selectedCard: card,
      selectedSource: source,
      selectedIndex: index,
    }));

    moveToFoundation(foundationIndex);
  };

  // Mover carta para tableau
  const moveToTableau = (targetColumnIndex: number) => {
    if (!gameState.selectedCard || !gameState.selectedSource) {
      return;
    }

    const targetColumn = gameState.tableau[targetColumnIndex];
    const sequenceToMove = gameState.selectedSequence || [
      gameState.selectedCard,
    ];

    // VALIDAR SE O MOVIMENTO É VÁLIDO
    const firstCard = sequenceToMove[0];
    console.log('🔍 Validando movimento:', {
      card: `${firstCard.rank} de ${firstCard.suit}`,
      targetColumn: targetColumnIndex,
      targetFaceUp: targetColumn.faceUp.length,
      targetFaceDown: targetColumn.faceDown.length,
      isEmpty:
        targetColumn.faceUp.length === 0 && targetColumn.faceDown.length === 0,
    });

    const isValidMove = canPlaceOnTableau(firstCard, targetColumn);
    console.log('🔍 Resultado da validação:', {
      isValid: isValidMove,
      cardRank: firstCard.rank,
      isKing: firstCard.rank === 'K',
      targetEmpty:
        targetColumn.faceUp.length === 0 && targetColumn.faceDown.length === 0,
    });

    if (!isValidMove) {
      console.log(
        '❌ Movimento inválido: não pode colocar',
        firstCard.rank,
        'de',
        firstCard.suit,
        'na coluna'
      );

      // Limpar seleção para evitar cartas sobrepostas
      setGameState(prev => ({
        ...prev,
        selectedCard: null,
        selectedSource: null,
        selectedIndex: -1,
        selectedSequence: [],
      }));

      // Som de negação
      const audio = new Audio(
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBS13yO/eizEIHWq+8+OWT'
      );
      audio.play().catch(() => {});

      return;
    }

    console.log('✅ Movimento válido! Prosseguindo...');

    // Remover cartas da origem
    let newTableau = [...gameState.tableau];
    let newWaste = [...gameState.waste];

    if (gameState.selectedSource === 'waste') {
      newWaste = gameState.waste.slice(0, -1);
    } else if (gameState.selectedSource === 'tableau') {
      const sourceColumn = newTableau[gameState.selectedIndex];
      sourceColumn.faceUp = sourceColumn.faceUp.slice(
        0,
        -sequenceToMove.length
      );

      // Virar carta se necessário
      if (
        sourceColumn.faceUp.length === 0 &&
        sourceColumn.faceDown.length > 0
      ) {
        const cardToFlip = sourceColumn.faceDown.pop()!;
        sourceColumn.faceUp.push({ ...cardToFlip, isFaceUp: true });
      }
    }

    // Adicionar sequência ao destino
    console.log('📦 Adicionando cartas ao destino:', {
      targetColumn: targetColumnIndex,
      cardsToAdd: sequenceToMove.map(c => `${c.rank} de ${c.suit}`),
      beforeLength: newTableau[targetColumnIndex].faceUp.length,
    });

    newTableau[targetColumnIndex].faceUp.push(...sequenceToMove);

    console.log('📦 Após adicionar:', {
      afterLength: newTableau[targetColumnIndex].faceUp.length,
      cards: newTableau[targetColumnIndex].faceUp.map(
        c => `${c.rank} de ${c.suit}`
      ),
    });

    setGameState(prev => ({
      ...prev,
      tableau: newTableau,
      waste: newWaste,
      selectedCard: null,
      selectedSource: null,
      selectedIndex: -1,
      selectedSequence: [],
      moves: prev.moves + 1,
    }));
  };

  // Aplicar efeitos da dificuldade
  const applyDifficultyEffects = () => {
    switch (difficulty) {
      case 'easy':
        // Easy: Mais tempo, dicas mais frequentes
        setGameState(prev => ({
          ...prev,
          recycles: Infinity, // Reciclagem infinita
        }));
        break;
      case 'medium':
        // Medium: Configuração padrão
        setGameState(prev => ({
          ...prev,
          recycles: 3, // 3 reciclagens
        }));
        break;
      case 'hard':
        // Hard: Menos tempo, sem reciclagem
        setGameState(prev => ({
          ...prev,
          recycles: 0, // Sem reciclagem
        }));
        break;
    }
  };

  // Função de hints
  const getHint = () => {
    setShowHints(true);

    // Encontrar movimentos possíveis
    const possibleMoves = [];

    // Verificar movimentos do waste para fundações
    if (gameState.waste.length > 0) {
      const topWasteCard = gameState.waste[gameState.waste.length - 1];
      for (let i = 0; i < gameState.foundations.length; i++) {
        if (canPlaceOnFoundation(topWasteCard, gameState.foundations[i])) {
          possibleMoves.push({
            type: 'waste-to-foundation',
            card: topWasteCard,
            target: i,
            description: `${topWasteCard.rank} de ${topWasteCard.suit} → Fundação ${gameState.foundations[i].suit}`,
          });
        }
      }
    }

    // Verificar movimentos do tableau para fundações
    gameState.tableau.forEach((column, colIndex) => {
      if (column.faceUp.length > 0) {
        const topCard = column.faceUp[column.faceUp.length - 1];
        for (let i = 0; i < gameState.foundations.length; i++) {
          if (canPlaceOnFoundation(topCard, gameState.foundations[i])) {
            possibleMoves.push({
              type: 'tableau-to-foundation',
              card: topCard,
              source: colIndex,
              target: i,
              description: `${topCard.rank} de ${topCard.suit} → Fundação ${gameState.foundations[i].suit}`,
            });
          }
        }
      }
    });

    if (possibleMoves.length > 0) {
      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      alert(`💡 Dica: ${randomMove.description}`);
    } else {
      alert(
        '💡 Nenhuma dica disponível no momento. Tente virar cartas ou reorganizar o tableau.'
      );
    }

    setTimeout(() => setShowHints(false), 1000);
  };

  // Double-click para mover automaticamente para fundação
  const handleDoubleClick = (card: Card) => {
    // Encontrar a fundação correta para esta carta
    const foundationIndex = gameState.foundations.findIndex(
      f => f.suit === card.suit
    );

    if (
      foundationIndex !== -1 &&
      canPlaceOnFoundation(card, gameState.foundations[foundationIndex])
    ) {
      // Mover carta para fundação
      const newFoundations = [...gameState.foundations];
      newFoundations[foundationIndex].cards.push({ ...card, isFaceUp: true });

      // Remover carta da origem
      let newTableau = [...gameState.tableau];
      let newWaste = [...gameState.waste];

      // Procurar carta no tableau
      let foundInTableau = false;
      for (let i = 0; i < newTableau.length; i++) {
        const column = newTableau[i];
        const cardIndex = column.faceUp.findIndex(c => c.id === card.id);
        if (cardIndex !== -1) {
          column.faceUp.splice(cardIndex, 1);

          // Virar carta se necessário
          if (column.faceUp.length === 0 && column.faceDown.length > 0) {
            const cardToFlip = column.faceDown.pop()!;
            column.faceUp.push({ ...cardToFlip, isFaceUp: true });
          }
          foundInTableau = true;
          break;
        }
      }

      // Se não encontrou no tableau, procurar no waste
      if (!foundInTableau) {
        const wasteIndex = newWaste.findIndex(c => c.id === card.id);
        if (wasteIndex !== -1) {
          newWaste.splice(wasteIndex, 1);
        }
      }

      setGameState(prev => ({
        ...prev,
        foundations: newFoundations,
        tableau: newTableau,
        waste: newWaste,
        moves: prev.moves + 1,
      }));
    }
  };

  // Mover carta para fundação
  const moveToFoundation = (foundationIndex: number) => {
    if (!gameState.selectedCard || !gameState.selectedSource) return;

    const foundation = gameState.foundations[foundationIndex];

    if (!canPlaceOnFoundation(gameState.selectedCard, foundation)) {
      setGameState(prev => ({
        ...prev,
        selectedCard: null,
        selectedSource: null,
        selectedIndex: -1,
      }));
      return;
    }

    // Remover carta da origem
    let newTableau = [...gameState.tableau];
    let newWaste = [...gameState.waste];

    if (gameState.selectedSource === 'waste') {
      newWaste = gameState.waste.slice(0, -1);
    } else if (gameState.selectedSource === 'tableau') {
      const sourceColumn = newTableau[gameState.selectedIndex];
      sourceColumn.faceUp = sourceColumn.faceUp.slice(0, -1);

      // Virar carta se necessário
      if (
        sourceColumn.faceUp.length === 0 &&
        sourceColumn.faceDown.length > 0
      ) {
        const cardToFlip = sourceColumn.faceDown.pop()!;
        sourceColumn.faceUp.push({ ...cardToFlip, isFaceUp: true });
      }
    }

    // Adicionar carta à fundação
    const newFoundations = [...gameState.foundations];
    newFoundations[foundationIndex].cards.push(gameState.selectedCard);

    // Verificar vitória
    const isWon = newFoundations.every(
      foundation => foundation.cards.length === 13
    );

    setGameState(prev => ({
      ...prev,
      tableau: newTableau,
      waste: newWaste,
      foundations: newFoundations,
      selectedCard: null,
      selectedSource: null,
      selectedIndex: -1,
      moves: prev.moves + 1,
      isWon,
    }));
  };

  // Obter símbolo da carta
  const getCardSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts':
        return '♥';
      case 'diamonds':
        return '♦';
      case 'clubs':
        return '♣';
      case 'spades':
        return '♠';
      default:
        return '';
    }
  };

  // Obter cor da carta
  const getCardColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds'
      ? 'text-red-500'
      : 'text-black';
  };

  // Formatar tempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Validar todo o tableau
  const validateTableau = () => {
    console.log('🔍 Validating entire tableau...');
    gameState.tableau.forEach((column, index) => {
      console.log(`Column ${index}:`);
      validateTableauColumn(column);
    });
  };

  // Inicializar jogo
  useEffect(() => {
    newGame();
  }, []);

  // Validar tableau quando o estado muda
  useEffect(() => {
    if (gameState.isGameStarted) {
      validateTableau();
    }
  }, [gameState.tableau]);

  return (
    <>
      <SEOHead
        pageTitle="Solitaire - GSL Game Zone"
        pageDescription="Play classic Klondike Solitaire online. Free solitaire card game."
        pageKeywords="solitaire, card game, klondike, free online game"
      />

      {/* Confetes na vitória */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={1500}
          gravity={0.2}
          initialVelocityY={30}
          initialVelocityX={15}
        />
      )}

      {/* Sistema de Layout Responsivo Inteligente */}
      <style>{`
        /* Mobile First - Base styles */
        .game-container {
          padding: 0.5rem;
          max-width: 100vw;
          overflow-x: auto;
        }

        .header-responsive {
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem;
        }

        .header-stats {
          font-size: 0.75rem;
          text-align: center;
        }

        .header-buttons {
          flex-direction: row;
          gap: 0.5rem;
          justify-content: center;
        }

        .top-section {
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stock-waste {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        
        @media (max-width: 640px) {
          .stock-waste {
            gap: 0.0625rem;
          }
          .foundations {
            gap: 0.125rem;
          }
        }

        .foundations {
          display: flex;
          gap: 0.25rem;
          justify-content: center;
          flex-wrap: nowrap;
        }

        .tableau-responsive {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
          overflow-x: auto;
          padding: 0.25rem;
        }

        .card-responsive {
          width: 2.2rem;
          height: 3.2rem;
          font-size: 0.6rem;
          border-radius: 0.375rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(0, 0, 0, 0.1);
        }

        .card-rank {
          font-size: 0.6rem;
          font-family: Arial, sans-serif;
          font-weight: bold;
          color: #1f2937;
        }
        .card-suit {
          font-size: 0.5rem;
          font-family: Arial, sans-serif;
        }
        .card-suit-large {
          font-size: 1rem;
          font-family: Arial, sans-serif;
        }

        /* Cores mais saturadas para cartas */
        .card-red {
          color: #dc2626 !important;
        }
        .card-black {
          color: #1f2937 !important;
        }
        
        /* Cores profissionais como no exemplo */
        .card-hearts, .card-diamonds {
          color: #dc2626 !important;
        }
        
        .card-clubs, .card-spades {
          color: #1f2937 !important;
        }

        /* Small Mobile (320px-480px) */
        @media (min-width: 320px) {
          .card-responsive {
            width: 2.75rem;
            height: 3.75rem;
          }
          .card-rank {
            font-size: 0.65rem;
          }
          .card-suit {
            font-size: 0.55rem;
          }
          .card-suit-large {
            font-size: 1.1rem;
          }
        }

        /* Mobile (480px-640px) */
        @media (min-width: 480px) {
          .game-container {
            padding: 1rem;
          }
          .header-responsive {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .header-stats {
            text-align: left;
            font-size: 0.875rem;
          }
          .top-section {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .card-responsive {
            width: 3rem;
            height: 4rem;
          }
          .card-rank {
            font-size: 0.7rem;
          }
          .card-suit {
            font-size: 0.6rem;
          }
          .card-suit-large {
            font-size: 1.2rem;
          }
        }

        /* Tablet (640px-768px) */
        @media (min-width: 640px) {
          .game-container {
            padding: 1.5rem;
          }
          .tableau-responsive {
            gap: 0.75rem;
          }
          .card-responsive {
            width: 3.5rem;
            height: 4.5rem;
          }
          .card-rank {
            font-size: 0.8rem;
          }
          .card-suit {
            font-size: 0.7rem;
          }
          .card-suit-large {
            font-size: 1.4rem;
          }
        }

        /* Large Tablet (768px-1024px) */
        @media (min-width: 768px) {
          .game-container {
            padding: 2rem;
          }
          .tableau-responsive {
            gap: 1rem;
          }
          .card-responsive {
            width: 4rem;
            height: 5rem;
          }
          .card-rank {
            font-size: 0.9rem;
          }
          .card-suit {
            font-size: 0.8rem;
          }
          .card-suit-large {
            font-size: 1.6rem;
          }
        }

        /* Desktop (1024px+) */
        @media (min-width: 1024px) {
          .game-container {
            padding: 2.5rem;
          }
          .tableau-responsive {
            gap: 1.25rem;
          }
          .card-responsive {
            width: 4.5rem;
            height: 5.5rem;
          }
          .card-rank {
            font-size: 1rem;
          }
          .card-suit {
            font-size: 0.9rem;
          }
          .card-suit-large {
            font-size: 1.8rem;
          }
        }

        /* Large Desktop (1280px+) */
        @media (min-width: 1280px) {
          .card-responsive {
            width: 5rem;
            height: 6rem;
          }
          .card-rank {
            font-size: 1.1rem;
          }
          .card-suit {
            font-size: 1rem;
          }
          .card-suit-large {
            font-size: 2rem;
          }
        }

        /* Ultra-wide (1920px+) */
        @media (min-width: 1920px) {
          .card-responsive {
            width: 5.5rem;
            height: 6.5rem;
          }
          .card-rank {
            font-size: 1.2rem;
          }
          .card-suit {
            font-size: 1.1rem;
          }
          .card-suit-large {
            font-size: 2.2rem;
          }
        }

        /* Hover effects */
        .card-hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        /* Touch-friendly on mobile */
        @media (max-width: 768px) {
          .card-responsive {
            min-width: 2.5rem;
            min-height: 3.5rem;
          }
        }

        /* Empilhamento responsivo */
        .card-stack {
          position: relative;
          min-height: 200px;
          width: 100%;
        }

        .card-stack .card-responsive {
          transition: all 0.2s ease;
        }

        .card-stack .card-responsive:hover {
          transform: translateY(-3px) scale(1.03);
          z-index: 50 !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        /* Efeito cascata mais natural */
        .card-cascade {
          transform: translateY(0);
          transition: transform 0.3s ease;
        }

        .card-cascade:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
        }

        /* Mobile stacking optimization */
        @media (max-width: 640px) {
          .card-stack .card-responsive {
            min-height: 3rem;
          }
        }

        /* Tablet stacking */
        @media (min-width: 640px) and (max-width: 1024px) {
          .card-stack .card-responsive {
            min-height: 4rem;
          }
        }

        /* Desktop stacking */
        @media (min-width: 1024px) {
          .card-stack .card-responsive {
            min-height: 5rem;
          }
        }

        /* Seleção profissional */
        .card-selected {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          border: 2px solid #3b82f6;
          z-index: 100 !important;
        }

        /* Efeito de drag profissional */
        .card-dragging {
          transform: rotate(5deg) scale(1.1);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          z-index: 200 !important;
          opacity: 0.9;
        }

        /* Animação de drop */
        .card-drop-target {
          animation: pulse 0.5s ease-in-out;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      <div className="h-screen bg-green-800 game-container overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-900 rounded-xl mb-8 header-responsive"
            style={{ paddingLeft: '32px', paddingRight: '32px' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-xl sm:text-2xl font-bold">
                  Classic Klondike Solitaire
                </h1>
                <div className="text-white text-sm header-stats">
                  Moves: {gameState.moves} | Time: {formatTime(gameState.time)}
                </div>
              </div>

              <div className="flex gap-2 header-buttons self-end">
                <button
                  onClick={newGame}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  New Game
                </button>
                <button
                  onClick={() => navigate('/solitaire-setup')}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Setup
                </button>
              </div>
            </div>
          </motion.div>

          {/* Game Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-0 flex-1 flex flex-col"
          >
            {/* Foundations, Stock and Waste */}
            <div
              className="flex justify-between items-center mb-6 stock-waste"
              style={{ gap: '2rem' }}
            >
              {/* Foundations */}
              <div className="flex foundations" style={{ gap: '12px' }}>
                {gameState.foundations.map((foundation, index) => (
                  <div
                    key={index}
                    className={`w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-28 bg-green-900 rounded-lg flex items-center justify-center cursor-pointer shadow-md hover:bg-green-800 hover:shadow-lg transition-all duration-200 ${
                      validDropTargets.foundations.includes(index) ? '' : ''
                    }`}
                    onClick={() =>
                      gameState.selectedCard && moveToFoundation(index)
                    }
                    onDragOver={handleDragOver}
                    onDrop={e => handleDropFoundation(e, index)}
                  >
                    {foundation.cards.length > 0 ? (
                      <div className="relative w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-28">
                        {foundation.cards.map((card, cardIndex) => (
                          <div
                            key={card.id}
                            className="w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-28 rounded-lg flex flex-col items-center justify-center absolute cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-2xl bg-white shadow-md border-2 border-gray-200"
                            style={{
                              top:
                                cardIndex > 0
                                  ? `${-8 - cardIndex * 1}px`
                                  : '0px',
                              zIndex: cardIndex + 10,
                            }}
                          >
                            {/* Número no canto superior esquerdo */}
                            <div
                              className="absolute top-1 left-1 font-bold text-sm sm:text-lg"
                              style={{
                                color:
                                  card.suit === 'hearts' ||
                                  card.suit === 'diamonds'
                                    ? '#dc2626'
                                    : '#000000',
                              }}
                            >
                              {card.rank}
                            </div>

                            {/* Naipe no canto superior direito */}
                            <div
                              className="absolute top-1 right-1 text-sm sm:text-lg"
                              style={{
                                color:
                                  card.suit === 'hearts' ||
                                  card.suit === 'diamonds'
                                    ? '#dc2626'
                                    : '#000000',
                              }}
                            >
                              {getCardSymbol(card.suit)}
                            </div>

                            {/* Símbolo do naipe grande no centro */}
                            <div
                              className="text-3xl sm:text-5xl font-bold"
                              style={{
                                color:
                                  card.suit === 'hearts' ||
                                  card.suit === 'diamonds'
                                    ? '#dc2626'
                                    : '#000000',
                              }}
                            >
                              {getCardSymbol(card.suit)}
                            </div>

                            {/* Número invertido no canto inferior direito */}
                            <div
                              className="absolute bottom-1 right-1 font-bold text-sm sm:text-lg transform rotate-180"
                              style={{
                                color:
                                  card.suit === 'hearts' ||
                                  card.suit === 'diamonds'
                                    ? '#dc2626'
                                    : '#000000',
                              }}
                            >
                              {card.rank}
                            </div>

                            {/* Naipe invertido no canto inferior esquerdo */}
                            <div
                              className="absolute bottom-1 left-1 text-sm sm:text-lg transform rotate-180"
                              style={{
                                color:
                                  card.suit === 'hearts' ||
                                  card.suit === 'diamonds'
                                    ? '#dc2626'
                                    : '#000000',
                              }}
                            >
                              {getCardSymbol(card.suit)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className={`text-2xl ${getCardColor(foundation.suit)}`}
                      >
                        {getCardSymbol(foundation.suit)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Stock and Waste - Right Side */}
              <div className="flex gap-4">
                {/* Stock */}
                <div
                  className="w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-28 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center border-2 border-white"
                  style={{
                    background: '#b91c1c',
                    backgroundImage: `
                      repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px),
                      repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px)
                    `,
                    boxShadow:
                      '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                  onClick={drawFromStock}
                >
                  <div className="text-white text-sm font-bold">
                    {gameState.stock.length}
                  </div>
                </div>

                {/* Waste */}
                <div
                  className="w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-28 bg-green-900 rounded-lg flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() =>
                    gameState.waste.length > 0 &&
                    selectCard(
                      gameState.waste[gameState.waste.length - 1],
                      'waste',
                      0
                    )
                  }
                  draggable={gameState.waste.length > 0}
                  onDoubleClick={() =>
                    gameState.waste.length > 0 &&
                    handleDoubleClick(
                      gameState.waste[gameState.waste.length - 1]
                    )
                  }
                  onDragStart={e =>
                    gameState.waste.length > 0 &&
                    handleDragStart(
                      e,
                      gameState.waste[gameState.waste.length - 1],
                      'waste',
                      0
                    )
                  }
                >
                  {gameState.waste.length > 0 ? (
                    <div className="w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-28 bg-white rounded-lg flex flex-col items-center justify-center relative shadow-md border-2 border-gray-200">
                      {/* Número no canto superior esquerdo */}
                      <div
                        className="absolute top-1 left-1 font-bold text-sm sm:text-lg"
                        style={{
                          color:
                            gameState.waste[gameState.waste.length - 1].suit ===
                              'hearts' ||
                            gameState.waste[gameState.waste.length - 1].suit ===
                              'diamonds'
                              ? '#dc2626'
                              : '#000000',
                        }}
                      >
                        {gameState.waste[gameState.waste.length - 1].rank}
                      </div>

                      {/* Naipe no canto superior direito */}
                      <div
                        className="absolute top-1 right-1 text-sm sm:text-lg"
                        style={{
                          color:
                            gameState.waste[gameState.waste.length - 1].suit ===
                              'hearts' ||
                            gameState.waste[gameState.waste.length - 1].suit ===
                              'diamonds'
                              ? '#dc2626'
                              : '#000000',
                        }}
                      >
                        {getCardSymbol(
                          gameState.waste[gameState.waste.length - 1].suit
                        )}
                      </div>

                      {/* Símbolo do naipe grande no centro */}
                      <div
                        className="text-3xl sm:text-5xl font-bold"
                        style={{
                          color:
                            gameState.waste[gameState.waste.length - 1].suit ===
                              'hearts' ||
                            gameState.waste[gameState.waste.length - 1].suit ===
                              'diamonds'
                              ? '#dc2626'
                              : '#000000',
                        }}
                      >
                        {getCardSymbol(
                          gameState.waste[gameState.waste.length - 1].suit
                        )}
                      </div>

                      {/* Número invertido no canto inferior direito */}
                      <div
                        className="absolute bottom-1 right-1 font-bold text-sm sm:text-lg transform rotate-180"
                        style={{
                          color:
                            gameState.waste[gameState.waste.length - 1].suit ===
                              'hearts' ||
                            gameState.waste[gameState.waste.length - 1].suit ===
                              'diamonds'
                              ? '#dc2626'
                              : '#000000',
                        }}
                      >
                        {gameState.waste[gameState.waste.length - 1].rank}
                      </div>

                      {/* Naipe invertido no canto inferior esquerdo */}
                      <div
                        className="absolute bottom-1 left-1 text-sm sm:text-lg transform rotate-180"
                        style={{
                          color:
                            gameState.waste[gameState.waste.length - 1].suit ===
                              'hearts' ||
                            gameState.waste[gameState.waste.length - 1].suit ===
                              'diamonds'
                              ? '#dc2626'
                              : '#000000',
                        }}
                      >
                        {getCardSymbol(
                          gameState.waste[gameState.waste.length - 1].suit
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-green-200 text-sm">Empty</div>
                  )}
                </div>
              </div>
            </div>

            {/* Tableau */}
            <div
              className="grid grid-cols-7 gap-0.5 mt-8 tableau-responsive justify-center flex-1"
              style={{ gridTemplateColumns: 'repeat(7, 60px)' }}
            >
              {gameState.tableau.map((column, columnIndex) => (
                <div
                  key={columnIndex}
                  className={`card-stack relative min-h-[600px] h-auto ${
                    validDropTargets.tableau.includes(columnIndex) ? '' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDrop(e, columnIndex)}
                >
                  {/* Cartas viradas para baixo */}
                  {column.faceDown.map((card, cardIndex) => (
                    <div
                      key={card.id}
                      className="w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-28 rounded-lg absolute cursor-pointer hover:shadow-xl transition-all duration-200 border-2 border-white"
                      style={{
                        background: '#b91c1c',
                        backgroundImage: `
                          repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px),
                          repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px)
                        `,
                        boxShadow:
                          '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
                        top: `${cardIndex * 22}px`,
                        zIndex: cardIndex + 10,
                      }}
                    ></div>
                  ))}

                  {/* Cartas viradas para cima */}
                  {column.faceUp.map((card, cardIndex) => (
                    <div
                      key={card.id}
                      className={`w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-28 rounded-lg flex flex-col items-center justify-center absolute cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-2xl bg-white shadow-md border-2 border-gray-200 ${
                        gameState.selectedCard?.id === card.id
                          ? 'card-selected'
                          : ''
                      }`}
                      style={{
                        top: `${(column.faceDown.length + cardIndex) * 22}px`,
                        zIndex: column.faceDown.length + cardIndex + 20,
                      }}
                      onClick={() => selectCard(card, 'tableau', columnIndex)}
                      onDoubleClick={() => handleDoubleClick(card)}
                      draggable={true}
                      onDragStart={e =>
                        handleDragStart(e, card, 'tableau', columnIndex)
                      }
                      onDragEnd={handleDragEnd}
                    >
                      {/* Número no canto superior esquerdo */}
                      <div
                        className="absolute top-1 left-1 font-bold text-sm sm:text-lg"
                        style={{
                          color:
                            card.suit === 'hearts' || card.suit === 'diamonds'
                              ? '#dc2626'
                              : '#000000',
                        }}
                      >
                        {card.rank}
                      </div>

                      {/* Naipe no canto superior direito */}
                      <div
                        className="absolute top-1 right-1 text-sm sm:text-lg"
                        style={{
                          color:
                            card.suit === 'hearts' || card.suit === 'diamonds'
                              ? '#dc2626'
                              : '#000000',
                        }}
                      >
                        {getCardSymbol(card.suit)}
                      </div>

                      {/* Símbolo do naipe grande no centro */}
                      <div
                        className="text-3xl sm:text-5xl font-bold"
                        style={{
                          color:
                            card.suit === 'hearts' || card.suit === 'diamonds'
                              ? '#dc2626'
                              : '#000000',
                        }}
                      >
                        {getCardSymbol(card.suit)}
                      </div>

                      {/* Número invertido no canto inferior direito */}
                      <div
                        className="absolute bottom-1 right-1 font-bold text-sm sm:text-lg transform rotate-180"
                        style={{
                          color:
                            card.suit === 'hearts' || card.suit === 'diamonds'
                              ? '#dc2626'
                              : '#000000',
                        }}
                      >
                        {card.rank}
                      </div>

                      {/* Naipe invertido no canto inferior esquerdo */}
                      <div
                        className="absolute bottom-1 left-1 text-sm sm:text-lg transform rotate-180"
                        style={{
                          color:
                            card.suit === 'hearts' || card.suit === 'diamonds'
                              ? '#dc2626'
                              : '#000000',
                        }}
                      >
                        {getCardSymbol(card.suit)}
                      </div>
                    </div>
                  ))}

                  {/* Área de drop para coluna vazia */}
                  {column.faceUp.length === 0 &&
                    column.faceDown.length === 0 && (
                      <div
                        className="w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-28 rounded-lg cursor-pointer bg-green-900 hover:bg-green-800 transition-all duration-200"
                        onClick={() =>
                          gameState.selectedCard && moveToTableau(columnIndex)
                        }
                      ></div>
                    )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SolitaireGame;
