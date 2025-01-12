import React, { useState, useEffect } from 'react';
import { decimalTasks, DecimalTask } from '../../data/decimalNumbers';
import { Star, ThumbsUp, ThumbsDown, ArrowRight, HelpCircle, Target } from 'lucide-react';

interface ParrotDecimalGameProps {
  onProgress: (progress: number) => void;
}

interface NumberLineProps {
  range: 'small' | 'large';
  onValueSelect: (value: number) => void;
}

const NumberLine: React.FC<NumberLineProps> = ({ range, onValueSelect }) => {
  const isSmallRange = range === 'small';
  const max = isSmallRange ? 1 : 5;
  const steps = isSmallRange ? 10 : 50;
  const majorSteps = isSmallRange ? 2 : 6;

  return (
    <div className="relative w-full h-24 flex items-center">
      <div className="absolute w-full h-1 bg-purple-200 rounded-full" />
      {Array.from({ length: steps + 1 }, (_, i) => {
        const value = (i / steps) * max;
        const isWhole = i % (steps / (majorSteps - 1)) === 0;
        
        return (
          <div
            key={i}
            className="absolute transform -translate-x-1/2"
            style={{ left: `${(i / steps) * 100}%` }}
          >
            <button
              onClick={() => onValueSelect(value)}
              className={`w-4 h-4 rounded-full ${
                isWhole 
                  ? 'bg-purple-600' 
                  : 'bg-purple-300 hover:bg-purple-400'
              } transition-colors`}
            />
            {isWhole && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                {value}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ParrotDecimalGame: React.FC<ParrotDecimalGameProps> = ({ onProgress }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [tasks, setTasks] = useState<DecimalTask[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setTasks([...decimalTasks].sort(() => Math.random() - 0.5));
  }, []);

  /**
   * Handle the selection of a value on the number line
   */
  const handleValueSelect = (value: number) => {
    if (showAnswer) return;
    
    setSelectedValue(value);
    setShowAnswer(true);
    
    const tolerance = 0.05;
    const isCorrectValue = Math.abs(value - tasks[currentTaskIndex].number) <= tolerance;
    setIsCorrect(isCorrectValue);
    
    if (isCorrectValue) {
      setScore(prev => prev + 1);
      onProgress(((score + 1) / tasks.length) * 100);
    }
  };

  const nextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      setSelectedValue(null);
      setShowAnswer(false);
      setIsCorrect(false);
    }
  };

  if (tasks.length === 0) return null;

  const currentTask = tasks[currentTaskIndex];
  const isLastTask = currentTaskIndex === tasks.length - 1;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-full bg-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentTaskIndex + (showAnswer ? 1 : 0)) / tasks.length) * 100}%` }}
        />
      </div>

      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-lg font-bold">{score} von {tasks.length} Punkten</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-center text-purple-600 mb-6">
          Wo liegt die Zahl {currentTask.number}?
        </h3>

        <div className="mb-4 p-3 bg-purple-50 rounded-lg text-purple-700 text-sm">
          💡 Tipp: {currentTask.hint}
        </div>

        <div className="my-8">
          <NumberLine 
            range={currentTask.range}
            onValueSelect={handleValueSelect}
          />
        </div>

        {showAnswer && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <ThumbsUp className="w-5 h-5" />
                ) : (
                  <ThumbsDown className="w-5 h-5" />
                )}
                <span className="font-bold">
                  {isCorrect ? 'Super gemacht!' : 'Fast richtig!'}
                </span>
              </div>
              <p>{currentTask.explanation}</p>
            </div>

            {!isLastTask && (
              <button
                onClick={nextTask}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                Nächste Aufgabe
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {isLastTask && showAnswer && (
        <div className="text-center bg-purple-100 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">Spiel beendet!</h3>
          <p className="text-lg mb-4">
            Du hast {score} von {tasks.length} Aufgaben richtig gelöst!
          </p>
          {score === tasks.length ? (
            <p className="text-green-600">Fantastisch! Du bist ein Dezimalzahlen-Profi! 🎉</p>
          ) : score >= tasks.length * 0.7 ? (
            <p className="text-green-600">Super gemacht! Du kennst dich gut mit Dezimalzahlen aus! 🌟</p>
          ) : (
            <p className="text-purple-600">Weiter üben! Dezimalzahlen werden mit der Zeit einfacher! 📚</p>
          )}
        </div>
      )}
    </div>
  );
};
