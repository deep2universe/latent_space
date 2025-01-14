import React, { useState, useEffect, useRef } from 'react';
import { Stage, Container, Graphics, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import { Star } from 'lucide-react';

interface LetterCatchGameProps {
  onProgress: (progress: number) => void;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const ITEM_SIZE = 40;
const SPAWN_INTERVAL = 1000;
const FALL_SPEED = 3;

/**
 * Style for falling letters/numbers
 * Uses different colors for numbers and letters
 */
/**
 * Style for falling letters/numbers
 * Adjusts color based on whether the item is a number
 */
const createFallingStyle = (isNumber: boolean) => new TextStyle({
  fontFamily: 'Arial',
  dropShadow: {
    alpha: 0.8,
    angle: 2.1,
    blur: 4,
    color: 0x111111,
    distance: 10,
  },
  fill: isNumber ? 0xff0000 : 0xffffff,
  stroke: {
    color: 0x004620,
    width: 12,
    join: 'round'
  },
  fontSize: 40,
  fontWeight: 'lighter',
});

interface FallingItem {
  x: number;
  y: number;
  value: string;
  isNumber: boolean;
}

export const LetterCatchGame: React.FC<LetterCatchGameProps> = ({ onProgress }) => {
  const [paddleX, setPaddleX] = useState(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [misses, setMisses] = useState(0);
  const animationFrameRef = useRef<number>();
  const lastSpawnRef = useRef(0);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  const spawnItem = () => {
    const isNumber = Math.random() < 0.3; // 30% Chance für eine Zahl
    const value = isNumber 
      ? numbers[Math.floor(Math.random() * numbers.length)]
      : letters[Math.floor(Math.random() * letters.length)];

    return {
      x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
      y: -ITEM_SIZE,
      value,
      isNumber
    };
  };

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
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = (timestamp: number) => {
      // Spawn new items
      if (timestamp - lastSpawnRef.current > SPAWN_INTERVAL) {
        setItems(prev => [...prev, spawnItem()]);
        lastSpawnRef.current = timestamp;
      }

      // Update items positions and check collisions
      setItems(prev => {
        const newItems = prev.map(item => ({
          ...item,
          y: item.y + FALL_SPEED
        })).filter(item => {
          // Check if item is caught by paddle
          if (item.y + ITEM_SIZE > GAME_HEIGHT - PADDLE_HEIGHT && 
              item.y < GAME_HEIGHT &&
              item.x + ITEM_SIZE > paddleX && 
              item.x < paddleX + PADDLE_WIDTH) {
            
            if (!item.isNumber) {
              setScore(s => s + 10);
              onProgress(Math.min((score + 10) / 200 * 100, 100));
            } else {
              setScore(s => Math.max(0, s - 20));
            }
            return false;
          }

          // Check if item is missed
          if (item.y > GAME_HEIGHT) {
            if (!item.isNumber) {
              setMisses(m => {
                const newMisses = m + 1;
                if (newMisses >= 3) setGameOver(true);
                return newMisses;
              });
            }
            return false;
          }

          return true;
        });

        return newItems;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameOver, paddleX, score, onProgress]);

  const resetGame = () => {
    setScore(0);
    setMisses(0);
    setItems([]);
    setGameOver(false);
    lastSpawnRef.current = 0;
  };

  const drawPaddle = (g: any) => {
    g.clear();
    g.beginFill(0x00ff00);
    g.drawRect(paddleX, GAME_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    g.endFill();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold">{score}</span>
        </div>
        <div className="text-red-500 font-bold">
          Missed: {misses}/3
        </div>
      </div>

      <Stage width={GAME_WIDTH} height={GAME_HEIGHT} options={{ backgroundColor: 0x1099bb }}>
        <Container>
          <Graphics draw={drawPaddle} />
          {items.map((item, index) => (
            <Text
              key={index}
              text={item.value}
              x={item.x}
              y={item.y}
              style={createFallingStyle(item.isNumber)}
            />
          ))}
        </Container>
      </Stage>

      {gameOver && (
        <div className="mt-4 text-center">
          <div className="p-4 bg-purple-100 rounded-lg mb-4">
            <h3 className="text-xl font-bold text-purple-600 mb-2">Spiel vorbei!</h3>
            <p>Deine Punktzahl: {score}</p>
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Nochmal spielen
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-600">
        Fange die weißen Buchstaben, aber vermeide die roten Zahlen!
      </div>
    </div>
  );
};
