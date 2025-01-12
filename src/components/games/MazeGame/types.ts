/**
 * Types for game state and maze components
 */
export type GameState = 'ready' | 'playing' | 'won' | 'lost';

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
