import React, { useState, useEffect } from 'react';
import { MemoryCard } from '../../data/memoryCards';
import { fetchMemoryCards } from '../../services/memoryCardService';
import { Sparkles, Star } from 'lucide-react';

interface MemoryGameCard extends MemoryCard {
  isFlipped: boolean;
  isMatched: boolean;
}

interface ElephantMemoryGameProps {
  onProgress: (progress: number) => void;
}

export const ElephantMemoryGame: React.FC<ElephantMemoryGameProps> = ({ onProgress }) => {
  const [cards, setCards] = useState<MemoryGameCard[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  // Effect to update progress based on matches and moves
  useEffect(() => {
    if (matches > 0) {
      onProgress(calculateProgress());
    }
  }, [matches, moves, onProgress]);

  const initializeGame = async () => {
    try {
      const fetchedCards = await fetchMemoryCards();
      const cardPairs = [...fetchedCards, ...fetchedCards]
        .map((card, index) => ({
          ...card,
          id: index,
          isFlipped: false,
          isMatched: false
        }))
        .sort(() => Math.random() - 0.5);

      setCards(cardPairs);
      setFlippedIndexes([]);
      setMoves(0);
      setMatches(0);
      setIsGameOver(false);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      alert('Failed to start the game. Please try again later.');
    }
  };

  const calculateProgress = () => {
    const totalPairs = cards.length / 2;
    const minMoves = totalPairs;
    const maxMoves = totalPairs * 3;
    
    const moveScore = Math.max(0, 100 - ((moves - minMoves) / (maxMoves - minMoves)) * 100);
    const matchProgress = (matches / totalPairs) * 100;
    
    return (moveScore * 0.6) + (matchProgress * 0.4);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndexes.length === 2 || cards[index].isMatched || flippedIndexes.includes(index)) {
      return;
    }

    const newFlippedIndexes = [...flippedIndexes, index];
    setFlippedIndexes(newFlippedIndexes);

    if (newFlippedIndexes.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndexes;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.name === secondCard.name) {
        setCards(prev => prev.map((card, i) => 
          i === firstIndex || i === secondIndex
            ? { ...card, isMatched: true }
            : card
        ));
        setMatches(prev => {
          const newMatches = prev + 1;
          if (newMatches === cards.length / 2) {
            setIsGameOver(true);
          }
          return newMatches;
        });
        setFlippedIndexes([]);
      } else {
        setTimeout(() => {
          setFlippedIndexes([]);
        }, 1000);
      }
    }
  };

  const getStarRating = () => {
    const progress = calculateProgress();
    if (progress >= 80) return 3;
    if (progress >= 60) return 2;
    return 1;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-purple-600 font-semibold">
          Züge: {moves}
        </div>
        <div className="text-purple-600 font-semibold">
          Paare gefunden: {matches} von {elephantMemoryCards.length}
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="aspect-square relative cursor-pointer"
            onClick={() => handleCardClick(index)}
          >
            <div className={`w-full h-full transition-all duration-500 transform-style-preserve-3d ${
              card.isMatched || flippedIndexes.includes(index) ? 'rotate-y-180' : ''
            }`}>
              <div className="absolute w-full h-full bg-purple-500 rounded-xl flex items-center justify-center backface-hidden">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="absolute w-full h-full rounded-xl overflow-hidden backface-hidden rotate-y-180">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isGameOver && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 text-center max-w-md mx-4">
            <h3 className="text-2xl font-bold text-purple-600 mb-4">
              Fantastisch gemacht! 🎉
            </h3>
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(getStarRating())].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 mb-6">
              Du hast alle {cards.length / 2} Paare in {moves} Zügen gefunden!
            </p>
            <button
              onClick={initializeGame}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Nochmal spielen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
