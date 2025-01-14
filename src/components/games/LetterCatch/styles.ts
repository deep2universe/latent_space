import { TextStyle } from 'pixi.js';
import { COLORS } from './constants';

export const createFallingStyle = (isNumber: boolean): TextStyle => new TextStyle({
  fontFamily: 'Arial',
  fontSize: 40,
  fontWeight: 'bold',
  fill: isNumber ? COLORS.NUMBER : COLORS.LETTER,
  stroke: COLORS.STROKE,
  strokeThickness: 4,
  dropShadow: true,
  dropShadowAlpha: 0.8,
  dropShadowAngle: 2.1,
  dropShadowBlur: 4,
  dropShadowColor: COLORS.SHADOW,
  dropShadowDistance: 10
});
