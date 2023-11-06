import { orderBy } from 'lodash';
import { getSquareSize, isBlock } from "../utils";
import { Letters, UnorientedWord, Word } from "./types";

const getWordNumbers = (letters: Letters) => {
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

    if (isBlock(letters[index-1]) || (index % size === 0)) {
      words.push({
        index,
        word: '',
      });
    }

    words[words.length - 1].word += letter;

    return words;
  }, []);

  return words;
}

const transpose = (i: number, size: number) => {
  const row = Math.floor(i / size);
  const col = i % size;
  return row + col * size;
}

export const getWords = (letters: Letters) => {
  const size = getSquareSize(letters);
  const numbers = getWordNumbers(letters);
  const flags = [...letters].map(() => new Set<string>());

  const across = _getWords(letters).map<Word>(word => {
    const number = numbers[word.index]

    if (!number) {
      console.warn('across', word, word.word.length);
      // throw new Error(`Un-numbered word ${JSON.stringify(word)}`);
    }

    if (word.word.length < 2) {
      console.warn('short word', word);
      for (let i = 0; i < word.word.length; i++) {
        console.log(word.index + i, word.word.length)
        flags[word.index + i].add('short');
      }
    }

    return {
      ...word,
      number: number ?? -1,
      direction: 'across',
    }
  });

  const transposedLetters = letters.map((_l, i) => letters[transpose(i, size)]);

  const down = _getWords(transposedLetters).map<Word>(word => {
    word.index = transpose(word.index, size);
    const number = numbers[word.index]

    if (!number) {
      console.warn('down', word, word.word.length);
      // throw new Error(`Un-numbered word ${JSON.stringify(word)}`);
    }

    if (word.word.length < 2) {
      for (let i = 0; i < word.word.length; i++) {
        flags[word.index + i].add('short');
      }
    }

    return {
      ...word,
      number: number ?? -1,
      direction: 'down',
    }
  })

  return {
    numbers,
    flags,
    across: orderBy(across, 'number'),
    down: orderBy(down, 'number')
  };
}
