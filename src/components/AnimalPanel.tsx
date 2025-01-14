import React from 'react';
import { Play, Heart, Battery, Cookie } from 'lucide-react';
import { Animal } from '../store/types';

interface AnimalPanelProps {
  animal: Animal;
  onPlayGame: (gameType: string) => void;
}

export const AnimalPanel: React.FC<AnimalPanelProps> = ({ animal, onPlayGame }) => {
  /**
   * Determine the mood message based on animal stats
   */
  const getMoodMessage = () => {
    const { happiness, hunger, energy, name } = animal;
    const lowestStat = Math.min(happiness, hunger, energy);
    
    if (lowestStat > 80) {
      return {
        text: `${name} is overjoyed! ${
          animal.type === 'Lion'
            ? 'Its mane shines proudly in the sun.'
            : 'It splashes happily with its trunk in the water.'
        }`,
        emoji: "🌟"
      };
    }
    
    if (lowestStat > 60) {
      return {
        text: `${name} feels good! ${
          animal.type === 'Lion'
            ? 'It dozes relaxed in the shade and purrs softly.'
            : 'It plays happily with its family and enjoys the day.'
        }`,
        emoji: "😊"
      };
    }
    
    if (lowestStat > 40) {
      return {
        text: `${name} could use some attention! ${
          animal.type === 'Lion'
            ? 'It looks expectantly over at you.'
            : 'It wags its ears restlessly.'
        }`,
        emoji: "😐"
      };
    }
    
    if (lowestStat > 20) {
      return {
        text: `${name} needs your help! ${
          animal.type === 'Lion'
            ? 'Its mane hangs sadly down.'
            : 'Its trunk hangs dejectedly down.'
        }`,
        emoji: "😢"
      };
    }
    
    return {
      text: `${name} is not feeling well at all! ${
        animal.type === 'Lion'
          ? 'It lies apathetically in the corner of its enclosure.'
          : 'It stands lonely and sad in its enclosure.'
      }`,
      emoji: "😭"
    };
  };

  const mood = getMoodMessage();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02]">
      <div className="relative h-48">
        <img 
          src={animal.image} 
          alt={animal.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h2 className="text-xl font-bold text-white">{animal.name} der {animal.type}</h2>
        </div>
      </div>
      
      <div className="p-4">
        {animal.characteristics && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">Charaktereigenschaften:</h3>
            <ul className="text-sm text-purple-600 space-y-1">
              {animal.characteristics.map((trait, index) => (
                <li key={index}>• {trait}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Glück</div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-pink-500 rounded-full transition-all"
                  style={{ width: `${animal.happiness}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-amber-500" />
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Hunger</div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${animal.hunger}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-green-500" />
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Energie</div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${animal.energy}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{mood.emoji}</span>
            <p className="text-sm text-gray-600">{mood.text}</p>
          </div>
        </div>

        <button
          onClick={() => onPlayGame(animal.game)}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Spiel starten</span>
        </button>
      </div>
    </div>
  );
};
