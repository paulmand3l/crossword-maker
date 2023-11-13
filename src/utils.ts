import { Letters, Square } from "./App/types";

export const isBlock = (l: string) =>
  l === Square.BLOCK || typeof l === "undefined";
export const isBlank = (l: string) => l === Square.BLANK;

export const mod = (n: number, m: number) => ((n % m) + m) % m;

export const getSquareSize = (letters: Letters) => {
  const size = Math.sqrt(letters.length);

  if (!Number.isInteger(size)) {
    throw new Error("Letters length must be a perfect square");
  }

  return size;
};

export const addAll = <T>(set: Set<T>, iterable: Iterable<T>) => {
  for (const item of iterable) {
    set.add(item);
  }
};

export const transpose = (i: number, size: number) => {
  const row = Math.floor(i / size);
  const col = i % size;
  return row + col * size;
};

export const transposeArray = <T>(list: T[], size: number) =>
  list.map((_l, i) => list[transpose(i, size)]);

export const gridify = (letters: Letters) => {
  const size = getSquareSize(letters);
  const letterGrid = new Array(size).fill(null).map(() => new Array<string>(size).fill(Square.BLANK));
  letters.forEach((l, i) => {
    const row = Math.floor(i / size);
    const col = i % size;
    letterGrid[row][col] = l;
  });
  return letterGrid;
}
