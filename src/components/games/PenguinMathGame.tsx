import React, { useState, useEffect } from 'react';
import { mathProblems, MathProblem } from '../../data/mathProblems';
import { Star, ThumbsUp, ThumbsDown, ArrowRight, HelpCircle, Calculator } from 'lucide-react';

interface PenguinMathGameProps {
  onProgress: (progress: number) => void;
}

export const PenguinMathGame: React.FC<PenguinMathGameProps> = ({ onProgress }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Shuffle math problems at the start of the game
    setProblems([...mathProblems].sort(() => Math.random() - 0.5));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAnswer && userAnswer !== '') {
      setShowAnswer(true);
      if (parseInt(userAnswer) === problems[currentProblemIndex].answer) {
        setScore(score + 1);
      }
      // Aktualisiere den Fortschritt
      const progress = ((score + (parseInt(userAnswer) === problems[currentProblemIndex].answer ? 1 : 0)) / problems.length) * 100;
      onProgress(progress);
    }
  };

  const nextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setUserAnswer('');
      setShowAnswer(false);
      setShowHint(false);
    }
  };

  if (problems.length === 0) return null;

  const currentProblem = problems[currentProblemIndex];
  const isLastProblem = currentProblemIndex === problems.length - 1;
  const isCorrect = showAnswer && parseInt(userAnswer) === currentProblem.answer;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Fortschrittsbalken */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-full bg-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentProblemIndex + (showAnswer ? 1 : 0)) / problems.length) * 100}%` }}
        />
      </div>

      {/* Punktestand */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-lg font-bold">{score} von {problems.length} Punkten</span>
        </div>
      </div>

      {/* Aufgabenkarte */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <Calculator className="w-6 h-6 text-purple-600" />
          <button
            onClick={() => setShowHint(true)}
            className="text-purple-600 hover:text-purple-700 transition-colors"
            title="Hinweis anzeigen"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
          {currentProblem.question}
        </h3>

        {showHint && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg text-purple-700 text-sm">
            💡 Tipp: {currentProblem.hint}
          </div>
        )}

        {!showAnswer ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 p-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                placeholder="Deine Antwort..."
                min="0"
                max="100"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Prüfen
              </button>
            </div>
          </form>
        ) : (
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
                  {isCorrect ? 'Super gerechnet!' : `Die richtige Antwort ist ${currentProblem.answer}`}
                </span>
              </div>
              <p>{currentProblem.explanation}</p>
            </div>

            {!isLastProblem && (
              <button
                onClick={nextProblem}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                Nächste Aufgabe
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {isLastProblem && showAnswer && (
        <div className="text-center bg-purple-100 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">Spiel beendet!</h3>
          <p className="text-lg mb-4">
            Du hast {score} von {problems.length} Aufgaben richtig gelöst!
          </p>
          {score === problems.length ? (
            <p className="text-green-600">Fantastisch! Du bist ein Mathe-Genie! 🎉</p>
          ) : score >= problems.length * 0.7 ? (
            <p className="text-green-600">Super gemacht! Du bist richtig gut in Mathe! 🌟</p>
          ) : (
            <p className="text-purple-600">Weiter üben! Mathe macht mit der Zeit immer mehr Spaß! 📚</p>
          )}
        </div>
      )}
    </div>
  );
};
