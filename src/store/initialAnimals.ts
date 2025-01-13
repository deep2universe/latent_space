import { Animal } from './types';

export const initialAnimals: Animal[] = [
  {
    itemid: 1,
    name: 'Leo',
    type: 'Lion',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop',
    game: 'facts',
    happiness: 80,
    hunger: 70,
    energy: 90,
    unlocked: true,
    cost: 0,
    // Characteristics and facts about the animal
    characteristics: [
      'Majestic and strong',
      'Loves to doze in the sun',
      'Protects its pride'
    ],
    facts: [
      'Can jump up to 8 meters',
      'Has the loudest roar of all cats',
      'Sleeps up to 20 hours a day'
    ],
    worldId: 'default'
  },
  {
    itemid: 2,
    name: 'Ella',
    type: 'Elephant',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop',
    game: 'memory',
    happiness: 85,
    hunger: 75,
    energy: 85,
    unlocked: true,
    cost: 0,
    characteristics: [
      'Very intelligent and curious',
      'Has an excellent memory',
      'Cares lovingly for her family'
    ],
    facts: [
      'Can use tools with her trunk',
      'Loves to bathe and splash',
      'Communicates over long distances'
    ],
    worldId: 'default'
  },
  {
    itemid: 3,
    name: 'Raja',
    type: 'Tiger',
    image: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=800&auto=format&fit=crop',
    game: 'hangman',
    happiness: 90,
    hunger: 80,
    energy: 95,
    unlocked: false,
    cost: 5,
    characteristics: [
      'Elegant and powerful',
      'Excellent swimmer',
      'Loves water'
    ],
    facts: [
      'Can swim very well',
      'Has perfect night vision',
      'Every tiger has a unique stripe pattern'
    ],
    worldId: 'default'
  },
  {
    itemid: 4,
    name: 'Koko',
    type: 'Gorilla',
    image: 'https://files.worldwildlife.org/wwfcmsprod/images/Mountain_Gorilla_Silverback_WW22557/hero_full/cg47pknak_Mountain_Gorilla_Silverback_WW22557.jpg',
    game: 'vocabulary',
    happiness: 75,
    hunger: 85,
    energy: 80,
    unlocked: false,
    cost: 8,
    characteristics: [
      'Very intelligent and gentle',
      'Lives in family groups',
      'Loves to learn new words'
    ],
    facts: [
      'Can learn sign language',
      'Is a herbivore',
      'Lives in family groups'
    ],
    worldId: 'default'
  },
  {
    itemid: 5,
    name: 'Hoppi',
    type: 'Kangaroo',
    image: 'https://images.unsplash.com/photo-1579168765467-3b235f938439?w=800&auto=format&fit=crop',
    game: 'quiz',
    happiness: 95,
    hunger: 70,
    energy: 100,
    unlocked: false,
    cost: 6,
    characteristics: [
      'Jumps up to 9 meters',
      'Carries babies in the pouch',
      'Loves solving puzzles'
    ],
    facts: [
      'Cannot hop backwards',
      'Has a pouch for the baby',
      'Lives in Australia'
    ],
    worldId: 'default'
  },
  {
    itemid: 6,
    name: 'Charlie',
    type: 'Penguin',
    image: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=800&auto=format&fit=crop',
    game: 'math',
    happiness: 85,
    hunger: 90,
    energy: 75,
    unlocked: false,
    cost: 7,
    characteristics: [
      'Excellent swimmer',
      'Very sociable',
      'Loves math problems'
    ],
    facts: [
      'Can dive up to 100 meters deep',
      'Stays loyal to its partner',
      'Lives in large colonies'
    ],
    worldId: 'default'
  },
  {
    itemid: 7,
    name: 'Polly',
    type: 'Parrot',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop',
    game: 'decimal',
    happiness: 100,
    hunger: 85,
    energy: 90,
    unlocked: false,
    cost: 5,
    characteristics: [
      'Can mimic words',
      'Very colorful',
      'Loves numbers and mathematics'
    ],
    facts: [
      'Enjoys learning new numbers',
      'Can count to 100',
      'Is a math genius'
    ],
    worldId: 'default'
  },
  {
    itemid: 8,
    name: 'Hüpfi',
    type: 'Frog',
    image: 'https://cdn.pixabay.com/photo/2014/10/05/11/26/tree-frog-474949_1280.jpg',
    game: 'frogger',
    happiness: 95,
    hunger: 80,
    energy: 100,
    unlocked: false,
    cost: 4,
    characteristics: [
      'Skilled jumper',
      'Master of crossing roads',
      'Loves adventures'
    ],
    facts: [
      'Can jump 30 times its body weight',
      'Has a sticky tongue for catching insects',
      'Is an excellent swimmer'
    ],
    worldId: 'default'
  },
  {
    itemid: 9,
    name: 'Slinky',
    type: 'Snake',
    image: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&auto=format&fit=crop',
    game: 'snake',
    happiness: 90,
    hunger: 75,
    energy: 95,
    unlocked: false,
    cost: 6,
    characteristics: [
      'Sleek and fast',
      'Master of precision',
      'Loves futuristic games'
    ],
    facts: [
      'Can move perfectly through tight spaces',
      'Has an excellent sense of direction',
      'Is a patient hunter'
    ],
    worldId: 'default'
  },
  {
    itemid: 10,
    name: 'Bamboo',
    type: 'Panda',
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&auto=format&fit=crop',
    game: 'soccer',
    happiness: 95,
    hunger: 85,
    energy: 90,
    unlocked: false,
    cost: 5,
    characteristics: [
      'Playful and skillful',
      'Master of soccer',
      'Loves to dribble'
    ],
    facts: [
      'Can be very agile despite its size',
      'Has amazing ball control',
      'Trains its shooting technique daily'
    ],
    worldId: 'default'
  },
  {
    itemid: 11,
    name: 'Karl',
    type: 'Koala',
    image: 'https://images.unsplash.com/photo-1579168765467-3b235f938439?w=800&auto=format&fit=crop',
    game: 'drawing',
    happiness: 90,
    hunger: 85,
    energy: 95,
    unlocked: false,
    cost: 4,
    characteristics: [
      'Creative art critic',
      'Loves colorful drawings',
      'Has a great sense of humor'
    ],
    facts: [
      'Can look at art for hours',
      'Loves to make others laugh',
      'Has an eye for details'
    ],
    worldId: 'default'
  },
  {
    itemid: 12,
    name: 'Lemi',
    type: 'Lemur',
    image: 'https://images.unsplash.com/photo-1582462232426-9b262ba04d81?w=800&auto=format&fit=crop',
    game: 'physics',
    happiness: 90,
    hunger: 85,
    energy: 95,
    unlocked: false,
    cost: 5,
    characteristics: [
      'Skilled physicist',
      'Loves coconuts',
      'Master of gravity'
    ],
    facts: [
      'Can draw lines perfectly',
      'Understands the laws of physics',
      'Passionately collects coconuts'
    ],
    worldId: 'default'
  },
  {
    itemid: 13,
    name: 'Wiggy',
    type: 'Worm',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop',
    game: 'worms',
    happiness: 95,
    hunger: 80,
    energy: 90,
    unlocked: false,
    cost: 4,
    characteristics: [
      'Master of mathematics',
      'Expert in hide and seek',
      'Loves to count friends'
    ],
    facts: [
      'Can slither through the tightest gaps',
      'Has an excellent sense of direction',
      'Is a patient observer'
    ],
    worldId: 'default'
  },
  {
    itemid: 14,
    name: 'Woody',
    type: 'Woodpecker',
    image: 'https://images.unsplash.com/photo-1592170577795-907fad001a7c?w=800&auto=format&fit=crop',
    game: 'trees',
    happiness: 90,
    hunger: 85,
    energy: 95,
    unlocked: false,
    cost: 5,
    characteristics: [
      'Sharp-eyed observer',
      'Loves forest adventures',
      'Enjoys counting trees'
    ],
    facts: [
      'Has a perfect overview of the forest',
      'Knows every tree personally',
      'Is an expert in forest mathematics'
    ],
    worldId: 'default'
  },
  {
    itemid: 15,
    name: 'Mazy',
    type: 'Mouse',
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&auto=format&fit=crop',
    game: 'maze',
    happiness: 95,
    hunger: 85,
    energy: 90,
    unlocked: false,
    cost: 6,
    characteristics: [
      'Skilled maze runner',
      'Loves tricky paths',
      'Has an excellent sense of direction'
    ],
    facts: [
      'Always finds the right way',
      'Can remember any maze',
      'Is a master of precision'
    ],
    worldId: 'default'
  },
  {
    itemid: 16,
    name: 'Lexi',
    type: 'Lynx',
    image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&auto=format&fit=crop',
    game: 'letters',
    happiness: 95,
    hunger: 85,
    energy: 90,
    unlocked: false,
    cost: 7,
    characteristics: [
      'Skilled letter hunter',
      'Loves language games',
      'Has a fondness for the ABC'
    ],
    facts: [
      'Can recognize letters from a great distance',
      'Passionately collects words',
      'Is an expert in spelling'
    ],
    worldId: 'default'
  }
];
