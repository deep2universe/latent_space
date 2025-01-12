import { Point, Wall } from './types';

/**
 * Check if a line between two points intersects any walls
 */
export const checkCollision = (p1: Point, p2: Point, walls: Wall[]): boolean => {
  return walls.some(wall => {
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;
    const x3 = wall.x1;
    const y3 = wall.y1;
    const x4 = wall.x2;
    const y4 = wall.y2;

    const denominator = ((x2 - x1) * (y4 - y3)) - ((y2 - y1) * (x4 - x3));
    if (denominator === 0) return false;

    const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator;
    const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denominator;

    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
  });
};
