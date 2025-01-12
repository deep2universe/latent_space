import React, { useState, useEffect } from 'react';
import { kangarooQuestions, QuizQuestion } from '../../data/kangarooQuiz';
import { Star, ThumbsUp, ThumbsDown, ArrowRight, HelpCircle } from 'lucide-react';

interface KangarooQuizGameProps {
  onProgress: (progress: number) => void;
}

export const KangarooQuizGame: React.FC<KangarooQuizGameProps> = ({ onProgress }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle questions at the start of the game
    setQuestions([...kangarooQuestions].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      // Mische die Antworten für die aktuelle Frage
      const currentQuestion = questions[currentQuestionIndex];
      const answers = [
        currentQuestion.correctAnswer,
        ...currentQuestion.wrongAnswers
      ].sort(() => Math.random() - 0.5);
      setShuffledAnswers(answers);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    // Aktualisiere den Fortschritt
    const progress = ((score + (answer === questions[currentQuestionIndex].correctAnswer ? 1 : 0)) / questions.length) * 100;
    onProgress(progress);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Fortschrittsbalken */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-full bg-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + (showAnswer ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Punktestand */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-lg font-bold">{score} von {questions.length} Punkten</span>
        </div>
      </div>

      {/* Fragekarte */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-center text-purple-600 mb-6">
          {currentQuestion.question}
        </h3>

        {!showAnswer ? (
          <div className="space-y-3">
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                className="w-full p-4 rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-left transform hover:scale-[1.02]"
              >
                {answer}
              </button>
            ))}
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
                  {isCorrect ? 'Hoppi hüpft vor Freude!' : `Die richtige Antwort ist: ${currentQuestion.correctAnswer}`}
                </span>
              </div>
              <p className="mt-2">{currentQuestion.funFact}</p>
            </div>

            {!isLastQuestion && (
              <button
                onClick={nextQuestion}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                Nächste Frage
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {isLastQuestion && showAnswer && (
        <div className="text-center bg-purple-100 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">Spiel beendet!</h3>
          <p className="text-lg mb-4">
            Du hast {score} von {questions.length} Fragen richtig beantwortet!
          </p>
          {score === questions.length ? (
            <p className="text-green-600">Fantastisch! Du bist ein echter Känguru-Experte! 🦘✨</p>
          ) : score >= questions.length * 0.7 ? (
            <p className="text-green-600">Super gemacht! Du weißt schon sehr viel über Kängurus! 🦘</p>
          ) : (
            <p className="text-purple-600">Weiter so! Jetzt kennst du schon viele spannende Känguru-Fakten! 📚</p>
          )}
        </div>
      )}
    </div>
  );
};
