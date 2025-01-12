import { useState, useCallback, useRef } from 'react';
import { GameState, Point } from './types';
import { checkCollision } from './utils';
import { STAGE_WIDTH, STAGE_HEIGHT } from './constants';
import { useMazeWalls } from './useMazeWalls';

export const useMazeGame = (onProgress: (progress: number) => void) => {
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [trail, setTrail] = useState<Point[]>([]);
  const walls = useMazeWalls();
  const lastPoint = useRef<Point | null>(null);

  /**
   * Reset the game state to initial values
   */
  /**
   * Reset the game state to initial values
   */
  const resetGame = useCallback(() => {
    setLives(3);
    setGameState('ready');
    setTrail([]);
    lastPoint.current = null;
  }, []);

  const handleCollision = useCallback(() => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives === 0) {
        setGameState('lost');
        onProgress(25);
      }
      return newLives;
    });
    setTrail([]);
    lastPoint.current = null;
    setGameState('ready');
  }, [onProgress]);

  const checkWin = useCallback((x: number, y: number) => {
    if (x >= 550 && y >= 200 && y <= 300) {
      setGameState('won');
      onProgress(100);
    }
  }, [onProgress]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (gameState !== 'playing') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastPoint.current) {
      if (checkCollision(lastPoint.current, { x, y }, walls)) {
        handleCollision();
        return;
      }
    }

    lastPoint.current = { x, y };
    setTrail(prev => [...prev, { x, y }]);
    checkWin(x, y);
  }, [gameState, walls, handleCollision, checkWin]);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x <= 50 && y >= 200 && y <= 300) {
      setGameState('playing');
      setTrail([{ x, y }]);
      lastPoint.current = { x, y };
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (gameState === 'playing') {
      handleCollision();
    }
  }, [gameState, handleCollision]);

  return {
    lives,
    gameState,
    trail,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    resetGame
  };
};
