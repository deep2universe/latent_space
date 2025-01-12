export interface MathProblem {
  question: string;
  answer: number;
  explanation: string;
  hint?: string;
}

export const mathProblems: MathProblem[] = [
  {
    question: "Charlie finds 23 blue and 15 red shells on the beach. How many shells does he have in total?",
    answer: 38,
    explanation: "Great! 23 + 15 = 38 shells. That's going to be a nice collection! 🐚",
    hint: "First count the blue shells: 23. Then add 15 red ones. So, add them up!"
  },
  {
    question: "There are 45 fish in the penguin enclosure. The penguins eat 12 of them for breakfast. How many fish are left?",
    answer: 33,
    explanation: "Correct! 45 - 12 = 33 fish are still there. That's enough for many hungry beaks! 🐟",
    hint: "There were 45 fish. 12 were eaten. So, you need to subtract 12 from 45!"
  },
  {
    question: "There are 28 penguins on an ice floe. 19 more join them. How many penguins are there now?",
    answer: 47,
    explanation: "Great! 28 + 19 = 47 penguins. That's a real penguin party! 🐧",
    hint: "There were 28 penguins first. Then more joined. So, add them up!"
  },
  {
    question: "Charlie has 50 snowballs. He throws 24 of them in the snowball game. How many does he have left?",
    answer: 26,
    explanation: "Exactly! 50 - 24 = 26 snowballs. That was a fun game! ⛄",
    hint: "Charlie had 50 snowballs and threw some away. So, you need to subtract!"
  },
  {
    question: "31 penguins are playing on the beach. 27 more come out of the water. How many are there in total?",
    answer: 58,
    explanation: "Great! 31 + 27 = 58 penguins. It's getting crowded on the beach! 🏖️",
    hint: "More penguins join those on the beach. So, add them up!"
  },
  {
    question: "There are 67 penguins in the water park. 35 go home. How many are still there?",
    answer: 32,
    explanation: "Correct! 67 - 35 = 32 penguins. The others are resting! 😴",
    hint: "Some of the penguins leave. So, subtract!"
  },
  {
    question: "Charlie collects 46 small and 13 large stones for his nest. How many stones does he have in total?",
    answer: 59,
    explanation: "Great! 46 + 13 = 59 stones. That's going to be a great nest! 🪨",
    hint: "Charlie found small and large stones. Add both numbers together!"
  },
  {
    question: "82 fish are swimming in the tank. 41 swim away. How many remain in the tank?",
    answer: 41,
    explanation: "Great! 82 - 41 = 41 fish. Half of them are still there! 🐠",
    hint: "Some of the fish swim away. So, subtract!"
  },
  {
    question: "Charlie has 37 feathers. His friend gives him 22 more. How many does he have now?",
    answer: 59,
    explanation: "Great! 37 + 22 = 59 feathers. Charlie can make his nest nice and soft with them! 🪶",
    hint: "Charlie gets more feathers. So, add them up!"
  },
  {
    question: "There are 54 chicks in the penguin kindergarten. 23 are taking a nap. How many are still awake?",
    answer: 31,
    explanation: "Correct! 54 - 23 = 31 chicks are still awake! 🐥",
    hint: "Some of the chicks are sleeping. You need to subtract them from the total!"
  },
  {
    question: "25 penguins are standing to the left of the rock, 34 to the right. How many penguins are there in total?",
    answer: 59,
    explanation: "Great! 25 + 34 = 59 penguins. A big penguin gathering! 🗿",
    hint: "Count all the penguins together. Add those from the left and right!"
  },
  {
    question: "Charlie has 73 ice cubes. 38 melt in the sun. How many are left?",
    answer: 35,
    explanation: "Perfect! 73 - 38 = 35 ice cubes. The others have turned to water! 🧊",
    hint: "Some of Charlie's ice cubes melt away. So, subtract!"
  }
];
