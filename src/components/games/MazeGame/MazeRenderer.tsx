import React from 'react';
import { Container, Graphics } from '@pixi/react';
import { GameState } from './types';
import { WALL_COLOR, PATH_COLOR, START_COLOR, END_COLOR } from './constants';
import { useMazeWalls } from './useMazeWalls';

interface MazeRendererProps {
  trail: { x: number; y: number }[];
  gameState: GameState;
}

export const MazeRenderer: React.FC<MazeRendererProps> = ({ trail, gameState }) => {
  const walls = useMazeWalls();

  const drawWalls = (g: any) => {
    g.clear();
    g.lineStyle(4, WALL_COLOR);
    
    walls.forEach(wall => {
      g.moveTo(wall.x1, wall.y1);
      g.lineTo(wall.x2, wall.y2);
    });

    // Draw the start area
    g.beginFill(START_COLOR);
    g.drawRect(0, 200, 50, 100);
    g.endFill();

    // End area
    g.beginFill(END_COLOR);
    g.drawRect(550, 200, 50, 100);
    g.endFill();
  };

  const drawTrail = (g: any) => {
    if (trail.length < 2) return;
    
    g.clear();
    g.lineStyle(3, PATH_COLOR);
    g.moveTo(trail[0].x, trail[0].y);
    
    for (let i = 1; i < trail.length; i++) {
      g.lineTo(trail[i].x, trail[i].y);
    }
  };

  return (
    <Container>
      <Graphics draw={drawWalls} />
      {gameState === 'playing' && <Graphics draw={drawTrail} />}
    </Container>
  );
};
