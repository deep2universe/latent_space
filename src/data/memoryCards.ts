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
    image: "https://images.unsplash.com/photo-1603483080228-04f2313d9f10?w=400&auto=format&fit=crop",
    description: "A cute baby elephant"
  },
  {
    id: 2,
    name: "Elephant Family",
    image: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&auto=format&fit=crop",
    description: "A happy elephant family"
  },
  {
    id: 3,
    name: "Playing Elephant",
    image: "https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=400&auto=format&fit=crop",
    description: "An elephant playing in the water"
  },
  {
    id: 4,
    name: "Sleeping Elephant",
    image: "https://www.sueddeutsche.de/2022/06/20/20f13250-8838-4f58-8483-ea1c53b7eefe.jpeg?q=60&fm=avif&width=1536&rect=0%2C447%2C1100%2C620",
    description: "A relaxed sleeping elephant"
  },
  {
    id: 5,
    name: "Elephant Friends",
    image: "https://images.unsplash.com/photo-1578326457399-3b34dbbf23b8?w=400&auto=format&fit=crop",
    description: "Two elephant friends"
  },
  {
    id: 6,
    name: "Elephant Parade",
    image: "https://yt3.googleusercontent.com/_2XCLuV2asB43YaYyBoXu8cGcWvTV_fXrkigl0ADpd1AX9ljDRlfP1J-Xf67d4tAl_J7b3wIETU=s160-c-k-c0x00ffffff-no-rj",
    description: "A parade of elephants"
  }
];
