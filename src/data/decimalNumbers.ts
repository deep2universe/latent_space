export interface DecimalTask {
  number: number;
  range: 'small' | 'large';
  hint: string;
  explanation: string;
}

export const decimalTasks: DecimalTask[] = [
  {
    number: 0.3,
    range: 'small',
    hint: "0,3 ist zwischen 0 und 1, etwas näher an 0",
    // Explanation of the decimal number's position on the number line
    explanation: "0,3 liegt genau bei 3 von 10 Schritten zwischen 0 und 1"
  },
  {
    number: 0.8,
    range: 'small',
    hint: "0.3 is between 0 and 1, slightly closer to 0",
    explanation: "0.3 is exactly at 3 out of 10 steps between 0 and 1"
  },
  {
    number: 2.5,
    range: 'large',
    hint: "2.5 is exactly in the middle between 2 and 3",
    explanation: "2.5 is the midpoint between 2 and 3"
  },
  {
    number: 4.6,
    range: 'large',
    hint: "4.6 is closer to 5 than to 4",
    explanation: "4.6 is at 6 out of 10 steps between 4 and 5"
  },
  {
    number: 1.2,
    range: 'large',
    hint: "1.2 is a little bit past 1",
    explanation: "1.2 is at 2 out of 10 steps between 1 and 2"
  }
];
