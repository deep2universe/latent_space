export interface Animal {
  id: number;
  name: string;
  type: string;
  image: string;
  game: string;
  happiness: number;
  hunger: number;
  energy: number;
  facts: string[];
  unlocked: boolean;
  cost: number;
  characteristics?: string[];
  worldId: string;
}

export interface GameState {
  animals: Animal[];
  stars: number;
  language: 'de' | 'en' | 'es' | 'fr' | 'ja';
  addStars: (amount: number) => void;
  updateAnimalStats: (id: number, stats: Partial<Animal>) => void;
  unlockAnimal: (id: number) => void;
  decreaseStats: () => void;
  setLanguage: (lang: 'de' | 'en' | 'es' | 'fr' | 'ja') => void;
}

export interface Point {
  x: number;
  y: number;
}

export interface Translation {
  [key: string]: {
    de: string;
    en: string;
    es: string;
    fr: string;
    ja: string;
  };
}
