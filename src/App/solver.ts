import { Word, Letters, Solution, WordWithAnswer, Direction } from "./types";
import answerLists from '../wordList';
import { assign, cloneDeep, sample } from "lodash";
import { transpose } from "../utils";

export const solve = (size: number, across: Word[], down: Word[], maxIterations = 100000) => {
  let solution = generateSolution(size, across, down);
  let score = calculateScore(solution);
  console.log('starting score', score);

  for (let i = 0; i < maxIterations; i++) {
    if (score === 0) {
      return solution;
    }

    const t = temperature(1 - (i + 1)/maxIterations);

    const newSolution = getNeighbor(solution);
    const newScore = calculateScore(newSolution);
    const forceAccept = Math.exp(- (newScore - score)/t) >= Math.random();

    if (newScore < score || forceAccept) {
      solution = newSolution;
      score = newScore;
      continue;
    }
  }

  console.log('ending score', score);
  console.log(solution);
}

const temperature = (i: number) => {
  return i;
};

const getAnswerForWord = (word: Word | WordWithAnswer): WordWithAnswer => {
  const answer = sample(answerLists[word.word.length]);
  if (!answer) {
    console.warn(word);
    throw new Error(`Could not find candidate answer for word`);
  }

  return {
    ...word,
    answer: answer,
  }
}

const generateSolution = (size: number, across: Word[], down: Word[]): Solution => {
  const [acrossSolution, downSolution] = [across, down].map(words => {
    return words.map<WordWithAnswer>(getAnswerForWord);
  });

  return {
    size,
    [Direction.ACROSS]: acrossSolution,
    [Direction.DOWN]: downSolution,
  };
};

const getNeighbor = (solution: Solution) => {
  solution = cloneDeep(solution);
  const direction = sample([Direction.ACROSS, Direction.DOWN]);
  const word = sample(solution[direction]);
  if (!word) {
    throw new Error("Couldn't pick word to adjust");
  }
  assign(word, getAnswerForWord(word));
  return solution;
}

const calculateScore = (solution: Solution) => {
  let score = 0;

  const board: Letters = new Array(solution.size).fill('').map(l => '');

  solution.across.forEach(word => {
    if (!word.answer) {
      score += 10;
      return;
    }
    word.answer?.word.split('').forEach((l, i) => {
      board[word.index + i] = l;
    });
  });

  solution.down.forEach(word => {
    if (!word.answer) {
      score += 10;
      return;
    }

    word.answer?.word.split('').forEach((l, i) => {
      if (board[transpose(word.index + i, solution.size)] !== l) {
        score += 30;
      }
    });
  })

  return score;
}
