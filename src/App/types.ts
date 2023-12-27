export type Letters = string[];
export type Numbers = (number | null)[];
export type Flags = Set<string>[];

export type Answer = {
  word: string;
  popularity: number;
};

export type UnorientedWord = {
  index: number;
  word: '';
};

export enum Direction {
  ACROSS = 'across',
  DOWN = 'down',
}

export type Word = {
  index: number;
  word: string;
  number: number;
  direction: Direction;
};

export type WordWithAnswer = Word & {
  answer: Answer;
};

export type Solution = {
  size: number;
  [Direction.ACROSS]: WordWithAnswer[];
  [Direction.DOWN]: WordWithAnswer[];
};

export enum Square {
  BLOCK = '-',
  BLANK = '_',
}

export type Annotations = {
  numbers: Numbers;
  flags: Flags;
};

export type Rectangle = {
  index: number;
  width: number;
  height: number;
};
