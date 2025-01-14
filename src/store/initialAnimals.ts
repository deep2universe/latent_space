import { Animal } from './types';

export const initialAnimals: Animal[] = [
  {
    itemid: 1,
    name: 'Leo',
    type: 'Lion',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Lion.png',
    game: 'facts',
    happiness: 80,
    hunger: 70,
    energy: 90,
    unlocked: true,
    cost: 0,
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
    world_id: 'default'
  },
  {
    itemid: 2,
    name: 'Ella',
    type: 'Elephant',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Elephant.png',
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
    world_id: 'default'
  },
  {
    itemid: 3,
    name: 'Raja',
    type: 'Tiger',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Tiger.png',
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
    world_id: 'default'
  },
  {
    itemid: 4,
    name: 'Koko',
    type: 'Gorilla',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Gorilla.png',
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
    world_id: 'default'
  },
  {
    itemid: 5,
    name: 'Hoppi',
    type: 'Kangaroo',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Kangaroo.png',
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
    world_id: 'default'
  },
  {
    itemid: 6,
    name: 'Charlie',
    type: 'Penguin',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Penguin.png',
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
    world_id: 'default'
  },
  {
    itemid: 7,
    name: 'Polly',
    type: 'Parrot',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Parrot.png',
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
    world_id: 'default'
  },
  {
    itemid: 8,
    name: 'Hüpfi',
    type: 'Frog',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Frog.png',
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
    world_id: 'default'
  },
  {
    itemid: 9,
    name: 'Slinky',
    type: 'Snake',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Snake.png',
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
    world_id: 'default'
  },
  {
    itemid: 10,
    name: 'Bamboo',
    type: 'Panda',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Panda.png',
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
    world_id: 'default'
  },
  {
    itemid: 11,
    name: 'Karl',
    type: 'Koala',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Koala.png',
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
    world_id: 'default'
  },
  {
    itemid: 12,
    name: 'Lemi',
    type: 'Lemur',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Lemur.png',
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
    world_id: 'default'
  },
  {
    itemid: 13,
    name: 'Wiggy',
    type: 'Worm',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Worm.png',
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
    world_id: 'default'
  },
  {
    itemid: 14,
    name: 'Woody',
    type: 'Woodpecker',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Woodpecker.png',
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
    world_id: 'default'
  },
  {
    itemid: 15,
    name: 'Mazy',
    type: 'Mouse',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Mouse.png',
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
    world_id: 'default'
  },
  {
    itemid: 16,
    name: 'Lexi',
    type: 'Lynx',
    image: 'https://latent-space.s3.us-east-1.amazonaws.com/Lynx.png',
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
    world_id: 'default'
  }
];
