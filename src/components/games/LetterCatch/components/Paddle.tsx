import React from 'react';
import { Graphics } from '@pixi/react';
import { GAME_HEIGHT, PADDLE_HEIGHT, PADDLE_WIDTH, COLORS } from '../constants';

interface PaddleProps {
  x: number;
}

export const Paddle: React.FC<PaddleProps> = ({ x }) => {
  /**
   * Draw the paddle on the game stage
   */
  const draw = (g: any) => {
    g.clear();
    g.beginFill(COLORS.PADDLE);
    g.drawRect(x, GAME_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    g.endFill();
  };

  return <Graphics draw={draw} />;
};
