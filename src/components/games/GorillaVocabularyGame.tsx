import React, { useState, useEffect } from 'react';
import { vocabularyWords, VocabularyWord } from '../../data/vocabularyWords';
import { Star, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';

interface GorillaVocabularyGameProps {
  onProgress: (progress: number) => void;
}

export const GorillaVocabularyGame: React.FC<GorillaVocabularyGameProps> = ({ onProgress }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle words at the start of the game
    setWords([...vocabularyWords].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (words.length > 0) {
      // Shuffle the answers for the current question only once
      const currentWord = words[currentWordIndex];
      const answers = [
        currentWord.correctAnswer,
        currentWord.wrongAnswer
      ].sort(() => Math.random() - 0.5);
      setShuffledAnswers(answers);
    }
  }, [currentWordIndex, words]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    if (answer === words[currentWordIndex].correctAnswer) {
      setScore(score + 1);
    }

    // Update progress
    const progress = ((score + (answer === words[currentWordIndex].correctAnswer ? 1 : 0)) / words.length) * 100;
    onProgress(progress);
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  if (words.length === 0) return null;

  const currentWord = words[currentWordIndex];
  const isLastWord = currentWordIndex === words.length - 1;
  const isCorrect = selectedAnswer === currentWord.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-full bg-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentWordIndex + (showAnswer ? 1 : 0)) / words.length) * 100}%` }}
        />
      </div>

      {/* Score */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-lg font-bold">{score} out of {words.length} points</span>
        </div>
      </div>

      {/* Word card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-2xl font-bold text-center text-purple-600 mb-4">
          {currentWord.word}
        </h3>

        {!showAnswer ? (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">What does it mean?</p>
            <div className="space-y-3">
              {shuffledAnswers.map((answer) => (
                <button
                  key={answer}
                  onClick={() => handleAnswer(answer)}
                  className="w-full p-4 rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-left transform hover:scale-[1.02]"
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
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
                  {isCorrect ? 'Well done!' : 'Not quite right!'}
                </span>
              </div>
              <p>{currentWord.funFact}</p>
            </div>

            {!isLastWord && (
              <button
                onClick={nextWord}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                Next word
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {isLastWord && showAnswer && (
        <div className="text-center bg-purple-100 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">Game Over!</h3>
          <p className="text-lg mb-4">
            You explained {score} out of {words.length} words correctly!
          </p>
          {score === words.length ? (
            <p className="text-green-600">Fantastic! You're a vocabulary expert! 🎉</p>
          ) : score >= words.length * 0.7 ? (
            <p className="text-green-600">Well done! You know a lot! 🌟</p>
          ) : (
            <p className="text-purple-600">Keep practicing! You learn more every day! 📚</p>
          )}
        </div>
      )}
    </div>
  );
};
