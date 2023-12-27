import { orderBy } from "lodash";
import { addAll, getSquareSize, gridify, isBlock, transpose, transposeArray } from "../utils";
import { Letters, Numbers, Rectangle, UnorientedWord, Word } from "./types";

export const getWordNumbers = (letters: Letters): Numbers => {
  const size = getSquareSize(letters);

  let count = 1;
  const numbers = letters.map((letter, i) => {
    if (isBlock(letter)) return null;

    if (
      i < size ||
      i % size === 0 ||
      isBlock(letters[i - 1]) ||
      isBlock(letters[i - size])
    ) {
      return count++;
    }
    return null;
  });

  return numbers;
};

const _getWords = (letters: Letters) => {
  const size = getSquareSize(letters);

  const words = letters.reduce<UnorientedWord[]>((words, letter, index) => {
    if (isBlock(letter)) {
      return words;
    }

    if (isBlock(letters[index - 1]) || index % size === 0) {
      words.push({
        index,
        word: "",
      });
    }

    words[words.length - 1].word += letter;

    return words;
  }, []);

  return words;
};

export const getWords = (letters: Letters, numbers: Numbers) => {
  const size = getSquareSize(letters);

  const across = _getWords(letters).map<Word>((word) => {
    const number = numbers[word.index];

    if (!number) {
      console.warn("across", word, word.word.length);
      throw new Error(`Un-numbered word ${JSON.stringify(word)}`);
    }

    return {
      ...word,
      number: number ?? -1,
      direction: "across",
    };
  });

  const transposedLetters = transposeArray(letters, size);

  const down = _getWords(transposedLetters).map<Word>((word) => {
    word.index = transpose(word.index, size);
    const number = numbers[word.index];

    if (!number) {
      console.warn("down", word, word.word.length);
      throw new Error(`Un-numbered word ${JSON.stringify(word)}`);
    }

    return {
      ...word,
      number: number ?? -1,
      direction: "down",
    };
  });

  const flags = getFlags(letters, across, down);

  return {
    flags,
    across: orderBy(across, "number"),
    down: orderBy(down, "number"),
  };
};

type FlagsOptions = {
  minWordLength?: number;
  maxOverlap?: number;
  maxRectSizes?: number[][];
};

const getRectFlags = (letters: Letters, options: FlagsOptions = {}) => {
  const { maxRectSizes = [[7, 2], [5, 4], [4, 4]] } = options;

  const rectSizes = maxRectSizes.reduce((sizes, rect) => {
    const x = Math.min(...rect), y = Math.max(...rect);
    sizes[x] = sizes[x] ? Math.max(sizes[x], y) : y;
    return sizes;
  }, []);

  const oversizedRectangles: Rectangle[] = [];
  const letterGrid = gridify(letters);
  letterGrid.forEach((row, i) => {
    row.forEach((_l, j) => {
      rectSizes.forEach((d1, d2) => {
        if (!d1 || d1 >= row.length || d2 >= row.length) return;

        const variants = d1 === d2 ? [[d1 + 1, d2], [d1, d2 + 1]] : [
          [d1 + 1, d2], [d1, d2 + 1],
          [d2 + 1, d1], [d2, d1 + 1]
        ];

        variants.forEach(([w, h]) => {
          for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
              if (isBlock(letterGrid[i + y]?.[j + x])) return;
            }
          }

          oversizedRectangles.push({
            index: i * row.length + j,
            width: w,
            height: h,
          });
        });
      })
    });
  });

  const flags = [...letters].map(() => new Set<string>());

  oversizedRectangles.forEach(({ index, width, height }) => {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        flags[index + i * letterGrid.length + j].add('rect');
      }
    }
  });

  return flags;
}

const getFlags = (
  letters: Letters,
  across: Word[],
  down: Word[],
  options: FlagsOptions = {}
) => {
  const { minWordLength = 2 } = options;
  const size = getSquareSize(letters);
  const flags = [...letters].map(() => new Set<string>());

  getRectFlags(letters, options).forEach((newFlags, i) => {
    addAll(flags[i], newFlags);
  });

  across.forEach((word) => {
    if (word.word.length <= minWordLength) {
      console.warn("short word", word);
      for (let i = 0; i < word.word.length; i++) {
        flags[word.index + i].add("short");
      }
    }
  });

  const transposedFlags = transposeArray(flags, size);

  down.forEach((word) => {
    word.index = transpose(word.index, size);
    if (word.word.length < 3) {
      console.warn("short word", word);
      for (let i = 0; i < word.word.length; i++) {
        transposedFlags[word.index + i].add("short");
      }
    }
  });

  return transposeArray(transposedFlags, size);
};
