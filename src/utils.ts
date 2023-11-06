import { Letters } from "./App/types";

export const isBlock = (l: string) => l === '-';
export const isBlank = (l: string) => l === '_';

export const mod = (n: number, m: number) => ((n % m) + m) % m;

export const getSquareSize = (letters: Letters) => {
  const size = Math.sqrt(letters.length);

  if (!Number.isInteger(size)) {
    throw new Error('Letters length must be a perfect square');
  }

  return size;
}
