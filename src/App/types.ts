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

export enum Square {
  BLOCK = '-',
  BLANK = '_',
}

export type Words = {
  across: Word[];
  down: Word[];
  numbers: Numbers;
  flags: Flags;
};

export type Rectangle = {
  index: number;
  width: number;
  height: number;
};
