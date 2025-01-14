import React from 'react';
import { Play, Heart, Battery, Cookie } from 'lucide-react';
import { Animal } from '../store/types';

interface AnimalPanelProps {
  animal: Animal;
  onPlayGame: (gameType: string) => void;
}

/**
 * Define type-specific mood messages for each animal
 */
const moodTexts: Record<
    string,
    {
      overjoyed: string;
      good: string;
      attention: string;
      help: string;
      notWell: string;
    }
> = {
  Lion: {
    overjoyed: 'Its mane shines proudly in the sun.',
    good: 'It dozes relaxed in the shade and purrs softly.',
    attention: 'It looks expectantly over at you.',
    help: 'Its mane hangs sadly down.',
    notWell: 'It lies apathetically in the corner of its enclosure.'
  },
  Elephant: {
    overjoyed: 'It splashes happily with its trunk in the water.',
    good: 'It plays happily with its family and enjoys the day.',
    attention: 'It wags its ears restlessly.',
    help: 'Its trunk hangs dejectedly down.',
    notWell: 'It stands lonely and sad in its enclosure.'
  },
  Tiger: {
    overjoyed: 'It roars triumphantly and shows off its stripes.',
    good: 'It prowls gracefully, content with its territory.',
    attention: 'It flicks its tail, waiting for you to come closer.',
    help: 'It paces around, looking for comfort.',
    notWell: 'It hides in the shadows, refusing to move.'
  },
  Gorilla: {
    overjoyed: 'It beats its chest proudly and smiles.',
    good: 'It relaxes with its family, enjoying the moment.',
    attention: 'It glances around curiously, seeking interaction.',
    help: 'It slouches over, arms limp by its side.',
    notWell: 'It sits quietly in a corner, hardly reacting.'
  },
  Kangaroo: {
    overjoyed: 'It hops energetically around the enclosure.',
    good: 'It keeps its joey close, watching the surroundings.',
    attention: 'It stands upright, ears perked, anticipating your approach.',
    help: 'Its tail drags behind as it moves slowly.',
    notWell: 'It lies on the ground, refusing to hop.'
  },
  Penguin: {
    overjoyed: 'It waddles around happily, flapping its wings.',
    good: 'It slides on its belly, having a great time.',
    attention: 'It stands still, tilting its head with curiosity.',
    help: 'It stands with its head down, missing the camaraderie.',
    notWell: 'It remains motionless, hardly reacting to its surroundings.'
  },
  Parrot: {
    overjoyed: 'It squawks excitedly, showing off its vibrant plumage.',
    good: 'It chatters away, repeating cheerful words.',
    attention: 'It bobs its head, waiting for a new phrase to learn.',
    help: 'Its feathers droop slightly, longing for attention.',
    notWell: 'It remains silent, losing its usual color and energy.'
  },
  Frog: {
    overjoyed: 'It leaps from pad to pad with amazing vigor.',
    good: 'It croaks contently in the reeds.',
    attention: 'It peeks out of the water, eyes wide open.',
    help: 'Its leaps become shorter, lacking energy.',
    notWell: 'It stays submerged, barely emerging for air.'
  },
  Snake: {
    overjoyed: 'It slithers elegantly, flicking its tongue with content.',
    good: 'It coils comfortably, enjoying the warmth of its environment.',
    attention: 'It lifts its head, carefully watching you pass.',
    help: 'Its movements become sluggish and uncoordinated.',
    notWell: 'It lies limp, scarcely reacting to stimuli.'
  },
  Panda: {
    overjoyed: 'It rolls around playfully in the grass.',
    good: 'It munches on bamboo with a satisfied grin.',
    attention: 'It stands on its hind legs, seeking your company.',
    help: 'It half-heartedly chews on bamboo, eyes distant.',
    notWell: 'It sits hunched, ignoring the bamboo around it.'
  },
  Koala: {
    overjoyed: 'It clings to the eucalyptus with a big smile.',
    good: 'It naps peacefully, occasionally opening its eyes to check the surroundings.',
    attention: 'It stares at you with a gentle expression.',
    help: 'It moves slowly, barely clinging to the branch.',
    notWell: 'It remains listless, hugging the tree with no enthusiasm.'
  },
  Lemur: {
    overjoyed: 'It leaps from branch to branch, tail swirling with delight.',
    good: 'It sits upright, curiously inspecting the area.',
    attention: 'It uses its tail to wave at you, wanting a closer look.',
    help: 'Its leaps become weaker, tail drooping.',
    notWell: 'It hides among the leaves, reluctant to come out.'
  },
  Worm: {
    overjoyed: 'It wiggles happily, exploring every corner of its habitat.',
    good: 'It digs through the soil, content and calm.',
    attention: 'It surfaces slightly, seeking a familiar presence.',
    help: 'It barely moves, staying near the surface in need of care.',
    notWell: 'It remains limp and unresponsive, half-buried in the earth.'
  },
  Woodpecker: {
    overjoyed: 'It taps rhythmically on the trees, echoing its joy.',
    good: 'It busily pecks at the bark, searching for treats.',
    attention: 'It cocks its head, listening for your approach.',
    help: 'It pecks half-heartedly, losing its usual vigor.',
    notWell: 'It rests on a branch, hardly stirring at all.'
  },
  Mouse: {
    overjoyed: 'It scurries around cheerfully, sniffing everything in sight.',
    good: 'It nibbles on seeds contentedly, whiskers twitching.',
    attention: 'It stands on its hind legs, squeaking softly for you.',
    help: 'Its whiskers droop slightly, looking for reassurance.',
    notWell: 'It stays curled up, showing little interest in anything.'
  },
  Lynx: {
    overjoyed: 'It gracefully patrols its enclosure, ears perked.',
    good: 'It gazes calmly, flicking its tufted ears.',
    attention: 'It sits with a watchful look, waiting for your move.',
    help: 'Its ears flatten slightly, restless and uncertain.',
    notWell: 'It lies low, barely moving, eyes distant.'
  }
};

export const AnimalPanel: React.FC<AnimalPanelProps> = ({ animal, onPlayGame }) => {
  /**
   * Determine the mood message based on animal stats
   */
  const getMoodMessage = () => {
    const { happiness, hunger, energy, name, type } = animal;
    const lowestStat = Math.min(happiness, hunger, energy);

    // Fallback to 'Lion' texts if type not in dictionary
    const typeMood = moodTexts[type] || moodTexts['Lion'];

    if (lowestStat > 80) {
      return {
        text: `${name} is overjoyed! ${typeMood.overjoyed}`,
        emoji: '🌟'
      };
    }

    if (lowestStat > 60) {
      return {
        text: `${name} feels good! ${typeMood.good}`,
        emoji: '😊'
      };
    }

    if (lowestStat > 40) {
      return {
        text: `${name} could use some attention! ${typeMood.attention}`,
        emoji: '😐'
      };
    }

    if (lowestStat > 20) {
      return {
        text: `${name} needs your help! ${typeMood.help}`,
        emoji: '😢'
      };
    }

    return {
      text: `${name} is not feeling well at all! ${typeMood.notWell}`,
      emoji: '😭'
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
            <h2 className="text-xl font-bold text-white">{animal.name} the {animal.type}</h2>
          </div>
        </div>

        <div className="p-4">
          {animal.characteristics && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Characteristics:</h3>
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
                <div className="text-xs text-gray-600 mb-1">Happiness</div>
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
                <div className="text-xs text-gray-600 mb-1">Energy</div>
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
            <span>Start game</span>
          </button>
        </div>
      </div>
  );
};
