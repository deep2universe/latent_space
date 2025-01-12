import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  /**
   * Calculate minutes and seconds from time left
   */
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
      <Clock className="w-5 h-5 text-purple-600" />
      <span className="font-mono text-xl text-purple-600">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
