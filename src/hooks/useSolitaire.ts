import { useState, useEffect, useCallback } from 'react';
import {
  SolitaireGameState,
  Card,
  SolitaireStats,
  SolitaireSettings,
} from '../types/solitaire';
import {
  createInitialGameState,
  dealOneFromStock,
  moveToFoundation,
  moveToTableau,
  moveSequence,
  autoComplete,
  hasPossibleMoves,
} from '../utils/solitaireLogic';
import { canPlaceOnFoundation } from '../utils/cardUtils';

export const useSolitaire = () => {
  const [gameState, setGameState] = useState<SolitaireGameState>(
    createInitialGameState()
  );
  const [stats, setStats] = useState<SolitaireStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    bestTime: 0,
    totalMoves: 0,
    averageMoves: 0,
    winRate: 0,
  });
  const [settings, setSettings] = useState<SolitaireSettings>({
    difficulty: 'medium',
    autoComplete: false,
    hints: true,
    animations: true,
    sound: false,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  // Timer
  useEffect(() => {
    if (!gameState.isGameStarted || gameState.isWon || isPaused) return;

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isGameStarted, gameState.isWon, isPaused]);

  // Iniciar novo jogo
  const startNewGame = useCallback(() => {
    const newGameState = createInitialGameState();
    setGameState(newGameState);
    setGameStartTime(Date.now());
    setIsPaused(false);
  }, []);

  // Pausar/retomar jogo
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Lidar com cartas do stock
  const handleStockClick = useCallback(() => {
    setGameState(prev => dealOneFromStock(prev));
  }, []);

  // Mover carta para fundação
  const moveCardToFoundation = useCallback(
    (card: Card, foundationIndex: number) => {
      setGameState(prev => moveToFoundation(prev, card, foundationIndex));
    },
    []
  );

  // Mover carta para tableau
  const moveCardToTableau = useCallback((card: Card, tableauIndex: number) => {
    setGameState(prev => moveToTableau(prev, card, tableauIndex));
  }, []);

  // Mover sequência de cartas
  const moveCardSequence = useCallback(
    (cards: Card[], fromColumnIndex: number, toColumnIndex: number) => {
      setGameState(prev =>
        moveSequence(prev, cards, fromColumnIndex, toColumnIndex)
      );
    },
    []
  );

  // Auto-completar
  const handleAutoComplete = useCallback(() => {
    if (settings.autoComplete) {
      setGameState(prev => autoComplete(prev));
    }
  }, [settings.autoComplete]);

  // Atualizar estatísticas
  const updateStats = useCallback(
    (won: boolean, moves: number, time: number) => {
      setStats(prev => {
        const newStats = {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          totalMoves: prev.totalMoves + moves,
          averageMoves: Math.round(
            (prev.totalMoves + moves) / (prev.gamesPlayed + 1)
          ),
        };

        if (won) {
          newStats.gamesWon = prev.gamesWon + 1;
          if (prev.bestTime === 0 || time < prev.bestTime) {
            newStats.bestTime = time;
          }
        }

        newStats.winRate = Math.round(
          (newStats.gamesWon / newStats.gamesPlayed) * 100
        );

        // Salvar no localStorage
        localStorage.setItem('solitaire-stats', JSON.stringify(newStats));
        return newStats;
      });
    },
    []
  );

  // Carregar estatísticas do localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('solitaire-stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading solitaire stats:', error);
      }
    }
  }, []);

  // Verificar se o jogo foi vencido
  useEffect(() => {
    if (gameState.isWon && gameStartTime) {
      const gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
      updateStats(true, gameState.moves, gameTime);
    }
  }, [gameState.isWon, gameState.moves, gameStartTime, updateStats]);

  // Verificar se há movimentos possíveis
  const hasMoves = hasPossibleMoves(gameState);

  // Obter dica
  const getHint = useCallback(() => {
    if (!settings.hints) return null;

    // Lógica para encontrar o melhor movimento
    const { foundations, tableau, wastePile } = gameState;

    // Verificar movimentos do waste para fundações
    if (wastePile.cards.length > 0) {
      const topWasteCard = wastePile.cards[wastePile.cards.length - 1];

      for (let i = 0; i < foundations.length; i++) {
        if (canPlaceOnFoundation(topWasteCard, foundations[i])) {
          return {
            type: 'waste-to-foundation',
            card: topWasteCard,
            target: i,
          };
        }
      }
    }

    // Verificar movimentos do tableau para fundações
    for (let colIndex = 0; colIndex < tableau.length; colIndex++) {
      const column = tableau[colIndex];
      if (column.cards.length > 0) {
        const topCard = column.cards[column.cards.length - 1];

        for (let i = 0; i < foundations.length; i++) {
          if (canPlaceOnFoundation(topCard, foundations[i])) {
            return {
              type: 'tableau-to-foundation',
              card: topCard,
              source: colIndex,
              target: i,
            };
          }
        }
      }
    }

    return null;
  }, [gameState, settings.hints]);

  // Resetar estatísticas
  const resetStats = useCallback(() => {
    const defaultStats: SolitaireStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      bestTime: 0,
      totalMoves: 0,
      averageMoves: 0,
      winRate: 0,
    };
    setStats(defaultStats);
    localStorage.setItem('solitaire-stats', JSON.stringify(defaultStats));
  }, []);

  // Atualizar configurações
  const updateSettings = useCallback(
    (newSettings: Partial<SolitaireSettings>) => {
      setSettings(prev => {
        const updated = { ...prev, ...newSettings };
        localStorage.setItem('solitaire-settings', JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('solitaire-settings');
    const savedConfig = localStorage.getItem('solitaire-config');

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading solitaire settings:', error);
      }
    }

    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setSettings(prev => ({
          ...prev,
          difficulty: config.difficulty,
          autoComplete: config.autoComplete,
          hints: config.hints,
          animations: config.animations,
          sound: config.sound,
        }));
      } catch (error) {
        console.error('Error loading solitaire config:', error);
      }
    }
  }, []);

  // Virar carta manualmente
  const flipCard = useCallback((columnIndex: number) => {
    setGameState(prev => {
      const newTableau = [...prev.tableau];
      const column = newTableau[columnIndex];
      if (column.cards.length > 0) {
        const lastCard = column.cards[column.cards.length - 1];
        if (!lastCard.isFaceUp) {
          // Se é a última carta da coluna, remover ela
          if (column.cards.length === 1) {
            alert(
              `Removendo última carta da coluna ${columnIndex + 1}: ${
                lastCard.rank
              } de ${lastCard.suit}`
            );
            newTableau[columnIndex] = {
              ...column,
              cards: [],
            };
          } else {
            // Virar a carta
            newTableau[columnIndex] = {
              ...column,
              cards: column.cards.map((card, index) =>
                index === column.cards.length - 1
                  ? { ...card, isFaceUp: true }
                  : card
              ),
            };
          }
        }
      }
      return {
        ...prev,
        tableau: newTableau,
      };
    });
  }, []);

  return {
    gameState,
    stats,
    settings,
    isPaused,
    hasMoves,
    startNewGame,
    togglePause,
    handleStockClick,
    moveCardToFoundation,
    moveCardToTableau,
    moveCardSequence,
    handleAutoComplete,
    getHint,
    resetStats,
    updateSettings,
    flipCard,
  };
};
