import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState } from './types';
import { initialAnimals } from './initialAnimals';

/**
 * Zustand store for managing game state
 */
export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      animals: initialAnimals,
      stars: 10,
      language: 'de',

      setLanguage: (language) => set({ language }),

      updateAnimalStats: (id, newStats) => 
        set((state) => ({
          animals: state.animals.map((animal) =>
            animal.id === id
              ? { ...animal, ...newStats }
              : animal
          )
        })),

      addStars: (amount) => 
        set((state) => ({
          stars: state.stars + amount
        })),

      unlockAnimal: (id) => 
        set((state) => {
          const animal = state.animals.find(a => a.id === id);
          if (!animal || animal.unlocked || state.stars < animal.cost) {
            return state;
          }
          
          return {
            stars: state.stars - animal.cost,
            animals: state.animals.map(a => 
              a.id === id 
                ? { ...a, unlocked: true }
                : a
            )
          };
        }),

      decreaseStats: () => 
        set((state) => ({
          animals: state.animals.map(animal => ({
            ...animal,
            happiness: Math.max(0, animal.happiness - 2),
            hunger: Math.max(0, animal.hunger - 3),
            energy: Math.max(0, animal.energy - 1)
          }))
        }))
    }),
    {
      name: 'zoo-game-storage',
      partialize: (state) => ({ language: state.language })
    }
  )
);
