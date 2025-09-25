import React from 'react';
import { TableauColumn, Card } from '../types/solitaire';
import CardComponent from './Card';

interface TableauProps {
  column: TableauColumn;
  columnIndex: number;
  onCardClick?: (card: Card, columnIndex: number, cardIndex: number) => void;
  onCardDoubleClick?: (
    card: Card,
    columnIndex: number,
    cardIndex: number
  ) => void;
  onDrop?: (card: Card, columnIndex: number, sequence?: Card[]) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onFlipCard?: (columnIndex: number) => void;
  className?: string;
}

const Tableau: React.FC<TableauProps> = ({
  column,
  columnIndex,
  onCardClick,
  onCardDoubleClick,
  onDrop,
  onFlipCard,
  className = '',
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDrop) {
      const cardData = e.dataTransfer.getData('application/json');
      const sequenceData = e.dataTransfer.getData('application/sequence');
      try {
        const card = JSON.parse(cardData);
        const sequence = sequenceData ? JSON.parse(sequenceData) : undefined;
        onDrop(card, columnIndex, sequence);
      } catch (error) {
        console.error('Error parsing dropped card:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={`
        min-h-24 sm:min-h-28 md:min-h-32
        w-16 sm:w-18 md:w-20
        flex flex-col items-center
        ${className}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      role="button"
      tabIndex={0}
      aria-label={`Tableau column ${columnIndex + 1}`}
    >
      {/* Cartas ocultas */}
      {column.hiddenCount > 0 && (
        <div className="relative">
          {Array.from({ length: column.hiddenCount }, (_, index) => (
            <div
              key={`hidden-${index}`}
              className="absolute"
              style={{ top: `${index * 20}px` }}
            >
              <CardComponent
                card={{
                  suit: 'hearts',
                  rank: 'A',
                  value: 1,
                  color: 'red',
                  isFaceUp: false,
                  id: `hidden-${columnIndex}-${index}`,
                }}
                className="w-16 h-20 sm:w-18 sm:h-24 md:w-20 md:h-28"
              />
            </div>
          ))}
        </div>
      )}

      {/* Cartas visíveis empilhadas */}
      <div className="relative">
        {column.cards.map((card, cardIndex) => (
          <div
            key={card.id}
            className="absolute"
            style={{
              top: `${(column.hiddenCount + cardIndex) * 20}px`,
              zIndex: cardIndex + 1,
            }}
          >
            <CardComponent
              card={card}
              onClick={() => onCardClick?.(card, columnIndex, cardIndex)}
              onDoubleClick={() => {
                console.log(
                  'Duplo clique detectado:',
                  card,
                  'coluna:',
                  columnIndex,
                  'cardIndex:',
                  cardIndex
                );
                // Se é a última carta da coluna e está fechada, virar
                if (cardIndex === column.cards.length - 1 && !card.isFaceUp) {
                  console.log(
                    'Tentando virar carta:',
                    card,
                    'coluna:',
                    columnIndex
                  );
                  onFlipCard?.(columnIndex);
                } else {
                  console.log('Executando ação normal do duplo clique');
                  onCardDoubleClick?.(card, columnIndex, cardIndex);
                }
              }}
              onDragStart={e => {
                e.dataTransfer.setData(
                  'application/json',
                  JSON.stringify(card)
                );
                // Incluir sequência de cartas a partir da carta selecionada
                const sequence = column.cards.slice(cardIndex);
                e.dataTransfer.setData(
                  'application/sequence',
                  JSON.stringify(sequence)
                );
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragEnd={e => {
                // Limpar seleção se necessário
              }}
              className="w-16 h-20 sm:w-18 sm:h-24 md:w-20 md:h-28 hover:z-50 transition-all duration-200 hover:shadow-2xl"
            />
          </div>
        ))}
      </div>

      {/* Área de drop vazia */}
      {column.cards.length === 0 && (
        <div className="w-16 h-20 sm:w-18 sm:h-24 md:w-20 md:h-28 bg-green-900 rounded-lg flex items-center justify-center border-2 border-dashed border-green-400">
          <div className="text-green-200 text-xs">Drop here</div>
        </div>
      )}
    </div>
  );
};

export default Tableau;
