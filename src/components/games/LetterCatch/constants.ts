export const GAME_WIDTH = 800;
/**
 * Constants for game dimensions and colors
 * Adjusted for optimal gameplay experience
 */
export const GAME_HEIGHT = 500; // Reduced height
export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 20;
export const ITEM_SIZE = 40;
export const SPAWN_INTERVAL = 1000;
export const FALL_SPEED = 3;

export const COLORS = {
  BACKGROUND: 0x1099bb,
  PADDLE: 0x00ff00,
  LETTER: 0xffffff,
  NUMBER: 0xff0000,
  SHADOW: 0x111111,
  STROKE: 0x004620
} as const;
