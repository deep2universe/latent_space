export interface MemoryCard {
  id: number;
  name: string;
  image: string;
  description: string;
}

/**
 * Memory cards for the Elephant Memory Game
 */
export const elephantMemoryCards: MemoryCard[] = [
  {
    id: 1,
    name: "Baby Elephant",
    image: "https://latent-space.s3.us-east-1.amazonaws.com/elephant_1.jpg",
    description: "A cute baby elephant"
  },
  {
    id: 2,
    name: "Elephant Family",
    image: "https://latent-space.s3.us-east-1.amazonaws.com/elephant_2.jpg",
    description: "A happy elephant family"
  },
  {
    id: 3,
    name: "Playing Elephant",
    image: "https://latent-space.s3.us-east-1.amazonaws.com/elephant_3.jpg",
    description: "An elephant playing in the water"
  },
  {
    id: 4,
    name: "Sleeping Elephant",
    image: "https://latent-space.s3.us-east-1.amazonaws.com/elephant_4.jpg",
    description: "A relaxed sleeping elephant"
  },
  {
    id: 5,
    name: "Elephant Friends",
    image: "https://latent-space.s3.us-east-1.amazonaws.com/elephant_5.jpg",
    description: "Two elephant friends"
  },
  {
    id: 6,
    name: "Elephant Parade",
    image: "https://latent-space.s3.us-east-1.amazonaws.com/elephant_6.jpg",
    description: "A parade of elephants"
  }
];
