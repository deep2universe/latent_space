import React from 'react';
import { Text } from '@pixi/react';
import { FallingItem } from '../types';
import { createFallingStyle } from '../styles';

interface FallingItemsProps {
  items: FallingItem[];
}

export const FallingItems: React.FC<FallingItemsProps> = ({ items }) => {
  /**
   * Render falling items (letters and numbers) on the game stage
   */
  return (
    <>
      {items.map((item, index) => (
        <Text
          key={index}
          text={item.value}
          x={item.x}
          y={item.y}
          style={createFallingStyle(item.isNumber)}
        />
      ))}
    </>
  );
};
