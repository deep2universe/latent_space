import React from 'react';
import { X } from 'lucide-react';
import { LionFactGame } from './games/LionFactGame';
import { ElephantMemoryGame } from './games/ElephantMemoryGame';
import { TigerHangmanGame } from './games/TigerHangmanGame';
import { GorillaVocabularyGame } from './games/GorillaVocabularyGame';
import { KangarooQuizGame } from './games/KangarooQuizGame';
import { PenguinMathGame } from './games/PenguinMathGame';
import { ParrotDecimalGame } from './games/ParrotDecimalGame';
import { FroggerGame } from './games/FroggerGame';
import { SnakeGame } from './games/SnakeGame';
import { SoccerGame } from './games/SoccerGame';
import { DrawingGame } from './games/DrawingGame';
import { PhysicsDrawingGame } from './games/PhysicsDrawingGame';
import { WormCountingGame } from './games/WormCountingGame';
import { TreeCountingGame } from './games/TreeCountingGame';
import { MazeGame } from './games/MazeGame/MazeGame';
import { LetterCatchGame } from './games/LetterCatch/LetterCatchGame';
import { LetterDefenseGame } from './games/LetterDefenseGame';

interface GameOverlayProps {
  gameType: string;
  onClose: () => void;
  animalId: number;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({ gameType, onClose, animalId }) => {
  /**
   * Render the game overlay with the selected game component
   */
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl m-4 relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-8">
          {gameType === 'facts' && animalId === 1 && <LionFactGame onProgress={() => {}} />}
          {gameType === 'memory' && animalId === 2 && <ElephantMemoryGame onProgress={() => {}} />}
          {gameType === 'hangman' && animalId === 3 && <TigerHangmanGame onProgress={() => {}} />}
          {gameType === 'vocabulary' && animalId === 4 && <GorillaVocabularyGame onProgress={() => {}} />}
          {gameType === 'quiz' && animalId === 5 && <KangarooQuizGame onProgress={() => {}} />}
          {gameType === 'math' && animalId === 6 && <PenguinMathGame onProgress={() => {}} />}
          {gameType === 'decimal' && animalId === 7 && <ParrotDecimalGame onProgress={() => {}} />}
          {gameType === 'frogger' && animalId === 8 && <FroggerGame onProgress={() => {}} />}
          {gameType === 'snake' && animalId === 9 && <SnakeGame onProgress={() => {}} />}
          {gameType === 'soccer' && animalId === 10 && <SoccerGame onProgress={() => {}} />}
          {gameType === 'drawing' && animalId === 11 && <DrawingGame onProgress={() => {}} />}
          {gameType === 'physics' && animalId === 12 && <PhysicsDrawingGame onProgress={() => {}} />}
          {gameType === 'worms' && animalId === 13 && <WormCountingGame onProgress={() => {}} />}
          {gameType === 'trees' && animalId === 14 && <TreeCountingGame onProgress={() => {}} />}
          {gameType === 'maze' && animalId === 15 && <MazeGame onProgress={() => {}} />}
          {gameType === 'letters' && animalId === 16 && <LetterDefenseGame onProgress={() => {}} />}
        </div>
      </div>
    </div>
  );
};
