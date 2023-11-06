export type Letters = string[];
export type Numbers = (number | null)[];
export type Flags = Set<string>[];

export type UnorientedWord = {
  index: number;
  word: '';
};

export type Word = {
  index: number;
  word: string;
  number: number;
  direction: 'across' | 'down';
};
