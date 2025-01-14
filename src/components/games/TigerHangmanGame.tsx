import React, { useState, useEffect } from 'react';
import { tigerWords } from '../../data/hangmanWords';

interface TigerHangmanGameProps {
  onProgress: (progress: number) => void;
}

export const TigerHangmanGame: React.FC<TigerHangmanGameProps> = ({ onProgress }) => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [remainingTries, setRemainingTries] = useState(6);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  /**
   * Initialize the hangman game with a random word
   */
  const initializeGame = () => {
    const randomWord = tigerWords[Math.floor(Math.random() * tigerWords.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setRemainingTries(6);
    setGameStatus('playing');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const guessLetter = (letter: string) => {
    if (gameStatus !== 'playing') return;

    if (!guessedLetters.includes(letter)) {
      const newGuessedLetters = [...guessedLetters, letter];
      setGuessedLetters(newGuessedLetters);

      if (!word.includes(letter)) {
        const newTries = remainingTries - 1;
        setRemainingTries(newTries);
        if (newTries === 0) {
          setGameStatus('lost');
          onProgress(30); // Partial reward for participation
        }
      } else {
        // Check if the word has been completely guessed
        const isWordComplete = word.split('').every(char => newGuessedLetters.includes(char));
        if (isWordComplete) {
          setGameStatus('won');
          onProgress(100);
        }
      }
    }
  };

  const getDisplayWord = () => {
    return word.split('').map(letter => 
      guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="text-6xl font-mono mb-8">{getDisplayWord()}</div>
        
        <div className="mb-4 text-lg">
          Remaining Tries: {remainingTries}
        </div>

        {gameStatus === 'won' && (
          <div className="text-2xl text-green-600 font-bold mb-4">
            🎉 Great! You guessed the word! 🎉
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="text-xl text-red-600 mb-4">
            <p>No worries! The word was: {word}</p>
            <p className="mt-2">Try again! 🐯</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => guessLetter(letter)}
            disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
            className={`
              p-3 text-lg font-bold rounded-lg transition-colors
              ${guessedLetters.includes(letter)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
              }
              ${gameStatus !== 'playing' ? 'cursor-not-allowed' : ''}
            `}
          >
            {letter}
          </button>
        ))}
      </div>

      {gameStatus !== 'playing' && (
        <div className="text-center mt-8">
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
};
