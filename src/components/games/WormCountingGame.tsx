import React, { useState, useEffect, useRef } from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import { Application, Rectangle } from 'pixi.js';
import { Check, RotateCcw } from 'lucide-react';

interface WormCountingGameProps {
  onProgress: (progress: number) => void;
}

/**
 * Predefined colors for the worms
 */
const WORM_COLORS = [
  0xFF0000, // Red
  0x00FF00, // Green
  0x0000FF, // Blue
  0xFF00FF, // Magenta
  0x00FFFF, // Cyan
  0xFFFF00, // Yellow
  0xFF8000, // Orange
  0x8000FF, // Violet
  0xFF0080, // Pink
  0x00FF80, // Mint green
  0x0080FF, // Light blue
  0x8000FF, // Purple
  0xFF8080, // Light red
  0x80FF80, // Light green
  0x8080FF  // Light blue
];

export const WormCountingGame: React.FC<WormCountingGameProps> = ({ onProgress }) => {
  const [totalWorms, setTotalWorms] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [worms, setWorms] = useState<any[]>([]);
  const [stageSize, setStageSize] = useState({ width: 600, height: 400 }); // Smaller playing field
  const tickRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    initializeGame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const initializeGame = () => {
    const randomTotal = Math.floor(Math.random() * 13) + 3;
    setTotalWorms(randomTotal);
    setUserGuess('');
    setShowResult(false);

    // Initialize worms with random positions, properties, and colors
    const newWorms = Array.from({ length: randomTotal }, (_, index) => ({
      x: Math.random() * stageSize.width,
      y: Math.random() * stageSize.height,
      scale: 0.8 + Math.random() * 0.3,
      direction: Math.random() * Math.PI * 2,
      turningSpeed: Math.random() - 0.8,
      speed: (2 + Math.random() * 2) * 0.2,
      offset: Math.random() * 100,
      tint: WORM_COLORS[index % WORM_COLORS.length] // Cyclical color assignment
    }));

    setWorms(newWorms);
    startAnimation();
  };

  const startAnimation = () => {
    const dudeBounds = new Rectangle(
      -1,
      -1,
      stageSize.width + 2,
      stageSize.height + 2
    );

    const animate = () => {
      setWorms(prevWorms => prevWorms.map(worm => {
        const scale = 0.95 + Math.sin(tickRef.current + worm.offset) * 0.05;
        let x = worm.x;
        let y = worm.y;
        const direction = worm.direction + worm.turningSpeed * 0.01;
        
        x += Math.sin(direction) * (worm.speed * scale);
        y += Math.cos(direction) * (worm.speed * scale);

        // Wrap worms around screen
        if (x < dudeBounds.x) x += dudeBounds.width;
        else if (x > dudeBounds.x + dudeBounds.width) x -= dudeBounds.width;
        if (y < dudeBounds.y) y += dudeBounds.height;
        else if (y > dudeBounds.y + dudeBounds.height) y -= dudeBounds.height;

        return {
          ...worm,
          x,
          y,
          direction,
          scale,
        };
      }));

      tickRef.current += 0.1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const handleGuess = () => {
    const guess = parseInt(userGuess);
    if (isNaN(guess)) return;

    setShowResult(true);
    setAttempts(prev => prev + 1);

    const difference = Math.abs(guess - totalWorms);
    let newScore = 0;

    if (difference === 0) newScore = 100;
    else if (difference === 1) newScore = 75;
    else if (difference === 2) newScore = 50;
    else if (difference <= 4) newScore = 25;

    setScore(prev => prev + newScore);
    onProgress(Math.min((score + newScore) / 2, 100));
  };

  return (
    <div className="max-w-2xl mx-auto p-4"> {/* Smaller container */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-purple-600 font-bold">Score: {score}</div>
        <div className="text-gray-600">Attempts: {attempts}</div>
      </div>

      <div className="relative bg-gray-100 rounded-lg p-4">
        <Stage width={stageSize.width} height={stageSize.height} options={{ backgroundColor: 0x1099bb }}>
          <Container>
            {worms.map((worm, index) => (
              <Sprite
                key={index}
                image="https://pixijs.com/assets/maggot_tiny.png"
                x={worm.x}
                y={worm.y}
                anchor={0.5}
                scale={worm.scale}
                rotation={-worm.direction + Math.PI}
                tint={worm.tint}
              />
            ))}
          </Container>
        </Stage>

        {!showResult ? (
          <div className="mt-4 flex gap-4 justify-center">
            <input
              type="number"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              min="1"
              max="20"
              className="w-24 px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              placeholder="?"
            />
            <button
              onClick={handleGuess}
              disabled={!userGuess}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              Guess
            </button>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <div className={`p-4 rounded-lg mb-4 ${
              parseInt(userGuess) === totalWorms 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              <p className="text-lg font-bold mb-2">
                {parseInt(userGuess) === totalWorms 
                  ? 'Perfect! 🎉' 
                  : 'Almost right! 👀'}
              </p>
              <p>
                There were {totalWorms} worms. You guessed {userGuess}.
              </p>
            </div>
            <button
              onClick={initializeGame}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              Play again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-lg font-semibold text-purple-600 bg-purple-50 p-4 rounded-lg">
        How many worms do you see? 🪱
      </div>
    </div>
  );
};
