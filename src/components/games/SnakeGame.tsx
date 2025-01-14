import React, { useCallback, useEffect, useState } from 'react';
import { Stage, Container, Graphics, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import { SnakeGameState, SnakeSegment } from '../../store/types';
import { Star } from 'lucide-react';

interface SnakeGameProps {
  onProgress: (progress: number) => void;
}

const CELL_SIZE = 20;
const GRID_WIDTH = 30;
const GRID_HEIGHT = 20;
const GAME_WIDTH = CELL_SIZE * GRID_WIDTH;
const GAME_HEIGHT = CELL_SIZE * GRID_HEIGHT;
const INITIAL_SPEED = 150;
const SPEED_INCREASE = 10;

/**
 * Draw a segment of the snake with a neon effect
 */
const drawSnakeSegment = (g: any) => {
  g.clear();
  g.beginFill(0x00ff00);
  g.drawRoundedRect(0, 0, CELL_SIZE - 2, CELL_SIZE - 2, 5);
  g.endFill();
  
  // Neon-Effekt
  g.lineStyle(2, 0x00ff00, 0.5);
  g.drawRoundedRect(-2, -2, CELL_SIZE + 2, CELL_SIZE + 2, 6);
};

const drawFood = (g: any) => {
  g.clear();
  g.beginFill(0xff0000);
  g.drawCircle(CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 2 - 2);
  g.endFill();
  
  // Pulsierender Neon-Effekt
  const time = Date.now() / 500;
  const alpha = 0.3 + Math.sin(time) * 0.2;
  g.lineStyle(2, 0xff0000, alpha);
  g.drawCircle(CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 2);
};

const drawGrid = (g: any) => {
  g.clear();
  g.lineStyle(1, 0x333333, 0.3);
  
  // Vertikale Linien
  for (let x = 0; x <= GRID_WIDTH; x++) {
    g.moveTo(x * CELL_SIZE, 0);
    g.lineTo(x * CELL_SIZE, GAME_HEIGHT);
  }
  
  // Horizontale Linien
  for (let y = 0; y <= GRID_HEIGHT; y++) {
    g.moveTo(0, y * CELL_SIZE);
    g.lineTo(GAME_WIDTH, y * CELL_SIZE);
  }
};

const getRandomPosition = (): SnakeSegment => ({
  x: Math.floor(Math.random() * GRID_WIDTH),
  y: Math.floor(Math.random() * GRID_HEIGHT)
});

export const SnakeGame: React.FC<SnakeGameProps> = ({ onProgress }) => {
  const [gameState, setGameState] = useState<SnakeGameState>({
    snake: [
      { x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }
    ],
    food: getRandomPosition(),
    direction: '',
    score: 0,
    gameOver: false,
    level: 1
  });

  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameStarted, setGameStarted] = useState(false);

  const moveSnake = useCallback(() => {
    if (gameState.gameOver || !gameStarted) return;

    setGameState(prev => {
      const head = { ...prev.snake[0] };
      
      switch (prev.direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
      }

      // Kollision mit Wänden
      if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        return { ...prev, gameOver: true };
      }

      // Kollision mit sich selbst
      if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, gameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      
      // Prüfe ob Futter gefressen wurde
      if (head.x === prev.food.x && head.y === prev.food.y) {
        const newScore = prev.score + 1;
        const newLevel = Math.floor(newScore / 5) + 1;
        
        // Aktualisiere Fortschritt
        onProgress(Math.min((newScore / 20) * 100, 100));
        
        // Erhöhe Geschwindigkeit
        if (newLevel > prev.level) {
          setSpeed(current => Math.max(current - SPEED_INCREASE, 50));
        }

        return {
          ...prev,
          snake: newSnake,
          food: getRandomPosition(),
          score: newScore,
          level: newLevel
        };
      }

      // Entferne das letzte Segment, wenn kein Futter gefressen wurde
      newSnake.pop();

      return { ...prev, snake: newSnake };
    });
  }, [gameState.gameOver, gameStarted, onProgress]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;

      const newDirection = (() => {
        switch (e.key) {
          case 'ArrowUp': return 'up';
          case 'ArrowDown': return 'down';
          case 'ArrowLeft': return 'left';
          case 'ArrowRight': return 'right';
          default: return null;
        }
      })();

      if (!newDirection) return;

      // Verhindere Richtungswechsel um 180 Grad
      const isOppositeDirection = (
        (newDirection === 'up' && gameState.direction === 'down') ||
        (newDirection === 'down' && gameState.direction === 'up') ||
        (newDirection === 'left' && gameState.direction === 'right') ||
        (newDirection === 'right' && gameState.direction === 'left')
      );

      if (!isOppositeDirection) {
        setGameState(prev => ({ ...prev, direction: newDirection }));
        
        // Starte das Spiel beim ersten Tastendruck
        if (!gameStarted) {
          setGameStarted(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, gameState.direction, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed, gameStarted]);

  const restartGame = () => {
    setGameState({
      snake: [{ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }],
      food: getRandomPosition(),
      direction: '',
      score: 0,
      gameOver: false,
      level: 1
    });
    setSpeed(INITIAL_SPEED);
    setGameStarted(false);
  };

  const scoreStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: ['#ffffff'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold">{gameState.score}</span>
        </div>
        <div className="text-purple-600 font-bold">
          Level {gameState.level}
        </div>
      </div>

      <Stage width={GAME_WIDTH} height={GAME_HEIGHT} options={{ backgroundColor: 0x000000 }}>
        <Container>
          <Graphics draw={drawGrid} />
          
          {gameState.snake.map((segment, index) => (
            <Graphics
              key={index}
              draw={drawSnakeSegment}
              x={segment.x * CELL_SIZE}
              y={segment.y * CELL_SIZE}
            />
          ))}
          
          <Graphics
            draw={drawFood}
            x={gameState.food.x * CELL_SIZE}
            y={gameState.food.y * CELL_SIZE}
          />

          {!gameStarted && !gameState.gameOver && (
            <Text
              text="Drücke eine Pfeiltaste zum Starten"
              anchor={0.5}
              x={GAME_WIDTH / 2}
              y={GAME_HEIGHT / 2}
              style={scoreStyle}
            />
          )}

          {gameState.gameOver && (
            <Text
              text="Game Over!"
              anchor={0.5}
              x={GAME_WIDTH / 2}
              y={GAME_HEIGHT / 2}
              style={scoreStyle}
            />
          )}
        </Container>
      </Stage>

      {gameState.gameOver && (
        <div className="mt-6 text-center">
          <p className="text-lg mb-4">Score: {gameState.score}</p>
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Nochmal spielen
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-600">
        Benutze die Pfeiltasten ⬆️ ⬇️ ⬅️ ➡️ um die Schlange zu steuern
      </div>
    </div>
  );
};
