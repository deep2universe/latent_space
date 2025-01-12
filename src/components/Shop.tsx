import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Star, X } from 'lucide-react';

export const Shop: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { animals, stars, unlockAnimal } = useGameStore();
  const lockedAnimals = animals.filter(animal => !animal.unlocked);

  /**
   * Handle unlocking an animal and close the shop
   */
  const handleUnlock = (id: number) => {
    unlockAnimal(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-purple-600">Tierhandlung</h2>
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold">{stars}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Schließen"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedAnimals.map(animal => (
              <div key={animal.id} className="bg-gray-50 rounded-lg p-4 flex flex-col">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={animal.image} 
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">
                  {animal.name} der {animal.type}
                </h3>

                <div className="space-y-2 mb-4 flex-1">
                  {animal.characteristics?.map((trait, index) => (
                    <p key={index} className="text-sm text-gray-600">• {trait}</p>
                  ))}
                </div>

                <button
                  onClick={() => handleUnlock(animal.id)}
                  disabled={stars < animal.cost}
                  className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    stars >= animal.cost
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>{animal.cost} Sterne</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
