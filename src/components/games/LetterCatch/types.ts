/**
 * Types for falling items and game state
 */
export interface FallingItem {
  x: number;
  y: number;
  value: string;
  isNumber: boolean;
}

export interface GameState {
  score: number;
  misses: number;
  gameOver: boolean;
}
