import React, { useState } from 'react';
import { Stage } from '@pixi/react';
import { Heart } from 'lucide-react';
import { MazeRenderer } from './MazeRenderer';
import { useMazeGame } from './useMazeGame';
import { STAGE_WIDTH, STAGE_HEIGHT } from './constants';

interface MazeGameProps {
  onProgress: (progress: number) => void;
}

export const MazeGame: React.FC<MazeGameProps> = ({ onProgress }) => {
  const {
    lives,
    gameState,
    trail,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    resetGame
  } = useMazeGame(onProgress);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-6 h-6 ${
                i < lives 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-300 fill-gray-300'
              }`}
            />
          ))}
        </div>
        {gameState === 'ready' && (
          <div className="text-sm text-gray-600">
            Fahre mit der Maus über START um zu beginnen
          </div>
        )}
      </div>

      <div 
        className="relative rounded-lg overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Stage 
          width={STAGE_WIDTH} 
          height={STAGE_HEIGHT}
          options={{ backgroundColor: 0x1a1a1a }}
        >
          <MazeRenderer trail={trail} gameState={gameState} />
        </Stage>
      </div>

      {gameState === 'won' && (
        <div className="mt-4 text-center">
          <div className="p-4 bg-green-100 text-green-700 rounded-lg mb-4">
            <p className="text-lg font-bold">Success! 🎉</p>
            <p>You successfully navigated the maze!</p>
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Nochmal spielen
          </button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="mt-4 text-center">
          <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
            <p className="text-lg font-bold">Game Over!</p>
            <p>Du hast leider zu oft die Wände berührt.</p>
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Nochmal versuchen
          </button>
        </div>
      )}
    </div>
  );
};
