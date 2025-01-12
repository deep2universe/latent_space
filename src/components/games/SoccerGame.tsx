import React, { useState, useEffect, useCallback } from 'react';
import { Stage, Container, Graphics } from '@pixi/react';
import { Point } from 'pixi.js';
import { Star } from 'lucide-react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BALL_RADIUS = 15;
const PLAYER_RADIUS = 30;
const GOAL_WIDTH = 100;
const GOAL_HEIGHT = 200;
const MOVEMENT_SPEED = 0.1;
const IMPULSE_POWER = 3;

interface GameProps {
  onProgress: (progress: number) => void;
}

export const SoccerGame: React.FC<GameProps> = ({ onProgress }) => {
  const [score, setScore] = useState(0);
  const [ballPosition, setBallPosition] = useState(new Point(GAME_WIDTH / 2, GAME_HEIGHT / 2));
  const [ballAcceleration, setBallAcceleration] = useState(new Point(0, 0));
  const [playerPosition, setPlayerPosition] = useState(new Point(GAME_WIDTH / 4, GAME_HEIGHT / 2));
  const [playerAcceleration, setPlayerAcceleration] = useState(new Point(0, 0));
  const [mousePosition, setMousePosition] = useState(new Point(0, 0));

  /**
   * Handle mouse movement to update player position
   */
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setMousePosition(new Point(
      event.clientX - bounds.left,
      event.clientY - bounds.top
    ));
  }, []);

  const testForCollision = useCallback((pos1: Point, pos2: Point, radius1: number, radius2: number) => {
    const distance = Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
    );
    return distance < (radius1 + radius2);
  }, []);

  const calculateCollisionResponse = useCallback((pos1: Point, pos2: Point, acc1: Point, acc2: Point) => {
    const collision = new Point(pos2.x - pos1.x, pos2.y - pos1.y);
    const distance = Math.sqrt(collision.x * collision.x + collision.y * collision.y);
    const normal = new Point(collision.x / distance, collision.y / distance);
    const relativeVelocity = new Point(acc1.x - acc2.x, acc1.y - acc2.y);
    const speed = relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;
    const impulse = IMPULSE_POWER * speed;
    return new Point(impulse * normal.x, impulse * normal.y);
  }, []);

  const checkGoal = useCallback((ballPos: Point) => {
    const goalX = GAME_WIDTH - GOAL_WIDTH / 2;
    const goalY = GAME_HEIGHT / 2;
    
    if (ballPos.x > GAME_WIDTH - GOAL_WIDTH &&
        Math.abs(ballPos.y - goalY) < GOAL_HEIGHT / 2) {
      setScore(prev => prev + 1);
      onProgress(Math.min((score + 1) * 20, 100));
      return true;
    }
    return false;
  }, [score, onProgress]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setBallPosition(prev => new Point(
        prev.x + ballAcceleration.x,
        prev.y + ballAcceleration.y
      ));

      setPlayerPosition(prev => {
        const direction = new Point(
          mousePosition.x - prev.x,
          mousePosition.y - prev.y
        );
        const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        const speed = distance * MOVEMENT_SPEED;
        
        return new Point(
          prev.x + (direction.x / distance) * speed,
          prev.y + (direction.y / distance) * speed
        );
      });

      setBallAcceleration(prev => new Point(prev.x * 0.98, prev.y * 0.98));
      setPlayerAcceleration(prev => new Point(prev.x * 0.98, prev.y * 0.98));

      // Ball-wall collisions
      if (ballPosition.x < BALL_RADIUS || ballPosition.x > GAME_WIDTH - BALL_RADIUS) {
        setBallAcceleration(prev => new Point(-prev.x * 0.8, prev.y));
      }
      if (ballPosition.y < BALL_RADIUS || ballPosition.y > GAME_HEIGHT - BALL_RADIUS) {
        setBallAcceleration(prev => new Point(prev.x, -prev.y * 0.8));
      }

      // Ball-player collision
      if (testForCollision(ballPosition, playerPosition, BALL_RADIUS, PLAYER_RADIUS)) {
        const impulse = calculateCollisionResponse(ballPosition, playerPosition, ballAcceleration, playerAcceleration);
        setBallAcceleration(prev => new Point(prev.x + impulse.x, prev.y + impulse.y));
      }

      // Check for goal
      if (checkGoal(ballPosition)) {
        setBallPosition(new Point(GAME_WIDTH / 2, GAME_HEIGHT / 2));
        setBallAcceleration(new Point(0, 0));
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [ballPosition, playerPosition, ballAcceleration, playerAcceleration, mousePosition, checkGoal, testForCollision, calculateCollisionResponse]);

  const drawField = useCallback((g: any) => {
    g.clear();
    // Field
    g.beginFill(0x88CC88);
    g.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.endFill();
    
    // Goal
    g.lineStyle(4, 0xFFFFFF);
    g.drawRect(
      GAME_WIDTH - GOAL_WIDTH,
      GAME_HEIGHT / 2 - GOAL_HEIGHT / 2,
      GOAL_WIDTH,
      GOAL_HEIGHT
    );
  }, []);

  const drawBall = useCallback((g: any) => {
    g.clear();
    g.beginFill(0xFFFFFF);
    g.drawCircle(ballPosition.x, ballPosition.y, BALL_RADIUS);
    g.endFill();
  }, [ballPosition]);

  const drawPlayer = useCallback((g: any) => {
    g.clear();
    g.beginFill(0xFF0000);
    g.drawCircle(playerPosition.x, playerPosition.y, PLAYER_RADIUS);
    g.endFill();
  }, [playerPosition]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-lg font-bold">Tore: {score}</span>
        </div>
      </div>

      <div className="relative" onMouseMove={handleMouseMove}>
        <Stage width={GAME_WIDTH} height={GAME_HEIGHT}>
          <Container>
            <Graphics draw={drawField} />
            <Graphics draw={drawBall} />
            <Graphics draw={drawPlayer} />
          </Container>
        </Stage>
      </div>
    </div>
  );
};
