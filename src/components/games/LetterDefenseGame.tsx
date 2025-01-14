import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Container, Graphics, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow';
import { Star, Info } from 'lucide-react';
import * as PIXI from 'pixi.js';

// =============================
/**
 * Types for game components and state
 */
// =============================
interface LetterDefenseGameProps {
  onProgress: (progress: number) => void;
}

interface FallingLetter {
  id: number;
  char: string;
  x: number;
  y: number;
  destroyed: boolean;
}

interface Laser {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  timestamp: number;
}

interface Impact {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

// =============================
// Settings
// =============================
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const DEFENSE_HEIGHT = 40;

// Speed & Timings
const LETTER_SPEED = 2;
const LASER_DURATION = 1000; // in ms
const IMPACT_DURATION = 500; // in ms (0.5 Sekunden)

// How many missed letters are allowed
const MAX_IMPACTS: number = 8;

// =============================
// Text style of the letters
// =============================
const letterStyle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 40,
  fontWeight: 'bold',
  fill: '#ffffff',
  stroke: '#004620',
  strokeThickness: 14,
  dropShadow: true,
  dropShadowColor: '#9ca3b6',
  dropShadowBlur: 40,
  dropShadowAngle: Math.PI / 12,
  dropShadowDistance: 16,
});

export const LetterDefenseGame: React.FC<LetterDefenseGameProps> = ({
                                                                      onProgress,
                                                                    }) => {
  // ============================
  // State
  // ============================
  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem('letterDefenseTutorialShown') !== 'true';
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [letters, setLetters] = useState<FallingLetter[]>([]);
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [impacts, setImpacts] = useState<Impact[]>([]); // Einschläge für rote Glow-Effekte
  const [misses, setMisses] = useState(0);

  // ============================
  // Refs & Zähler
  // ============================
  const animationFrameRef = useRef<number>();
  const lastSpawnRef = useRef(0);
  const letterIdCounter = useRef(0);
  const laserIdCounter = useRef(0);
  const impactIdCounter = useRef(0);

  // ============================
  // Audio-Elemente
  // ============================
  // Laser-Sound
  const laserAudioRef = useRef<HTMLAudioElement>(
      typeof Audio !== 'undefined' ? new Audio('/sounds/laser.mp3') : null
  );
  // Impact sound
  const impactAudioRef = useRef<HTMLAudioElement>(
      typeof Audio !== 'undefined' ? new Audio('/sounds/impact.mp3') : null
  );
  // New audio for the tutorial
  const sunriseAudioRef = useRef<HTMLAudioElement>(
      typeof Audio !== 'undefined' ? new Audio('/sounds/sunrise.mp3') : null
  );

  // ============================
  // Glow-Filter
  // ============================
  // Laser => grünliches Leuchten
  const laserGlowFilter = new GlowFilter({
    distance: 15,
    outerStrength: 4,
    innerStrength: 1,
    color: 0x66ff99,
    quality: 0.5,
  });

  // Red ground impact
  const impactGlowFilter = new GlowFilter({
    distance: 25,
    outerStrength: 14,
    innerStrength: 1,
    color: 0xff0000,
    quality: 0.3,
  });

  // ============================
// Tutorial logic
  // ============================
  useEffect(() => {
    if (!showTutorial) {
// Tutorial is gone -> Start game
      setGameStarted(true);
    }
  }, [showTutorial]);

  const hideTutorial = (dontShowAgain: boolean) => {
    setShowTutorial(false);
    if (dontShowAgain) {
      localStorage.setItem('letterDefenseTutorialShown', 'true');
    }
    setGameStarted(true);
  };

  // *** Here comes the logic for sunrise.mp3 ***
  // We play the audio as soon as the tutorial (showTutorial) is displayed,
  // and stop it when the tutorial disappears.
  useEffect(() => {
    if (showTutorial) {
      // Startet das Audio (einmalig, kein Loop)
      if (sunriseAudioRef.current) {
        sunriseAudioRef.current.currentTime = 0;
        sunriseAudioRef.current.loop = false; // nur einmal abspielen
        sunriseAudioRef.current.play().catch((err) =>
            console.warn('Sunrise audio error:', err)
        );
      }
    } else {
      // Wenn das Tutorial verschwindet -> Audio pausieren & zurückspulen
      if (sunriseAudioRef.current) {
        sunriseAudioRef.current.pause();
        sunriseAudioRef.current.currentTime = 0;
      }
    }
  }, [showTutorial]);

  // ============================
  // Generate letters
  // ============================
  const spawnLetter = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const char = chars[Math.floor(Math.random() * chars.length)];
    const x = Math.random() * (GAME_WIDTH - 40) + 20;

    setLetters((prev) => [
      ...prev,
      {
        id: letterIdCounter.current++,
        char,
        x,
        y: -30,
        destroyed: false,
      },
    ]);
  }, []);

  // ============================
  // Main loop (animation)
  // ============================
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = (timestamp: number) => {
      // 1) Spawn letters (every 2 seconds)
      if (timestamp - lastSpawnRef.current > 2000) {
        spawnLetter();
        lastSpawnRef.current = timestamp;
      }

      // 2) Drop letters
      setLetters((prevLetters) => {
        const activeLetters = prevLetters.filter((l) => !l.destroyed);
        const movedLetters = activeLetters.map((letter) => ({
          ...letter,
          y: letter.y + LETTER_SPEED,
        }));

        // Reached the ground?
        const missedLetters = movedLetters.filter((l) => l.y > GAME_HEIGHT);

        if (missedLetters.length > 0) {
          missedLetters.forEach((m) => {
            // 2a) Red impact
            setImpacts((prevI) => [
              ...prevI,
              {
                id: impactIdCounter.current++,
                x: m.x,
                y: GAME_HEIGHT,
                timestamp: Date.now(),
              },
            ]);

            // 2b) Play impact sound
            if (impactAudioRef.current) {
              // Use cloneNode for parallel sounds if needed
              impactAudioRef.current.currentTime = 0;
              impactAudioRef.current.play().catch((err) => {
                console.warn('Impact sound play error:', err);
              });
            }
          });

          // 3) Count misses
          setMisses((oldMisses) => {
            const newMisses = oldMisses + missedLetters.length;
            if (newMisses >= MAX_IMPACTS) {
              setGameOver(true);
            }
            return newMisses;
          });
        }

        // return only visible letters
        return movedLetters.filter((l) => l.y <= GAME_HEIGHT);
      });

      // 3) Remove lasers when they expire
      const now = Date.now();
      setLasers((prevLasers) =>
          prevLasers.filter((laser) => now - laser.timestamp < LASER_DURATION)
      );

      // 4) Remove red impacts (older than IMPACT_DURATION)
      setImpacts((prevImpacts) =>
          prevImpacts.filter((impact) => now - impact.timestamp < IMPACT_DURATION)
      );

      // Request next frame
      if (!gameOver) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    // Start game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [spawnLetter, gameStarted, gameOver]);

  // ============================
  // Keyboard input (laser)
  // ============================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      const key = e.key.toUpperCase();

      // All matching letters
      const matchingLetters = letters.filter(
          (l) => !l.destroyed && l.char === key
      );
      if (matchingLetters.length === 0) return;

      // 1) Play laser sound
      if (laserAudioRef.current) {
        laserAudioRef.current.currentTime = 0;
        laserAudioRef.current.play().catch((err) => {
          console.warn('Laser sound play error:', err);
        });
      }

      // 2) Create laser
      const newLasers = matchingLetters.map((letter) => ({
        id: laserIdCounter.current++,
        startX: GAME_WIDTH / 2,
        startY: GAME_HEIGHT - DEFENSE_HEIGHT / 2,
        endX: letter.x,
        endY: letter.y + 15,
        timestamp: Date.now(),
      }));
      setLasers((prev) => [...prev, ...newLasers]);

      // 3) Mark letters as destroyed
      setLetters((prevLetters) =>
          prevLetters.map((l) =>
              matchingLetters.some((ml) => ml.id === l.id)
                  ? { ...l, destroyed: true }
                  : l
          )
      );

      // 4) Update score
      setScore((prev) => {
        const newScore = prev + matchingLetters.length * 10;
        onProgress(Math.min((newScore / 500) * 100, 100));
        return newScore;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [letters, gameStarted, gameOver, onProgress]);

  // ============================
  // Drawing functions
  // ============================
  const drawGrass = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0x228b22);
    g.drawRect(0, GAME_HEIGHT - 60, GAME_WIDTH, 60);
    g.endFill();
  }, []);

  const drawDefense = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0x00ff00);
    g.drawRect(
        GAME_WIDTH / 2 - 30,
        GAME_HEIGHT - DEFENSE_HEIGHT,
        60,
        DEFENSE_HEIGHT
    );
    g.endFill();
  }, []);

  // Draws lasers (green lines)
  const drawLasers = useCallback(
      (g: PIXI.Graphics) => {
        g.clear();
        lasers.forEach((laser) => {
          // Outer line (thicker, semi-transparent)
          g.lineStyle(6, 0x00ff00, 0.3);
          g.moveTo(laser.startX, laser.startY);
          g.lineTo(laser.endX, laser.endY);

          // Inner line (thin, opaque)
          g.lineStyle(2, 0x00ff00, 1);
          g.moveTo(laser.startX, laser.startY);
          g.lineTo(laser.endX, laser.endY);
        });
      },
      [lasers]
  );

  // Draws the impacts (red circles) on the ground
  const drawImpacts = useCallback(
      (g: PIXI.Graphics) => {
        g.clear();
        impacts.forEach((impact) => {
          // Draw a red circle on the ground, for example
          g.beginFill(0xff4444, 1);
          g.drawCircle(impact.x, impact.y, 18);
          g.endFill();
        });
      },
      [impacts]
  );

  // ============================
  // Reset game
  // ============================
  const resetGame = () => {
    setScore(0);
    setMisses(0);
    setGameOver(false);
    setLetters([]);
    setLasers([]);
    setImpacts([]);
    lastSpawnRef.current = 0;
    letterIdCounter.current = 0;
    laserIdCounter.current = 0;
    impactIdCounter.current = 0;
    setGameStarted(true);
  };

  // ============================
  // Render
  // ============================
  return (
      <div className="relative max-w-4xl mx-auto">
        {/* Tutorial */}
        {showTutorial && (
            <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg max-w-md">
                <div className="flex items-center gap-2 mb-4 text-purple-600">
                  <Info className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Game Instructions</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Press the letters on your keyboard to shoot falling letters
                  with laser beams.
                  Try not to miss any letters!
                  After {MAX_IMPACTS} missed letters, the game is over.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <input
                      type="checkbox"
                      id="dontShowAgain"
                      onChange={(e) => hideTutorial(e.target.checked)}
                      className="rounded text-purple-600"
                  />
                  <label htmlFor="dontShowAgain" className="text-sm text-gray-600">
                    Don't show again
                  </label>
                </div>
                <button
                    onClick={() => hideTutorial(false)}
                    className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Understood
                </button>
              </div>
            </div>
        )}

        {/* Score and missed letters */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold">{score}</span>
          </div>
          <div className="text-red-500">
            Missed: {misses}/{MAX_IMPACTS}
          </div>
        </div>

        {/* Pixi-Stage */}
        <Stage
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            options={{ backgroundColor: 0x000000 }}
        >
          <Container>
            {/* Ground */}
            <Graphics draw={drawGrass} />

            {/* Defense blocks */}
            <Graphics draw={drawDefense} />

            {/* Letters (not destroyed) */}
            {letters
                .filter((l) => !l.destroyed)
                .map((letter) => (
                    <Text
                        key={letter.id}
                        text={letter.char}
                        x={letter.x}
                        y={letter.y}
                        style={letterStyle}
                        anchor={0.5}
                    />
                ))}

            {/* Lasers with green glow */}
            <Container filters={[laserGlowFilter]}>
              <Graphics draw={drawLasers} />
            </Container>

            {/* Red impacts on the ground */}
            <Container filters={[impactGlowFilter]}>
              <Graphics draw={drawImpacts} />
            </Container>
          </Container>
        </Stage>

        {/* GameOver overlay */}
        {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-purple-600 mb-2">
                  Game Over!
                </h3>
                <p className="mb-4">Your score: {score}</p>
                <button
                    onClick={resetGame}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Play again
                </button>
              </div>
            </div>
        )}
      </div>
  );
};
