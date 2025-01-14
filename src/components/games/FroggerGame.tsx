import React, { useState, useEffect, useCallback } from 'react';
import { FroggerGameState, Car } from '../../store/types';
import { Heart, Star } from 'lucide-react';

interface FroggerGameProps {
  onProgress: (progress: number) => void;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const FROG_SIZE = 30;
const CAR_WIDTH = 60;
const CAR_HEIGHT = 30;
const LANE_HEIGHT = 40;
const INITIAL_LIVES = 3;
const BASE_SPEED = 0.5; // Reduzierte Grundgeschwindigkeit
const SPEED_INCREMENT = 0.15; // Geschwindigkeitszunahme pro Level

export const FroggerGame: React.FC<FroggerGameProps> = ({ onProgress }) => {
  const [gameState, setGameState] = useState<FroggerGameState>({
    frogX: GAME_WIDTH / 2 - FROG_SIZE / 2,
    frogY: GAME_HEIGHT - FROG_SIZE,
    cars: [],
    score: 0,
    lives: INITIAL_LIVES,
    gameOver: false
  });

  /**
   * Reset the frog's position to the starting point
   */
  const resetFrog = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      frogX: GAME_WIDTH / 2 - FROG_SIZE / 2,
      frogY: GAME_HEIGHT - FROG_SIZE
    }));
  }, []);

  const getSpeedForLane = useCallback((lane: number, score: number) => {
    // Basisgeschwindigkeit + (Level-Bonus * Spurbonus)
    const levelBonus = score * SPEED_INCREMENT;
    const laneBonus = (lane + 1) * 0.1; // Äußere Spuren sind etwas schneller
    return BASE_SPEED + levelBonus + laneBonus;
  }, []);

  const initializeCars = useCallback((currentScore: number = 0) => {
    const lanes = 5;
    const carsPerLane = 3;
    const newCars: Car[] = [];

    for (let lane = 0; lane < lanes; lane++) {
      const y = (lane + 1) * LANE_HEIGHT;
      const direction = lane % 2 === 0 ? 'left' : 'right';
      const speed = getSpeedForLane(lane, currentScore);

      for (let i = 0; i < carsPerLane; i++) {
        newCars.push({
          x: (GAME_WIDTH / carsPerLane) * i,
          y,
          speed,
          direction
        });
      }
    }

    return newCars;
  }, [getSpeedForLane]);

  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      cars: initializeCars()
    }));
  }, [initializeCars]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;

      setGameState(prev => {
        let newX = prev.frogX;
        let newY = prev.frogY;

        switch (e.key) {
          case 'ArrowUp':
            newY = Math.max(0, prev.frogY - FROG_SIZE);
            break;
          case 'ArrowDown':
            newY = Math.min(GAME_HEIGHT - FROG_SIZE, prev.frogY + FROG_SIZE);
            break;
          case 'ArrowLeft':
            newX = Math.max(0, prev.frogX - FROG_SIZE);
            break;
          case 'ArrowRight':
            newX = Math.min(GAME_WIDTH - FROG_SIZE, prev.frogX + FROG_SIZE);
            break;
          default:
            return prev;
        }

        return {
          ...prev,
          frogX: newX,
          frogY: newY
        };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (gameState.gameOver) return;

      setGameState(prev => {
        // Move cars
        const newCars = prev.cars.map(car => {
          let newX = car.x;
          if (car.direction === 'left') {
            newX -= car.speed;
            if (newX + CAR_WIDTH < 0) newX = GAME_WIDTH;
          } else {
            newX += car.speed;
            if (newX > GAME_WIDTH) newX = -CAR_WIDTH;
          }
          return { ...car, x: newX };
        });

        // Check collisions
        const collision = newCars.some(car => {
          return (
            prev.frogX < car.x + CAR_WIDTH &&
            prev.frogX + FROG_SIZE > car.x &&
            prev.frogY < car.y + CAR_HEIGHT &&
            prev.frogY + FROG_SIZE > car.y
          );
        });

        if (collision) {
          const newLives = prev.lives - 1;
          if (newLives === 0) {
            return { ...prev, cars: newCars, gameOver: true };
          }
          resetFrog();
          return { ...prev, cars: newCars, lives: newLives };
        }

        // Check if frog reached the top
        if (prev.frogY === 0) {
          const newScore = prev.score + 1;
          onProgress(Math.min((newScore / 5) * 100, 100));
          resetFrog();
          // Initialisiere neue Autos mit erhöhter Geschwindigkeit
          const newCarsWithIncreasedSpeed = initializeCars(newScore);
          return { 
            ...prev, 
            cars: newCarsWithIncreasedSpeed, 
            score: newScore 
          };
        }

        return { ...prev, cars: newCars };
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState.gameOver, resetFrog, onProgress, initializeCars]);

  const restartGame = () => {
    setGameState({
      frogX: GAME_WIDTH / 2 - FROG_SIZE / 2,
      frogY: GAME_HEIGHT - FROG_SIZE,
      cars: initializeCars(0),
      score: 0,
      lives: INITIAL_LIVES,
      gameOver: false
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="font-bold">{gameState.lives}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold">{gameState.score}</span>
        </div>
      </div>

      <div 
        className="relative bg-gray-800 rounded-lg overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Road markings */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-10 border-t-2 border-b-2 border-dashed border-yellow-400"
            style={{ top: (i + 1) * LANE_HEIGHT }}
          />
        ))}

        {/* Cars */}
        {gameState.cars.map((car, index) => (
          <div
            key={index}
            className="absolute bg-red-500 rounded"
            style={{
              width: CAR_WIDTH,
              height: CAR_HEIGHT,
              left: car.x,
              top: car.y,
              transform: car.direction === 'left' ? 'scaleX(-1)' : ''
            }}
          />
        ))}

        {/* Frog */}
        <div
          className="absolute bg-green-500 rounded-full"
          style={{
            width: FROG_SIZE,
            height: FROG_SIZE,
            left: gameState.frogX,
            top: gameState.frogY
          }}
        />
      </div>

      {gameState.gameOver && (
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold text-purple-600 mb-4">Game Over!</h3>
          <p className="text-lg mb-4">You scored {gameState.score} points!</p>
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Nochmal spielen
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-600">
        Benutze die Pfeiltasten ⬆️ ⬇️ ⬅️ ➡️ um den Frosch zu steuern
      </div>
    </div>
  );
};
