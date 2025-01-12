import { useMemo } from 'react';
import { Wall } from './types';
import { STAGE_WIDTH, STAGE_HEIGHT } from './constants';

export const useMazeWalls = () => {
  return useMemo<Wall[]>(() => [
    // Define outer walls of the maze
    { x1: 0, y1: 0, x2: STAGE_WIDTH, y2: 0 },
    { x1: 0, y1: STAGE_HEIGHT, x2: STAGE_WIDTH, y2: STAGE_HEIGHT },
    { x1: 0, y1: 0, x2: 0, y2: 200 },
    { x1: 0, y1: 300, x2: 0, y2: STAGE_HEIGHT },
    { x1: STAGE_WIDTH, y1: 0, x2: STAGE_WIDTH, y2: 200 },
    { x1: STAGE_WIDTH, y1: 300, x2: STAGE_WIDTH, y2: STAGE_HEIGHT },

    // Innere Wände - dynamisch generiert für mittlere Schwierigkeit
    { x1: 100, y1: 100, x2: 200, y2: 100 },
    { x1: 200, y1: 100, x2: 200, y2: 300 },
    { x1: 100, y1: 300, x2: 200, y2: 300 },
    { x1: 300, y1: 50, x2: 300, y2: 200 },
    { x1: 300, y1: 200, x2: 400, y2: 200 },
    { x1: 400, y1: 200, x2: 400, y2: 350 },
    { x1: 450, y1: 100, x2: 500, y2: 100 },
    { x1: 450, y1: 100, x2: 450, y2: 250 },
  ], []);
};
