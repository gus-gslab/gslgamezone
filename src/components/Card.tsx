import React from 'react';
import { Card as CardType } from '../types/solitaire';
import {
  getCardColor,
  getCardSymbol,
  getCardAccessibilityText,
} from '../utils/cardUtils';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isDraggable?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDrag?: (e: React.DragEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  card,
  isSelected = false,
  isDraggable = true,
  onClick,
  onDoubleClick,
  onDragStart,
  onDragEnd,
  onDrag,
  className = '',
  style,
}) => {
  const cardColor = getCardColor(card);
  const cardSymbol = getCardSymbol(card);
  const accessibilityText = getCardAccessibilityText(card);

  if (!card.isFaceUp) {
    return (
      <div
        className={`
          w-16 h-20 sm:w-18 sm:h-24 md:w-20 md:h-28
          bg-gradient-to-br from-blue-600 to-blue-800
          rounded-lg shadow-lg border-2 border-blue-700
          flex items-center justify-center
          cursor-pointer transition-all duration-200
          hover:shadow-xl hover:scale-105
          ${isSelected ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
          ${className}
        `}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        style={style}
        role="button"
        tabIndex={0}
        aria-label="Hidden card"
        draggable={false}
      >
        <div className="text-white text-xs font-bold">🂠</div>
      </div>
    );
  }

  return (
    <div
      className={`
          w-16 h-20 sm:w-18 sm:h-24 md:w-20 md:h-28
          bg-white rounded-lg shadow-lg border-2 border-gray-300
          flex flex-col items-center justify-center relative
          cursor-pointer transition-all duration-200
          hover:shadow-xl hover:scale-105 hover:-translate-y-2
          ${isSelected ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
          ${className}
        `}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrag={onDrag}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={accessibilityText}
      draggable={isDraggable}
    >
      {/* Rank e símbolo no canto superior esquerdo */}
      <div className={`absolute top-1 left-1 text-xs font-bold ${cardColor}`}>
        <div className="text-sm font-bold">{card.rank}</div>
        <div className="text-xs">{cardSymbol}</div>
      </div>

      {/* Símbolo central */}
      <div className={`text-3xl sm:text-4xl md:text-5xl ${cardColor}`}>
        {cardSymbol}
      </div>

      {/* Rank e símbolo no canto inferior direito (invertido) */}
      <div
        className={`absolute bottom-1 right-1 text-xs font-bold ${cardColor} transform rotate-180`}
      >
        <div className="text-sm font-bold">{card.rank}</div>
        <div className="text-xs">{cardSymbol}</div>
      </div>
    </div>
  );
};

export default Card;
