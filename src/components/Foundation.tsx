import React from 'react';
import { Foundation as FoundationType, Card } from '../types/solitaire';
import CardComponent from './Card';
import { getCardSymbol } from '../utils/cardUtils';

interface FoundationProps {
  foundation: FoundationType;
  onCardClick?: (card: Card) => void;
  onCardDoubleClick?: (card: Card) => void;
  onDrop?: (card: Card) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  className?: string;
}

const Foundation: React.FC<FoundationProps> = ({
  foundation,
  onCardClick,
  onCardDoubleClick,
  onDrop,
  onDragOver,
  onDragLeave,
  className = '',
}) => {
  const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };

  const suitColors = {
    hearts: 'text-red-600',
    diamonds: 'text-red-600',
    clubs: 'text-black',
    spades: 'text-black',
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDrop) {
      const cardData = e.dataTransfer.getData('application/json');
      try {
        const card = JSON.parse(cardData);
        onDrop(card);
      } catch (error) {
        console.error('Error parsing dropped card:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    onDragLeave?.(e);
  };

  return (
    <div
      className={`
        w-16 h-20 sm:w-18 sm:h-24 md:w-20 md:h-28
        bg-green-900 rounded-lg
        flex items-center justify-center
        transition-all duration-200
        hover:bg-green-800
        ${className}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      role="button"
      tabIndex={0}
      aria-label={`Foundation for ${foundation.suit}`}
    >
      {foundation.cards.length > 0 ? (
        <CardComponent
          card={foundation.cards[foundation.cards.length - 1]}
          onClick={() =>
            onCardClick?.(foundation.cards[foundation.cards.length - 1])
          }
          onDoubleClick={() =>
            onCardDoubleClick?.(foundation.cards[foundation.cards.length - 1])
          }
          onDragStart={e => {
            e.dataTransfer.setData(
              'application/json',
              JSON.stringify(foundation.cards[foundation.cards.length - 1])
            );
            e.dataTransfer.effectAllowed = 'move';
          }}
          onDragEnd={e => {
            // Limpar seleção se necessário
          }}
          className="w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center">
          <div className={`text-3xl ${suitColors[foundation.suit]}`}>
            {suitSymbols[foundation.suit]}
          </div>
        </div>
      )}
    </div>
  );
};

export default Foundation;
