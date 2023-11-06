export type Letters = string[];

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
