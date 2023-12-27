import { useEffect, useState } from "react";
import { useControls } from "leva";
import { Letters, Square } from "./types";
import { isBlock } from "../utils";
import { isArray, isString } from "lodash";

const getLetters = (size: number) => {
  const defaultLetters = new Array<string>(size * size).fill(Square.BLANK);
  const rawLetters = localStorage.getItem(`letters:${size}`);
  if (!rawLetters) return defaultLetters;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const letters = JSON.parse(rawLetters);
    if (isArray(letters)) {
      if (letters.every(isString)) {
        return letters;
      }
    }
    console.warn("Found something other than an array of strings in 'letters' in localStorage");
    return defaultLetters;
  } catch (err) {
    console.warn("Error parsing json from 'letters' from localStorage");
    return defaultLetters;
  }
}


export const useLetterController = (size: number, cursor: number) => {
  const { mode } = useControls({ mode: { value: 'rotate', options: ['rotate', 'mirror', '------'] }});

  const [letters, setLetters] = useState<Letters>(getLetters(size));

  useEffect(() => {
    localStorage.setItem(`letters:${size}`, JSON.stringify(letters));
  }, [letters, size])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      letters.splice(cursor, 1, Square.BLANK);
      setLetters([...letters]);
    }

    if (e.code === "Minus" || e.code === 'Escape') {
      const letter = isBlock(letters[cursor]) ? Square.BLANK : Square.BLOCK;
      letters.splice(cursor, 1, letter);
      if (e.ctrlKey || (mode === 'rotate')) {
        letters.splice(letters.length - cursor - 1, 1, letter);
      }
      if (e.altKey || (mode === 'mirror')) {
        letters.splice(
          (Math.floor(cursor / size) + 1) * size - (cursor % size) - 1,
          1,
          letter
        );
      }
      setLetters([...letters]);
    }

    if (e.code.match(/^(Key[A-Z]|Digit[0-9])$/i)) {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const letter = e.code.replace("Key", "").replace("Digit", "");
      letters.splice(cursor, 1, letter);
      setLetters([...letters]);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return letters;
}
