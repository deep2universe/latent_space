export interface AnimalFact {
  question: string;
  answer: boolean;
  explanation: string;
}

/**
 * Facts about lions for the Lion Fact Game
 */
export const lionFacts: AnimalFact[] = [
  {
    question: "Lions can jump up to 8 meters!",
    answer: true,
    explanation: "Yes, that's true! Lions are very athletic and can indeed jump that far."
  },
  {
    question: "Lion cubs are born with blue eyes.",
    answer: true,
    explanation: "Correct! Their eyes change color after about 3 months."
  },
  {
    question: "Lions drink 50 liters of water every day.",
    answer: false,
    explanation: "No, that's not true! Lions drink only about 5-10 liters of water a day."
  },
  {
    question: "Lionesses are better hunters than male lions.",
    answer: true,
    explanation: "True! The lionesses do about 90% of the hunting in the pride."
  },
  {
    question: "A lion's roar can be heard up to 8 kilometers away.",
    answer: true,
    explanation: "Yes! Lions have one of the loudest roars of all cats."
  },
  {
    question: "Lions can climb trees.",
    answer: true,
    explanation: "Correct! Although they don't do it as often as leopards, lions can climb."
  },
  {
    question: "Lions eat every day.",
    answer: false,
    explanation: "No! Lions can go several days without food."
  },
  {
    question: "A lion pride consists of up to 100 animals.",
    answer: false,
    explanation: "False! A typical pride has 10-15 lions."
  }
];
