import React, { useState } from 'react';
import { GameOverlay } from './components/GameOverlay';
import { AnimalPanel } from './components/AnimalPanel';
import { HUD } from './components/HUD';
import { Shop } from './components/Shop';
import { ZooWorld } from './components/ZooWorld';
import { useGameStore } from './store/gameStore';
import { uploadInitialAnimals } from './initializeData';

const GAME_DURATION = 30 * 60;

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [currentAnimalId, setCurrentAnimalId] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [viewMode, setViewMode] = useState<'cards' | 'world'>('world');
  const { animals, decreaseStats, updateAnimalStats, addStars } = useGameStore();

  /**
   * Effect to handle the game timer
   */
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const statsInterval = setInterval(decreaseStats, 30000);
    return () => clearInterval(statsInterval);
  }, [decreaseStats]);

  const startGame = (gameType: string, animalId: number) => {
    updateAnimalStats(animalId, {
      happiness: 100,
      energy: 100,
      hunger: 100
    });
    addStars(3);
    
    setCurrentGame(gameType);
    setCurrentAnimalId(animalId);
    setShowOverlay(true);
  };

  const unlockedAnimals = animals.filter(animal => animal.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100">
      <header className="bg-white shadow-md p-4 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-600">
            Mein magischer Zoo
          </h1>
          <button 
            onClick={uploadInitialAnimals}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition-colors"
          >
            Initialize Database
          </button>
        </div>
      </header>

      <div className="fixed top-4 right-4 z-20">
        <HUD 
          timeLeft={timeLeft} 
          onShopClick={() => setShowShop(true)}
          viewMode={viewMode}
          onViewModeChange={() => setViewMode(prev => prev === 'cards' ? 'world' : 'cards')}
        />
      </div>

      <main className={viewMode === 'cards' 
        ? 'pt-20 min-h-screen pb-8' 
        : 'h-screen pt-16'
      }>
        {viewMode === 'cards' ? (
          <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedAnimals.map(animal => (
              <AnimalPanel 
                key={animal.itemid}
                animal={animal}
                onPlayGame={(gameType) => startGame(gameType, animal.itemid)}
              />
            ))}
          </div>
        ) : (
          <ZooWorld onPlayGame={startGame} />
        )}
      </main>

      {showOverlay && currentGame && currentAnimalId && (
        <GameOverlay
          gameType={currentGame}
          animalId={currentAnimalId}
          onClose={() => setShowOverlay(false)}
        />
      )}

      {showShop && <Shop onClose={() => setShowShop(false)} />}
    </div>
  );
}

export default App;
