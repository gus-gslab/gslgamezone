import { useState, useCallback } from 'react';
import { Card as CardType } from '../types/solitaire';

interface DragState {
  isDragging: boolean;
  draggedCard: CardType | null;
  draggedCards: CardType[];
  sourceType: 'foundation' | 'tableau' | 'waste' | null;
  sourceIndex: number;
  sourceCardIndex: number;
}

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedCard: null,
    draggedCards: [],
    sourceType: null,
    sourceIndex: -1,
    sourceCardIndex: -1,
  });

  // Iniciar drag
  const startDrag = useCallback((
    card: CardType,
    cards: CardType[],
    sourceType: 'foundation' | 'tableau' | 'waste',
    sourceIndex: number,
    cardIndex: number
  ) => {
    setDragState({
      isDragging: true,
      draggedCard: card,
      draggedCards: cards,
      sourceType,
      sourceIndex,
      sourceCardIndex: cardIndex,
    });
  }, []);

  // Finalizar drag
  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedCard: null,
      draggedCards: [],
      sourceType: null,
      sourceIndex: -1,
      sourceCardIndex: -1,
    });
  }, []);

  // Verificar se pode fazer drop
  const canDrop = useCallback((
    targetType: 'foundation' | 'tableau',
    targetIndex: number,
    targetColumn?: any
  ) => {
    if (!dragState.draggedCard || !dragState.draggedCards.length) return false;

    const card = dragState.draggedCard;
    const cards = dragState.draggedCards;

    if (targetType === 'foundation') {
      // Para fundação, só pode colocar uma carta por vez
      if (cards.length > 1) return false;
      
      // Verificar se é o naipe correto e sequência
      // Esta lógica será implementada no componente
      return true;
    } else if (targetType === 'tableau') {
      // Para tableau, pode colocar sequência de cartas
      if (targetColumn) {
        // Verificar se a sequência é válida
        // Esta lógica será implementada no componente
        return true;
      }
    }

    return false;
  }, [dragState]);

  return {
    dragState,
    startDrag,
    endDrag,
    canDrop,
  };
};


