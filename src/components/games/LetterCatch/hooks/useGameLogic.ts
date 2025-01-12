import { useState, useRef, useCallback } from 'react';
import { FallingItem, GameState } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, ITEM_SIZE, SPAWN_INTERVAL, FALL_SPEED } from '../constants';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';

export const useGameLogic = (onProgress: (progress: number) => void) => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    misses: 0,
    gameOver: false
  });
  const [items, setItems] = useState<FallingItem[]>([]);
  const [paddleX, setPaddleX] = useState(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
  
  const animationFrameRef = useRef<number>();
  const lastSpawnRef = useRef(0);

  /**
   * Spawn a new falling item (letter or number)
   */
  const spawnItem = useCallback((): FallingItem => {
    const isNumber = Math.random() < 0.3;
    const chars = isNumber ? NUMBERS : LETTERS;
    const value = chars[Math.floor(Math.random() * chars.length)];

    return {
      x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
      y: -ITEM_SIZE,
      value,
      isNumber
    };
  }, []);

  const updateGame = useCallback((timestamp: number) => {
    if (gameState.gameOver) return;

    if (timestamp - lastSpawnRef.current > SPAWN_INTERVAL) {
      setItems(prev => [...prev, spawnItem()]);
      lastSpawnRef.current = timestamp;
    }

    setItems(prev => {
      return prev.map(item => ({
        ...item,
        y: item.y + FALL_SPEED
      })).filter(item => {
        if (item.y + ITEM_SIZE > GAME_HEIGHT - PADDLE_HEIGHT && 
            item.y < GAME_HEIGHT &&
            item.x + ITEM_SIZE > paddleX && 
            item.x < paddleX + PADDLE_WIDTH) {
          
          if (!item.isNumber) {
            setGameState(prev => {
              const newScore = prev.score + 10;
              onProgress(Math.min((newScore) / 200 * 100, 100));
              return { ...prev, score: newScore };
            });
          } else {
            setGameState(prev => ({
              ...prev,
              score: Math.max(0, prev.score - 20)
            }));
          }
          return false;
        }

        if (item.y > GAME_HEIGHT) {
          if (!item.isNumber) {
            setGameState(prev => {
              const newMisses = prev.misses + 1;
              return {
                ...prev,
                misses: newMisses,
                gameOver: newMisses >= 3
              };
            });
          }
          return false;
        }

        return true;
      });
    });

    animationFrameRef.current = requestAnimationFrame(updateGame);
  }, [gameState.gameOver, paddleX, spawnItem, onProgress]);

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      misses: 0,
      gameOver: false
    });
    setItems([]);
    lastSpawnRef.current = 0;
  }, []);

  return {
    gameState,
    items,
    paddleX,
    setPaddleX,
    updateGame,
    resetGame,
    animationFrameRef
  };
};
