import React, { useState, useEffect, useRef } from 'react';
import { Stage, Container, Sprite, Graphics } from '@pixi/react';
import { Application, Rectangle } from 'pixi.js';
import { Check, RotateCcw } from 'lucide-react';

interface TreeCountingGameProps {
  onProgress: (progress: number) => void;
}

export const TreeCountingGame: React.FC<TreeCountingGameProps> = ({ onProgress }) => {
  const [totalBlueTrees, setTotalBlueTrees] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [trees, setTrees] = useState<any[]>([]);
  const [worldContainer, setWorldContainer] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stageSize] = useState({ width: 600, height: 400 });
  const worldSize = 1200; // Smaller world for better navigation
  const padding = 100; // Padding around the game world

  const initializeGame = () => {
    const randomTotal = Math.floor(Math.random() * 13) + 3;
    setTotalBlueTrees(randomTotal);
    setUserGuess('');
    setShowResult(false);

    // Place trees with minimum distance to the edge
    const newTrees = Array.from({ length: 500 }, (_, index) => {
      const isBlue = index < randomTotal;
      return {
        x: padding + Math.random() * (worldSize - 2 * padding),
        y: padding + Math.random() * (worldSize - 2 * padding),
        scale: 0.2,
        tint: isBlue ? 0x0000FF : 0xFFFFFF
      };
    });

    // Mischen und Sortieren
    for (let i = newTrees.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTrees[i], newTrees[j]] = [newTrees[j], newTrees[i]];
    }
    newTrees.sort((a, b) => a.y - b.y);
    setTrees(newTrees);
    
    // Reset Position
    setWorldContainer({ x: 0, y: 0 });
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const animate = () => {
      setWorldContainer(prev => {
        // Calculate the maximum scroll distance
        const maxScrollX = worldSize - stageSize.width;
        const maxScrollY = worldSize - stageSize.height;

        // Calculate the target position based on the mouse position
        const targetX = -maxScrollX * mousePos.x;
        const targetY = -maxScrollY * mousePos.y;

        // Smooth movement to the target position
        const newX = prev.x + (targetX - prev.x) * 0.1;
        const newY = prev.y + (targetY - prev.y) * 0.1;

        return { x: newX, y: newY };
      });

      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePos, worldSize, stageSize.width, stageSize.height]);

  const handleGuess = () => {
    const guess = parseInt(userGuess);
    if (isNaN(guess)) return;

    setShowResult(true);
    setAttempts(prev => prev + 1);

    const difference = Math.abs(guess - totalBlueTrees);
    let newScore = 0;

    if (difference === 0) newScore = 100;
    else if (difference === 1) newScore = 75;
    else if (difference === 2) newScore = 50;
    else if (difference <= 4) newScore = 25;

    setScore(prev => prev + newScore);
    onProgress(Math.min((score + newScore) / 2, 100));
  };

  /**
   * Function to draw the border and grid for orientation
   */
  const drawBorder = (g: any) => {
    g.clear();
    g.lineStyle(4, 0xFFFFFF, 0.8);
    g.drawRect(0, 0, worldSize, worldSize);
    
    // Draw a grid for better orientation
    g.lineStyle(1, 0xFFFFFF, 0.2);
    for (let i = padding; i < worldSize; i += padding) {
      g.moveTo(i, 0);
      g.lineTo(i, worldSize);
      g.moveTo(0, i);
      g.lineTo(worldSize, i);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-purple-600 font-bold">Score: {score}</div>
        <div className="text-gray-600">Attempts: {attempts}</div>
      </div>

      <div className="relative bg-gray-100 rounded-lg p-4">
        <div className="mb-4 text-center text-sm bg-blue-100 text-blue-700 p-2 rounded">
          Move the mouse over the field to explore the forest!
          <br />
          <span className="text-xs">Move to the edges of the field to scroll further.</span>
        </div>

        <div 
          onMouseMove={handleMouseMove} 
          onMouseLeave={() => setMousePos({ x: 0.5, y: 0.5 })}
          className="rounded-lg overflow-hidden"
        >
          <Stage 
            width={stageSize.width} 
            height={stageSize.height} 
            options={{ backgroundColor: 0x2F4F4F }}
          >
            <Container x={worldContainer.x} y={worldContainer.y}>
              <Graphics draw={drawBorder} />
              {trees.map((tree, index) => (
                <Sprite
                  key={index}
                  image="https://pixijs.com/assets/tree.png"
                  x={tree.x}
                  y={tree.y}
                  anchor={0.5}
                  scale={tree.scale}
                  tint={tree.tint}
                />
              ))}
            </Container>
          </Stage>
        </div>

        <div className="mt-4">
          <div className="text-center mb-2 font-medium text-gray-700">
            How many blue trees did you find?
          </div>
          {!showResult ? (
            <div className="flex gap-4 justify-center">
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
            <div className="text-center">
              <div className={`p-4 rounded-lg mb-4 ${
                parseInt(userGuess) === totalBlueTrees 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                <p className="text-lg font-bold mb-2">
                  {parseInt(userGuess) === totalBlueTrees 
                    ? 'Perfect! 🎉' 
                    : 'Almost right! 👀'}
                </p>
                <p>
                  There were {totalBlueTrees} blue trees. You guessed {userGuess}.
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
      </div>
    </div>
  );
};
