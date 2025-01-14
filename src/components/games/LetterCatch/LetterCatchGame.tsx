import React, { useEffect } from 'react';
import { Stage, Container } from '@pixi/react';
import { Star } from 'lucide-react';
import { GAME_WIDTH, GAME_HEIGHT, PADDLE_WIDTH, COLORS } from './constants';
import { Paddle } from './components/Paddle';
import { FallingItems } from './components/FallingItems';
import { useGameLogic } from './hooks/useGameLogic';

interface LetterCatchGameProps {
  onProgress: (progress: number) => void;
}

export const LetterCatchGame: React.FC<LetterCatchGameProps> = ({ onProgress }) => {
  const {
    gameState,
    items,
    paddleX,
    setPaddleX,
    updateGame,
    resetGame,
    animationFrameRef
  } = useGameLogic(onProgress);

  /**
   * Handle mouse movement to update paddle position
   */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newX = Math.max(0, Math.min(x - PADDLE_WIDTH / 2, GAME_WIDTH - PADDLE_WIDTH));
      setPaddleX(newX);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setPaddleX]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateGame, animationFrameRef]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 px-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold">{gameState.score}</span>
        </div>
        <div className="text-red-500 font-bold">
          Missed: {gameState.misses}/3
        </div>
      </div>

      {/* Game Area */}
      <div className="relative flex-1 flex items-center justify-center bg-gray-100 rounded-lg">
        <Stage 
          width={GAME_WIDTH} 
          height={GAME_HEIGHT} 
          options={{ backgroundColor: COLORS.BACKGROUND }}
        >
          <Container>
            <Paddle x={paddleX} />
            <FallingItems items={items} />
          </Container>
        </Stage>

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold text-purple-600 mb-2">Spiel vorbei!</h3>
              <p className="mb-4">Deine Punktzahl: {gameState.score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Nochmal spielen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 mt-2 px-4">
        Fange die weißen Buchstaben, aber vermeide die roten Zahlen!
      </div>
    </div>
  );
};
