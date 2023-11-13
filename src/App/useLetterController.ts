import { useEffect, useState } from "react";
import { useControls } from "leva";
import { Letters, Square } from "./types";
import { isBlock } from "../utils";


export const useLetterController = (size: number, cursor: number) => {
  const { mode } = useControls({ mode: { value: '------', options: ['------', 'mirror', 'rotate'] }});

  const [letters, setLetters] = useState<Letters>(
    new Array(size * size).fill(Square.BLANK)
  );

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
