import React, { useState, useEffect } from 'react';
import { lionFacts, AnimalFact } from '../../data/animalFacts';
import { Check, X, ChevronRight } from 'lucide-react';

interface GameStats {
  correct: number;
  total: number;
}

interface LionFactGameProps {
  onProgress: (progress: number) => void;
}

export const LionFactGame: React.FC<LionFactGameProps> = ({ onProgress }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState<GameStats>({ correct: 0, total: 0 });
  const [facts, setFacts] = useState<AnimalFact[]>([]);

  useEffect(() => {
    // Shuffle facts when the game starts
    setFacts([...lionFacts].sort(() => Math.random() - 0.5));
  }, []);

  const handleAnswer = (userAnswer: boolean) => {
    const isCorrect = userAnswer === facts[currentFactIndex].answer;
    const newStats = {
      correct: stats.correct + (isCorrect ? 1 : 0),
      total: stats.total + 1
    };
    setStats(newStats);
    setShowAnswer(true);

    // Belohne das Tier schon während des Spiels
    const progress = (newStats.correct / newStats.total) * 100;
    onProgress(progress);
  };

  const nextQuestion = () => {
    if (currentFactIndex < facts.length - 1) {
      setCurrentFactIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  if (facts.length === 0) return null;

  const currentFact = facts[currentFactIndex];
  const isGameOver = currentFactIndex === facts.length - 1 && showAnswer;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-full bg-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentFactIndex + (showAnswer ? 1 : 0)) / facts.length) * 100}%` }}
        />
      </div>

      {/* Score */}
      <div className="text-center mb-6">
        <p className="text-lg font-semibold text-purple-600">
          Punkte: {stats.correct} von {stats.total}
        </p>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-center">
          {currentFact.question}
        </h3>

        {!showAnswer ? (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Wahr
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Falsch
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className={`text-lg font-bold mb-2 ${currentFact.answer === true ? 'text-green-500' : 'text-red-500'}`}>
              {currentFact.answer ? 'Wahr!' : 'Falsch!'}
            </div>
            <p className="text-gray-600 mb-4">{currentFact.explanation}</p>
            {!isGameOver && (
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
              >
                Nächste Frage
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {isGameOver && (
        <div className="text-center bg-purple-100 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">Spiel beendet!</h3>
          <p className="text-lg">
            Du hast {stats.correct} von {facts.length} Fragen richtig beantwortet!
          </p>
          {stats.correct === facts.length ? (
            <p className="text-green-600 mt-2">Perfekt! Du bist ein echter Löwen-Experte! 🦁👑</p>
          ) : stats.correct >= facts.length * 0.7 ? (
            <p className="text-green-600 mt-2">Super gemacht! Du weißt schon sehr viel über Löwen! 🦁</p>
          ) : (
            <p className="text-purple-600 mt-2">Weiter üben! Du lernst jeden Tag etwas Neues über Löwen! 📚</p>
          )}
        </div>
      )}
    </div>
  );
};
